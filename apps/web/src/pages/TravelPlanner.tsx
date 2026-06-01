import React, { useEffect, useMemo, useState } from 'react';
import { Bell, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { PlannerTrip, StructuredTravelPlan, TripStatus } from '../types';
import ChatSidebar from '../components/TravelAssistant/ChatSidebar';
import AITravelChat from '../components/TravelAssistant/AITravelChat';
import PlanPanel from '../components/TravelAssistant/PlanPanel';
import ActiveTripsTimelineTab from '../components/TravelAssistant/ActiveTripsTimelineTab';
import { createDraftTrip, loadTripPlannerData, saveTripPlannerData } from '../lib/tripStorage';
import TripCreationModal, {
  CreateTripPayload,
} from '../components/TravelAssistant/TripCreationModal';
import TripEditModal, { TripUpdate } from '../components/TravelAssistant/TripEditModal';
import { usePets } from '../hooks/usePets';

type MainTab = 'assistant' | 'timeline';

const STATUS_LABELS: Record<TripStatus, string> = {
  draft: 'Draft',
  in_progress: 'In progress',
  completed: 'Completed',
};

function getTripProgress(trip: PlannerTrip, plan: StructuredTravelPlan | null): number {
  if (plan?.checklist?.length) {
    const done = plan.checklist.filter((item) => item.completed).length;
    return Math.round((done / plan.checklist.length) * 100);
  }

  if (trip.status === 'completed') return 100;
  if (trip.status === 'in_progress') return 35;
  return 0;
}

function getTripWhenLabel(travelDate: string): string {
  const now = new Date();
  const travel = new Date(travelDate);
  const diffMs = travel.getTime() - now.getTime();
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (Number.isNaN(days)) return 'Date TBD';
  if (days <= 0) return 'Traveling soon';
  if (days < 7) return `In ${days} day${days === 1 ? '' : 's'}`;

  const weeks = Math.ceil(days / 7);
  return `In ${weeks} wk${weeks === 1 ? '' : 's'}`;
}

const TravelPlanner: React.FC = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState<PlannerTrip[]>([]);
  const [plansByTripId, setPlansByTripId] = useState<Record<string, StructuredTravelPlan | null>>(
    {}
  );
  const [activeTripId, setActiveTripId] = useState('');
  const [contextRevision, setContextRevision] = useState(0);
  const [mainTab, setMainTab] = useState<MainTab>('assistant');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTripId, setEditingTripId] = useState('');

  const { pets, isLoading: isLoadingPets, error: petsError, createPet } = usePets(user?.id);

  const displayName: string = user?.user_metadata?.display_name || '';
  const initials = displayName
    ? displayName
        .split(' ')
        .map((w: string) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'SK';

  useEffect(() => {
    const stored = loadTripPlannerData();
    setTrips(stored.trips);
    setPlansByTripId(stored.plansByTripId);
    setActiveTripId(stored.trips[0]?.id || '');
  }, []);

  useEffect(() => {
    if (!trips.length) {
      setActiveTripId('');
      return;
    }

    const activeStillExists = trips.some((trip) => trip.id === activeTripId);
    if (!activeStillExists) {
      setActiveTripId(trips[0].id);
    }
  }, [trips, activeTripId]);

  useEffect(() => {
    if (!trips.length) return;

    const timeout = window.setTimeout(() => {
      saveTripPlannerData({
        version: 1,
        trips,
        plansByTripId,
      });
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [trips, plansByTripId]);

  const activeTrip = useMemo(
    () => trips.find((trip) => trip.id === activeTripId) || null,
    [trips, activeTripId]
  );

  const activePlan = useMemo(() => {
    if (!activeTripId) return null;
    return plansByTripId[activeTripId] || null;
  }, [plansByTripId, activeTripId]);

  const sidebarTrips = useMemo(
    () =>
      trips.map((trip) => ({
        ...trip,
        route: `${trip.origin} → ${trip.destination}`,
        when: getTripWhenLabel(trip.travelDate),
        progress: getTripProgress(trip, plansByTripId[trip.id] || null),
        badge: STATUS_LABELS[trip.status],
      })),
    [trips, plansByTripId]
  );

  const activeTrips = useMemo(() => trips.filter((trip) => trip.status !== 'completed'), [trips]);

  const handleCreateTrip = (payload: CreateTripPayload) => {
    const draftTrip = createDraftTrip({
      petName: payload.petName,
      petEmoji: payload.petEmoji,
      species: payload.species,
      breed: payload.breed,
      origin: payload.origin,
      destination: payload.destination,
      travelDate: payload.travelDate,
      vaccinationStatus: payload.vaccinationStatus,
      status: payload.status,
    });

    setTrips((prev) => [draftTrip, ...prev]);
    setActiveTripId(draftTrip.id);
    setContextRevision((prev) => prev + 1);
  };

  const handleOpenCreateTrip = () => {
    setIsCreateModalOpen(true);
  };

  const handleOpenEditTrip = (tripId: string) => {
    setEditingTripId(tripId);
  };

  const handleCloseEditTrip = () => {
    setEditingTripId('');
  };

  const handleSelectTrip = (tripId: string) => {
    setActiveTripId(tripId);
    setContextRevision((prev) => prev + 1);
  };

  const handleUpdateTrip = (tripId: string, updates: TripUpdate) => {
    setTrips((prev) =>
      prev.map((trip) =>
        trip.id === tripId
          ? {
              ...trip,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : trip
      )
    );

    if (tripId === activeTripId) {
      setContextRevision((prev) => prev + 1);
    }
  };

  const handleSetTripStatus = (tripId: string, status: TripStatus) => {
    setTrips((prev) =>
      prev.map((trip) =>
        trip.id === tripId
          ? {
              ...trip,
              status,
              updatedAt: new Date().toISOString(),
            }
          : trip
      )
    );
  };

  const handleDeleteTrip = (tripId: string) => {
    const remainingTrips = trips.filter((trip) => trip.id !== tripId);
    if (!remainingTrips.length) {
      setTrips([]);
      setPlansByTripId({});
      setActiveTripId('');
      setIsCreateModalOpen(true);
      setContextRevision((prev) => prev + 1);
      return;
    }

    setTrips(remainingTrips);
    setPlansByTripId((prev) => {
      const next = { ...prev };
      delete next[tripId];
      return next;
    });

    if (tripId === activeTripId) {
      setActiveTripId(remainingTrips[0].id);
      setContextRevision((prev) => prev + 1);
    }
  };

  const handlePlanGenerated = (plan: StructuredTravelPlan | null) => {
    if (!activeTripId || !plan) return;

    setPlansByTripId((prev) => ({
      ...prev,
      [activeTripId]: plan,
    }));

    setTrips((prev) =>
      prev.map((trip) =>
        trip.id === activeTripId
          ? {
              ...trip,
              origin: plan.origin || trip.origin,
              destination: plan.destination || trip.destination,
              species: plan.species || trip.species,
              breed: plan.breed || trip.breed,
              travelDate: plan.travelDate || trip.travelDate,
              status: 'in_progress',
              updatedAt: new Date().toISOString(),
            }
          : trip
      )
    );
  };

  const handleToggleChecklistTask = (taskId: string) => {
    if (!activeTripId) return;

    setPlansByTripId((prev) => {
      const currentPlan = prev[activeTripId];
      if (!currentPlan) return prev;

      const checklist = currentPlan.checklist.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );

      const timeline = currentPlan.timeline.map((item) => ({
        ...item,
        tasks: item.tasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        ),
      }));

      return {
        ...prev,
        [activeTripId]: {
          ...currentPlan,
          checklist,
          timeline,
        },
      };
    });
  };

  const activeTripLabel = activeTrip
    ? `${activeTrip.petName} → ${activeTrip.destination}`
    : 'Select a trip';

  const editingTrip = useMemo(
    () => trips.find((trip) => trip.id === editingTripId) || null,
    [trips, editingTripId]
  );

  return (
    <>
      <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Top breadcrumb bar */}
      <div className="px-5 py-3 bg-white border-b border-gray-100 flex items-center gap-3 flex-shrink-0">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <button className="hover:text-gray-900">My Trips</button>
          <ChevronRight size={12} />
          <span className="text-gray-900 font-semibold">{activeTripLabel}</span>
        </div>
        <div className="ml-4 inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 p-1 text-xs">
          <button
            onClick={() => setMainTab('assistant')}
            className={`px-3 py-1 rounded-full font-semibold transition ${
              mainTab === 'assistant'
                ? 'bg-gradient-to-r from-orange-400 to-pink-400 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Assistant
          </button>
          <button
            onClick={() => setMainTab('timeline')}
            className={`px-3 py-1 rounded-full font-semibold transition ${
              mainTab === 'timeline'
                ? 'bg-gradient-to-r from-orange-400 to-pink-400 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Timeline
          </button>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100">
            <Bell size={15} />
          </button>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-300 to-pink-300 text-white flex items-center justify-center font-bold text-sm">
            {initials}
          </div>
        </div>
      </div>

      {/* 3-panel body */}
      <div className="flex-1 flex min-h-0">
        <ChatSidebar
          activeId={activeTripId}
          trips={sidebarTrips}
          onSelect={handleSelectTrip}
          onCreateTrip={handleOpenCreateTrip}
          onEditTrip={handleOpenEditTrip}
          onDeleteTrip={handleDeleteTrip}
          userName={displayName || 'Sara K.'}
          userSub={`Free plan · ${trips.length} trip${trips.length === 1 ? '' : 's'}`}
        />
        <div className={`flex-1 min-w-0 ${mainTab === 'assistant' ? 'flex' : 'hidden'}`}>
          <AITravelChat
            onPlanGenerated={handlePlanGenerated}
            activeTrip={activeTrip}
            contextRevision={contextRevision}
          />
        </div>
        <div className={`flex-1 min-w-0 ${mainTab === 'timeline' ? 'flex' : 'hidden'}`}>
          <ActiveTripsTimelineTab
            activeTrip={activeTrip}
            plan={activePlan}
            activeTrips={activeTrips}
            onSelectTrip={handleSelectTrip}
            onToggleTask={handleToggleChecklistTask}
            onSetTripStatus={handleSetTripStatus}
          />
        </div>
        <PlanPanel
          plan={activePlan}
          tripLabel={activeTripLabel}
          petEmoji={activeTrip?.petEmoji || '🐾'}
          onToggleTask={handleToggleChecklistTask}
        />
      </div>

      </div>

      <TripCreationModal
        isOpen={isCreateModalOpen}
        pets={pets}
        isLoadingPets={isLoadingPets}
        petsError={petsError}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateTrip={handleCreateTrip}
        onCreatePet={createPet}
      />

      <TripEditModal
        isOpen={Boolean(editingTripId)}
        trip={editingTrip}
        pets={pets}
        onClose={handleCloseEditTrip}
        onSave={handleUpdateTrip}
      />
    </>
  );
};

export default TravelPlanner;
