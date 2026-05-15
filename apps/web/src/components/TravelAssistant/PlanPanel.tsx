import React, { useState } from 'react';
import { Share2, Download, Edit2 } from 'lucide-react';
import { StructuredTravelPlan } from '../../types';

interface PlanItem {
  id: number | string;
  group: 'VET' | 'DOCS' | 'FLIGHT' | 'PREP';
  color: string;
  task: string;
  sub: string;
  done: boolean;
  date: string;
  important?: boolean;
}

const GROUP_COLORS: Record<string, string> = {
  VET: '#fb923c',
  DOCS: '#a855f7',
  FLIGHT: '#ec4899',
  PREP: '#10b981',
};

const GROUP_LABELS: Record<string, string> = {
  VET: 'Veterinary',
  DOCS: 'Documentation',
  FLIGHT: 'Booking',
  PREP: 'Preparation',
};

const CATEGORY_TO_GROUP: Record<string, string> = {
  veterinary: 'VET',
  documentation: 'DOCS',
  booking: 'FLIGHT',
  preparation: 'PREP',
};

const DEMO_ITEMS: PlanItem[] = [
  { id: 1, group: 'VET', color: GROUP_COLORS.VET, task: 'ISO 11784 microchip', sub: 'On file · Dr. Larsen', done: true, date: 'Done' },
  { id: 2, group: 'VET', color: GROUP_COLORS.VET, task: 'Rabies booster', sub: '21+ days before flight', done: true, date: 'Jun 02' },
  { id: 3, group: 'VET', color: GROUP_COLORS.VET, task: 'Tapeworm treatment', sub: '24–120h before arrival', done: false, date: 'Jul 19', important: true },
  { id: 4, group: 'DOCS', color: GROUP_COLORS.DOCS, task: 'EU pet passport', sub: 'Apply 4 weeks out', done: false, date: 'Jun 15' },
  { id: 5, group: 'DOCS', color: GROUP_COLORS.DOCS, task: 'Annex IV form', sub: 'Not required — personal', done: true, date: 'Skip' },
  { id: 6, group: 'FLIGHT', color: GROUP_COLORS.FLIGHT, task: 'Book Air France slot', sub: 'Pet space limited', done: false, date: 'Jul 01', important: true },
  { id: 7, group: 'PREP', color: GROUP_COLORS.PREP, task: 'Carrier training', sub: '2 weeks of acclimation', done: false, date: 'Jul 08' },
  { id: 8, group: 'PREP', color: GROUP_COLORS.PREP, task: 'Comfort pack', sub: 'Blanket, treats, water', done: false, date: 'Jul 21' },
];

function planToItems(plan: StructuredTravelPlan): PlanItem[] {
  return plan.checklist.map((t, i) => ({
    id: t.id || i,
    group: (CATEGORY_TO_GROUP[t.category] || 'PREP') as PlanItem['group'],
    color: GROUP_COLORS[CATEGORY_TO_GROUP[t.category] || 'PREP'],
    task: t.title,
    sub: t.description,
    done: t.completed,
    date: t.estimatedDuration || '—',
    important: t.priority === 'high',
  }));
}

const GROUPS: PlanItem['group'][] = ['VET', 'DOCS', 'FLIGHT', 'PREP'];

interface PlanPanelProps {
  plan?: StructuredTravelPlan | null;
  tripLabel?: string;
  petEmoji?: string;
}

const PlanPanel: React.FC<PlanPanelProps> = ({
  plan,
  tripLabel = 'Bella → Paris 🇫🇷',
  petEmoji = '🐶',
}) => {
  const [demoItems, setDemoItems] = useState<PlanItem[]>(DEMO_ITEMS);
  const [saved, setSaved] = useState(true);

  const toggle = (id: number | string) => {
    setSaved(false);
    setDemoItems((xs) => xs.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
    setTimeout(() => setSaved(true), 800);
  };

  const displayItems = plan ? planToItems(plan) : demoItems;
  const total = displayItems.length;
  const done = displayItems.filter((i) => i.done).length;

  return (
    <div className="bg-gray-50 border-l border-gray-100 flex flex-col flex-shrink-0 w-96">
      <div className="p-5 border-b border-gray-100 bg-white flex-shrink-0">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-300 to-pink-300 text-white flex items-center justify-center text-xl">
            {petEmoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
              Active trip · auto-saving
            </div>
            <div className="font-bold text-gray-900 truncate">{tripLabel}</div>
          </div>
          <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100">
            <Edit2 size={13} />
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-500">Progress</span>
          <span className="ml-auto font-bold text-gray-900">
            {done} / {total}
          </span>
        </div>
        <div className="h-2 rounded-full bg-gray-100 overflow-hidden mt-1.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-orange-400 via-pink-400 to-purple-500 transition-all duration-500"
            style={{ width: `${total > 0 ? (done / total) * 100 : 0}%` }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {GROUPS.map((g) => {
          const list = displayItems.filter((i) => i.group === g);
          if (!list.length) return null;
          const color = GROUP_COLORS[g];
          return (
            <div key={g} className="mb-5">
              <div
                className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold mb-2.5"
                style={{ color }}
              >
                <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                {GROUP_LABELS[g]}
              </div>
              <div className="space-y-2">
                {list.map((it) => (
                  <div
                    key={it.id}
                    className={`flex items-start gap-3 bg-white rounded-2xl border border-gray-100 p-3 hover:border-gray-200 transition ${
                      it.important && !it.done ? 'ring-2 ring-orange-100' : ''
                    }`}
                  >
                    <button
                      onClick={() => !plan && toggle(it.id)}
                      className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition ${
                        it.done
                          ? 'bg-gradient-to-r from-orange-400 to-pink-400 border-transparent text-white'
                          : 'border-gray-300 hover:border-orange-400'
                      }`}
                    >
                      {it.done && <span className="text-[10px] leading-none">✓</span>}
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <div
                          className={`text-sm font-semibold ${
                            it.done ? 'text-gray-400 line-through' : 'text-gray-900'
                          }`}
                        >
                          {it.task}
                        </div>
                        {it.important && !it.done && (
                          <span className="text-[9px] uppercase tracking-wider font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded-md">
                            Soon
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5">{it.sub}</div>
                    </div>
                    <span className="text-[10px] text-gray-400 font-semibold whitespace-nowrap pt-0.5">
                      {it.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-5 py-3.5 border-t border-gray-100 bg-white flex items-center gap-2 flex-shrink-0">
        <span className="text-[11px] text-gray-500 flex items-center gap-1.5 mr-auto">
          <span
            className={`w-1.5 h-1.5 rounded-full ${saved ? 'bg-green-500' : 'bg-yellow-400'}`}
          />
          {saved ? 'Saved · just now' : 'Saving…'}
        </span>
        <button className="w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600">
          <Share2 size={14} />
        </button>
        <button className="w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600">
          <Download size={14} />
        </button>
        <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-900 text-white rounded-full text-xs font-semibold">
          <Edit2 size={12} /> Edit
        </button>
      </div>
    </div>
  );
};

export default PlanPanel;
