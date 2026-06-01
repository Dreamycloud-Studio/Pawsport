import React, { useMemo, useState } from 'react';
import { Calendar, CheckCircle2, Plane, AlertTriangle } from 'lucide-react';
import { PlannerTrip, StructuredTravelPlan, TimelineTask, TripStatus } from '../../types';

type CategoryFilter = 'all' | 'veterinary' | 'documentation' | 'booking' | 'preparation';

interface ActiveTripsTimelineTabProps {
  activeTrip: PlannerTrip | null;
  plan: StructuredTravelPlan | null;
  activeTrips: PlannerTrip[];
  onSelectTrip?: (tripId: string) => void;
  onToggleTask?: (taskId: string) => void;
  onSetTripStatus?: (tripId: string, status: TripStatus) => void;
}

interface TimelineRow {
  id: string;
  itemTitle: string;
  category: CategoryFilter;
  daysBeforeTravel: number;
  task: TimelineTask;
}

const CATEGORY_META: Record<
  Exclude<CategoryFilter, 'all'>,
  { label: string; color: string; dot: string }
> = {
  veterinary: { label: 'Veterinary', color: '#fb923c', dot: 'bg-orange-400' },
  documentation: { label: 'Documentation', color: '#a855f7', dot: 'bg-purple-500' },
  booking: { label: 'Booking', color: '#ec4899', dot: 'bg-pink-500' },
  preparation: { label: 'Preparation', color: '#10b981', dot: 'bg-emerald-500' },
};

function getDaysUntilTravel(travelDate: string): number {
  const now = new Date();
  const target = new Date(travelDate);
  const diffMs = target.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

function formatDateLabel(travelDate: string, daysBeforeTravel: number): string {
  const travel = new Date(travelDate);
  const target = new Date(travel);
  target.setDate(target.getDate() - daysBeforeTravel);

  return target.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

const ActiveTripsTimelineTab: React.FC<ActiveTripsTimelineTabProps> = ({
  activeTrip,
  plan,
  activeTrips,
  onSelectTrip,
  onToggleTask,
  onSetTripStatus,
}) => {
  const [filter, setFilter] = useState<CategoryFilter>('all');

  const rows = useMemo<TimelineRow[]>(() => {
    if (!plan?.timeline?.length) return [];

    const flattened = plan.timeline.flatMap((item) =>
      item.tasks.map((task) => ({
        id: `${item.id}_${task.id}`,
        itemTitle: item.title,
        category: item.category,
        daysBeforeTravel: item.daysBeforeTravel,
        task,
      }))
    );

    return flattened
      .filter((row) => filter === 'all' || row.category === filter)
      .sort((a, b) => b.daysBeforeTravel - a.daysBeforeTravel);
  }, [plan, filter]);

  const completedCount = rows.filter((row) => row.task.completed).length;
  const progress = rows.length ? Math.round((completedCount / rows.length) * 100) : 0;
  const daysUntilTravel = activeTrip ? getDaysUntilTravel(activeTrip.travelDate) : 0;

  return (
    <div className="flex-1 min-w-0 bg-gradient-to-br from-orange-50 via-amber-50 to-pink-50 px-6 py-6 overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl border border-orange-100 shadow-sm p-5 mb-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                Active trip timeline
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mt-1">
                {activeTrip
                  ? `${activeTrip.petName} · ${activeTrip.origin} to ${activeTrip.destination}`
                  : 'Select a trip to manage timeline'}
              </h2>
              {activeTrip && (
                <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <Calendar size={14} />
                  <span>
                    Flight in {daysUntilTravel > 0 ? daysUntilTravel : 0} day
                    {daysUntilTravel === 1 ? '' : 's'}
                  </span>
                </div>
              )}
            </div>
            {activeTrip && (
              <div className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 p-1 bg-gray-50 text-xs">
                <button
                  onClick={() => onSetTripStatus?.(activeTrip.id, 'draft')}
                  className={`px-3 py-1.5 rounded-xl font-semibold ${
                    activeTrip.status === 'draft' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  Draft
                </button>
                <button
                  onClick={() => onSetTripStatus?.(activeTrip.id, 'in_progress')}
                  className={`px-3 py-1.5 rounded-xl font-semibold ${
                    activeTrip.status === 'in_progress'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500'
                  }`}
                >
                  In progress
                </button>
                <button
                  onClick={() => onSetTripStatus?.(activeTrip.id, 'completed')}
                  className={`px-3 py-1.5 rounded-xl font-semibold ${
                    activeTrip.status === 'completed'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500'
                  }`}
                >
                  Completed
                </button>
              </div>
            )}
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-2xl border border-gray-100 p-3 bg-gray-50/60">
              <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Tasks</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{rows.length}</div>
            </div>
            <div className="rounded-2xl border border-gray-100 p-3 bg-gray-50/60">
              <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Completed</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{completedCount}</div>
            </div>
            <div className="rounded-2xl border border-gray-100 p-3 bg-gray-50/60">
              <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Progress</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{progress}%</div>
            </div>
          </div>

          <div className="h-2 rounded-full bg-gray-100 overflow-hidden mt-4">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-400 via-pink-400 to-purple-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {activeTrips.length > 1 && (
          <div className="mb-5 flex flex-wrap gap-2">
            {activeTrips.map((trip) => {
              const isActive = activeTrip?.id === trip.id;
              return (
                <button
                  key={trip.id}
                  onClick={() => onSelectTrip?.(trip.id)}
                  className={`px-3 py-2 rounded-2xl border text-sm font-semibold transition ${
                    isActive
                      ? 'bg-white border-orange-300 text-gray-900 shadow-sm'
                      : 'bg-white/80 border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {trip.petEmoji} {trip.origin} to {trip.destination}
                </button>
              );
            })}
          </div>
        )}

        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border-2 transition ${
              filter === 'all'
                ? 'bg-gray-800 border-gray-800 text-white'
                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            All tasks
          </button>
          {(Object.keys(CATEGORY_META) as Exclude<CategoryFilter, 'all'>[]).map((key) => {
            const meta = CATEGORY_META[key];
            const active = filter === key;
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border-2 transition ${
                  active
                    ? 'text-white'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
                style={
                  active
                    ? {
                        backgroundColor: meta.color,
                        borderColor: meta.color,
                      }
                    : undefined
                }
              >
                {meta.label}
              </button>
            );
          })}
        </div>

        {!activeTrip && (
          <div className="bg-white rounded-3xl border border-gray-100 p-6 text-gray-600 text-sm">
            Pick a trip in the sidebar to open a timeline view.
          </div>
        )}

        {activeTrip && !rows.length && (
          <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-6 text-sm text-gray-600">
            Timeline tasks will appear after generating a plan in the Assistant tab.
          </div>
        )}

        {activeTrip && rows.length > 0 && (
          <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
            <div className="relative h-2 rounded-full bg-gray-100 mb-8">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-200 via-pink-200 to-purple-200" />
              <div className="absolute -top-7 left-0 text-[10px] font-bold text-gray-400">TODAY</div>
              <div className="absolute -top-7 right-0 text-[10px] font-bold text-pink-600">FLIGHT</div>
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 text-white flex items-center justify-center shadow">
                <Plane size={11} />
              </div>
            </div>

            <div className="space-y-2">
              {rows.map((row) => {
                const meta = CATEGORY_META[row.category];
                const taskDate = formatDateLabel(activeTrip.travelDate, row.daysBeforeTravel);
                const isPast = row.daysBeforeTravel > daysUntilTravel;

                return (
                  <div
                    key={row.id}
                    className={`grid grid-cols-12 gap-3 items-start rounded-2xl p-3 border transition ${
                      row.task.completed ? 'border-gray-100 bg-gray-50/50' : 'border-gray-100 bg-white'
                    }`}
                  >
                    <div className="col-span-12 md:col-span-2">
                      <div className={`text-xs font-bold ${isPast ? 'text-red-500' : 'text-gray-900'}`}>
                        {taskDate}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {row.daysBeforeTravel} day{row.daysBeforeTravel === 1 ? '' : 's'} before
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-1 flex md:justify-center pt-0.5">
                      <span className={`w-3 h-3 rounded-full ${meta.dot}`} />
                    </div>
                    <div className="col-span-12 md:col-span-7">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => onToggleTask?.(row.task.id)}
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                            row.task.completed
                              ? 'bg-gradient-to-r from-orange-400 to-pink-400 border-transparent text-white'
                              : 'border-gray-300 hover:border-orange-400'
                          }`}
                          aria-label={`Toggle ${row.task.title}`}
                        >
                          {row.task.completed && <CheckCircle2 size={12} />}
                        </button>
                        <span
                          className={`text-sm font-semibold ${
                            row.task.completed ? 'text-gray-400 line-through' : 'text-gray-900'
                          }`}
                        >
                          {row.task.title}
                        </span>
                        {isPast && !row.task.completed && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-1.5 py-0.5 rounded-md">
                            <AlertTriangle size={10} />
                            Overdue
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{row.itemTitle}</div>
                      {row.task.description && (
                        <div className="text-xs text-gray-500 mt-0.5">{row.task.description}</div>
                      )}
                    </div>
                    <div className="col-span-12 md:col-span-2 md:text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: meta.color }}>
                        {meta.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveTripsTimelineTab;
