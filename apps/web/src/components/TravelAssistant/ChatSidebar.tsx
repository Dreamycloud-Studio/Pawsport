import React from 'react';
import { PawPrint, Plus } from 'lucide-react';

const PETS = [
  { id: 'bella', name: 'Bella', kind: '🐶 Beagle · 9kg' },
  { id: 'mochi', name: 'Mochi', kind: '🐱 Calico · 4kg' },
];

const TRIPS = [
  { id: 't1', pet: 'Bella', route: 'NYC → Paris', when: 'In 5 wks', progress: 34, badge: 'In progress' },
  { id: 't2', pet: 'Bella', route: 'NYC → London', when: 'Drafted', progress: 0, badge: 'Draft' },
  { id: 't3', pet: 'Mochi', route: 'NYC → Tokyo', when: 'Saved', progress: 12, badge: 'Drafted' },
];

interface ChatSidebarProps {
  activeId?: string;
  onSelect?: (id: string) => void;
  userName?: string;
  userSub?: string;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  activeId = 't1',
  onSelect,
  userName = 'Sara K.',
  userSub = 'Free plan · 2 trips',
}) => {
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

      <button className="m-3 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 text-white text-sm font-semibold">
        <Plus size={14} /> New trip
      </button>

      <div className="px-4 pb-2 text-[10px] uppercase tracking-wider text-gray-400 font-bold">Pets</div>
      <div className="px-3 space-y-1">
        {PETS.map((p) => (
          <button
            key={p.id}
            className="w-full flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-gray-50 text-left"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center text-base">
              {p.kind.slice(0, 2)}
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
          {TRIPS.length}
        </span>
      </div>
      <div className="px-3 space-y-1 flex-1 overflow-auto">
        {TRIPS.map((t) => {
          const active = t.id === activeId;
          return (
            <button
              key={t.id}
              onClick={() => onSelect?.(t.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl border transition ${
                active
                  ? 'bg-orange-50 border-orange-200'
                  : 'bg-white border-transparent hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-gray-900">{t.route}</span>
                <span className="text-[9px] uppercase tracking-wider font-bold text-gray-400">
                  {t.badge}
                </span>
              </div>
              <div className="text-[11px] text-gray-500 mb-1.5">
                {t.pet} · {t.when}
              </div>
              <div className="h-1 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-400 to-pink-400"
                  style={{ width: `${t.progress}%` }}
                />
              </div>
            </button>
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
