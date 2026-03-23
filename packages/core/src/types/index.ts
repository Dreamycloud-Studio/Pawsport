export interface Pet {
  id: string;
  name: string;
  species: "dog" | "cat" | "other";
  breed?: string;
  dateOfBirth: string;
  microchipNumber?: string;
  ownerId: string;
}

export interface Trip {
  id: string;
  petId: string;
  originCountry: string;
  destinationCountry: string;
  travelDate: string;
  status: "planning" | "in_progress" | "completed";
  createdAt: string;
}

export interface RegulationChunk {
  chunkId: string;
  content: string;
  summary: string;
  country: string;
  petTypes: string[];
  topic: "microchip" | "vaccine" | "titer_test" | "timeline" | "quarantine" | "paperwork" | "health_certificate" | "general";
  sourceName: string;
  sourceUrl: string;
  lastUpdated: string;
  similarity?: number;
}

export interface RagResponse {
  answer: string;
  sources: { name: string; url: string; topic: string }[];
  chunks: RegulationChunk[];
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  deadline?: string;
  completed: boolean;
  topic: RegulationChunk["topic"];
}
