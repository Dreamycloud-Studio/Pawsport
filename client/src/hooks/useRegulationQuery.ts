import { useState } from "react";

interface RegulationQueryResult {
  answer: string;
  sources: { name: string; url: string; topic: string }[];
}

interface UseRegulationQueryReturn {
  ask: (question: string, country: string, petType: "dog" | "cat") => Promise<void>;
  result: RegulationQueryResult | null;
  loading: boolean;
  error: string | null;
}

export function useRegulationQuery(): UseRegulationQueryReturn {
  const [result, setResult] = useState<RegulationQueryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function ask(question: string, country: string, petType: "dog" | "cat") {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/regulations/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          destinationCountry: country,
          petType,
        }),
      });
      if (!res.ok) throw new Error(`Query failed: ${res.statusText}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return { ask, result, loading, error };
}
