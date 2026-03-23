import { RagResponse } from "../types";

export async function queryRegulations(
  question: string,
  destinationCountry: string,
  petType: string,
  apiBaseUrl: string
): Promise<RagResponse> {
  const response = await fetch(`${apiBaseUrl}/api/rag/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, destinationCountry, petType }),
  });
  if (!response.ok) {
    throw new Error(`RAG query failed: ${response.statusText}`);
  }
  return response.json();
}
