import { Client } from "pg";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import type { VercelRequest, VercelResponse } from "@vercel/node";

// ── Types ──────────────────────────────────────────────────────────────────

interface QueryRequestBody {
  question: string;
  destinationCountry: string; // ISO 3166-1 alpha-2, e.g. "JP"
  petType: "dog" | "cat";
}

interface RegulationChunk {
  content: string;
  source_name: string;
  source_url: string;
  topic: string;
  similarity: number;
}

interface QueryResponse {
  answer: string;
  sources: { name: string; url: string; topic: string }[];
}

// ── Query rewriting ────────────────────────────────────────────────────────

async function rewriteQuery(
  anthropic: Anthropic,
  question: string,
  destinationCountry: string,
  petType: string
): Promise<string> {
  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 256,
    messages: [
      {
        role: "user",
        content: `Rewrite this pet travel question as a rich search query optimised for semantic similarity search over regulation documents.
Include the destination country (${destinationCountry}), pet type (${petType}), and any specific regulatory topics mentioned.
Return ONLY the rewritten query string. No preamble.

Question: ${question}`,
      },
    ],
  });

  return (message.content[0] as { type: "text"; text: string }).text.trim();
}

// ── Vector search ──────────────────────────────────────────────────────────

async function searchRegulations(
  queryEmbedding: number[],
  country: string,
  petType: string,
  db: Client
): Promise<RegulationChunk[]> {
  const vectorLiteral = `[${queryEmbedding.join(",")}]`;

  const result = await db.query<RegulationChunk>(
    `SELECT
       content,
       source_name,
       source_url,
       topic,
       1 - (embedding <=> $1::vector) AS similarity
     FROM regulation_chunks
     WHERE country = $2
       AND $3 = ANY(pet_types)
     ORDER BY embedding <=> $1::vector
     LIMIT 8`,
    [vectorLiteral, country, petType]
  );

  return result.rows;
}

// ── Answer generation ──────────────────────────────────────────────────────

async function generateAnswer(
  anthropic: Anthropic,
  question: string,
  chunks: RegulationChunk[]
): Promise<string> {
  const excerpts = chunks
    .map((c, i) => `[${i + 1}] ${c.source_name} (${c.topic}):\n${c.content}`)
    .join("\n\n");

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `You are a pet travel compliance assistant. Answer the user's question using ONLY the regulation excerpts below.

Rules:
- Cite sources inline using [Source Name] format
- Be specific about timelines, test names, and document names
- If the excerpts don't contain enough information, say exactly: "I don't have complete information on this — please verify with the official source."
- Never guess or infer requirements not explicitly stated in the excerpts

Regulation excerpts:
${excerpts}

User question: ${question}`,
      },
    ],
  });

  return (message.content[0] as { type: "text"; text: string }).text;
}

// ── Handler ────────────────────────────────────────────────────────────────

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.POSTGRES_READONLY_URL) {
    return res.status(500).json({ error: "POSTGRES_READONLY_URL is not configured. Do not use DATABASE_URL — this repo must use a read-only connection." });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY is not configured." });
  }
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "OPENAI_API_KEY is not configured." });
  }

  const { question, destinationCountry, petType } =
    req.body as QueryRequestBody;

  if (!question || !destinationCountry || !petType) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const db = new Client({ connectionString: process.env.POSTGRES_READONLY_URL });

  try {
    await db.connect();

    // Step 1 — rewrite query for better retrieval
    const rewrittenQuery = await rewriteQuery(anthropic, question, destinationCountry, petType);

    // Step 2 — embed the rewritten query
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: rewrittenQuery,
    });
    const queryEmbedding = embeddingResponse.data[0].embedding;

    // Step 3 — metadata-filtered vector search (read-only)
    const chunks = await searchRegulations(
      queryEmbedding,
      destinationCountry,
      petType,
      db
    );

    if (chunks.length === 0) {
      return res.status(200).json({
        answer: `I don't have regulation data for ${destinationCountry} yet. Please check the official government source directly.`,
        sources: [],
      } satisfies QueryResponse);
    }

    // Step 4 — generate cited answer
    const answer = await generateAnswer(anthropic, question, chunks);

    const sources = Array.from(
      new Map(chunks.map((c) => [c.source_url, c])).values()
    ).map((c) => ({ name: c.source_name, url: c.source_url, topic: c.topic }));

    return res.status(200).json({ answer, sources } satisfies QueryResponse);
  } catch (err: any) {
    console.error("Regulation query error:", err);
    return res.status(500).json({
      error: "Internal server error",
      message: err?.message || String(err),
    });
  } finally {
    await db.end();
  }
}
