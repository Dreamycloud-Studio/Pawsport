import { PlannerStoredData, PlannerTrip, StructuredTravelPlan } from '../types';

const STORAGE_KEY = 'pawsport.travelPlanner.v1';
const STORAGE_VERSION = 1;

const DEFAULT_TRIPS: PlannerTrip[] = [
  {
    id: 't1',
    petName: 'Bella',
    petEmoji: '🐶',
    species: 'dog',
    breed: 'Beagle',
    origin: 'New York',
    destination: 'Paris',
    travelDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
    vaccinationStatus: 'up-to-date',
    status: 'in_progress',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 't2',
    petName: 'Bella',
    petEmoji: '🐶',
    species: 'dog',
    breed: 'Beagle',
    origin: 'New York',
    destination: 'London',
    travelDate: new Date(Date.now() + 64 * 24 * 60 * 60 * 1000).toISOString(),
    vaccinationStatus: 'up-to-date',
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 't3',
    petName: 'Mochi',
    petEmoji: '🐱',
    species: 'cat',
    breed: 'Calico',
    origin: 'New York',
    destination: 'Tokyo',
    travelDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    vaccinationStatus: 'up-to-date',
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const DEFAULT_STORED_DATA: PlannerStoredData = {
  version: STORAGE_VERSION,
  trips: DEFAULT_TRIPS,
  plansByTripId: {},
};

function normalizeStoredData(data: unknown): PlannerStoredData {
  if (!data || typeof data !== 'object') {
    return DEFAULT_STORED_DATA;
  }

  const parsed = data as Partial<PlannerStoredData>;
  const trips = Array.isArray(parsed.trips) ? parsed.trips : [];
  const plansByTripId =
    parsed.plansByTripId && typeof parsed.plansByTripId === 'object' ? parsed.plansByTripId : {};

  if (!trips.length) {
    return DEFAULT_STORED_DATA;
  }

  return {
    version: STORAGE_VERSION,
    trips,
    plansByTripId: plansByTripId as Record<string, StructuredTravelPlan | null>,
  };
}

export function loadTripPlannerData(): PlannerStoredData {
  if (typeof window === 'undefined') {
    return DEFAULT_STORED_DATA;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return DEFAULT_STORED_DATA;
  }

  try {
    const parsed = JSON.parse(raw);
    return normalizeStoredData(parsed);
  } catch {
    return DEFAULT_STORED_DATA;
  }
}

export function saveTripPlannerData(data: PlannerStoredData): void {
  if (typeof window === 'undefined') {
    return;
  }

  const normalized = normalizeStoredData(data);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
}

export function createDraftTrip(overrides: Partial<PlannerTrip> = {}): PlannerTrip {
  const now = new Date();
  return {
    id: `trip_${now.getTime()}`,
    petName: 'My Pet',
    petEmoji: '🐾',
    species: 'dog',
    breed: 'Mixed',
    origin: 'New York',
    destination: 'Paris',
    travelDate: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    vaccinationStatus: 'unknown',
    status: 'draft',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    ...overrides,
  };
}
