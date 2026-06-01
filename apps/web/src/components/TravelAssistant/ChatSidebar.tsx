import React from 'react';
import { PawPrint, Pencil, Plus, Trash2 } from 'lucide-react';

type TripStatus = 'draft' | 'in_progress' | 'completed';

interface SidebarTrip {
  id: string;
  petName: string;
  petEmoji: string;
  species: string;
  breed: string;
  route: string;
  when: string;
  progress: number;
  badge: string;
  origin: string;
  destination: string;
  travelDate: string;
  status: TripStatus;
}

interface ChatSidebarProps {
  trips: SidebarTrip[];
  activeId?: string;
  onSelect?: (id: string) => void;
  onCreateTrip?: () => void;
  onEditTrip?: (id: string) => void;
  onDeleteTrip?: (id: string) => void;
  userName?: string;
  userSub?: string;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  trips,
  activeId = '',
  onSelect,
  onCreateTrip,
  onEditTrip,
  onDeleteTrip,
  userName = 'Sara K.',
  userSub = 'Free plan · 2 trips',
}) => {
  const pets = React.useMemo(() => {
    const grouped = new Map<string, { id: string; name: string; kind: string; emoji: string }>();
    trips.forEach((trip) => {
      if (grouped.has(trip.petName)) return;
      grouped.set(trip.petName, {
        id: trip.petName.toLowerCase().replace(/\s+/g, '-'),
        name: trip.petName,
        kind: `${trip.petEmoji} ${trip.breed}`,
        emoji: trip.petEmoji,
      });
    });
    return Array.from(grouped.values());
  }, [trips]);

  const removeTrip = (trip: SidebarTrip) => {
    const confirmed = window.confirm(`Delete ${trip.route} for ${trip.petName}?`);
    if (!confirmed) return;
    onDeleteTrip?.(trip.id);
  };

  const initials = userName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className="bg-white border-r border-gray-100 flex flex-col flex-shrink-0 w-64">
      <div className="px-4 py-4 border-b border-gray-100 flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white"
          style={{ transform: 'rotate(12deg)' }}
        >
          <PawPrint size={16} />
        </div>
        <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600">
          Pawsport
        </span>
      </div>

      <button
        onClick={onCreateTrip}
        className="m-3 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 text-white text-sm font-semibold"
      >
        <Plus size={14} /> New trip
      </button>

      <div className="px-4 pb-2 text-[10px] uppercase tracking-wider text-gray-400 font-bold">Pets</div>
      <div className="px-3 space-y-1">
        {pets.map((p) => (
          <button
            key={p.id}
            className="w-full flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-gray-50 text-left"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center text-base">
              {p.emoji}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-gray-800">{p.name}</div>
              <div className="text-[10px] text-gray-500 truncate">{p.kind}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="px-4 pt-4 pb-2 text-[10px] uppercase tracking-wider text-gray-400 font-bold flex items-center justify-between">
        Saved trips{' '}
        <span className="bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded-md text-[9px]">
          {trips.length}
        </span>
      </div>
      <div className="px-3 space-y-1 flex-1 overflow-auto">
        {trips.map((t) => {
          const active = t.id === activeId;
          return (
            <div
              key={t.id}
              className={`w-full text-left px-3 py-2.5 rounded-xl border transition ${
                active
                  ? 'bg-orange-50 border-orange-200'
                  : 'bg-white border-transparent hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <button
                  onClick={() => onSelect?.(t.id)}
                  className="flex-1 text-left min-w-0"
                >
                  <span className="text-sm font-semibold text-gray-900 block truncate">{t.route}</span>
                </button>
                <span className="text-[9px] uppercase tracking-wider font-bold text-gray-400 whitespace-nowrap">
                  {t.badge}
                </span>
              </div>
              <div className="text-[11px] text-gray-500 mb-1.5 flex items-center gap-2">
                <button onClick={() => onSelect?.(t.id)} className="text-left flex-1 truncate">
                  {t.petName} · {t.when}
                </button>
                <button
                  onClick={() => onEditTrip?.(t.id)}
                  className="w-6 h-6 rounded-full hover:bg-gray-100 text-gray-500 flex items-center justify-center"
                  aria-label="Edit trip"
                >
                  <Pencil size={12} />
                </button>
                <button
                  onClick={() => removeTrip(t)}
                  className="w-6 h-6 rounded-full hover:bg-red-50 text-gray-500 hover:text-red-600 flex items-center justify-center"
                  aria-label="Delete trip"
                >
                  <Trash2 size={12} />
                </button>
              </div>
              <div className="h-1 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-400 to-pink-400"
                  style={{ width: `${t.progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-3 py-3 border-t border-gray-100 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
          {initials}
        </div>
        <div className="text-xs">
          <div className="font-semibold text-gray-800">{userName}</div>
          <div className="text-gray-500">{userSub}</div>
        </div>
      </div>
    </aside>
  );
};

export default ChatSidebar;
