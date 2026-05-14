import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Clock, ArrowRight } from 'lucide-react';

interface Destination {
  cc: string;
  name: string;
  city: string;
  difficulty: number;
  lead: string;
  highlight: string;
  color: string;
}

const flag = (cc: string): string =>
  ({
    GB: '🇬🇧', JP: '🇯🇵', FR: '🇫🇷', AU: '🇦🇺', CA: '🇨🇦', DE: '🇩🇪',
  }[cc] ?? '');

const DESTINATIONS: Destination[] = [
  { cc: 'GB', name: 'United Kingdom', city: 'London',  difficulty: 2, lead: '4–6 wks',   highlight: 'Pet passport supported',  color: '#3b82f6' },
  { cc: 'JP', name: 'Japan',          city: 'Tokyo',   difficulty: 4, lead: '7+ months', highlight: '180-day rabies wait',      color: '#ec4899' },
  { cc: 'FR', name: 'France',         city: 'Paris',   difficulty: 2, lead: '4–6 wks',   highlight: 'EU pet passport',          color: '#a855f7' },
  { cc: 'AU', name: 'Australia',      city: 'Sydney',  difficulty: 4, lead: '6+ months', highlight: 'Quarantine required',      color: '#f97316' },
  { cc: 'CA', name: 'Canada',         city: 'Toronto', difficulty: 1, lead: '2–4 wks',   highlight: 'Rabies cert + microchip',  color: '#10b981' },
  { cc: 'DE', name: 'Germany',        city: 'Berlin',  difficulty: 2, lead: '4–6 wks',   highlight: 'EU pet passport',          color: '#8b5cf6' },
];

const DIFFICULTY_LABELS = ['', 'Easy', 'Easy', 'Moderate', 'Hard'];

const DifficultyMeter: React.FC<{ level: number; color: string }> = ({ level, color }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 4 }).map((_, i) => (
      <span
        key={i}
        className="text-[11px]"
        style={{ color: i < level ? color : 'rgba(0,0,0,0.12)' }}
      >
        🐾
      </span>
    ))}
  </div>
);

const Destinations: React.FC = () => {
  const [query, setQuery] = useState('');
  const filtered = DESTINATIONS.filter(
    (d) =>
      !query ||
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.city.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <section className="bg-calm-cream px-6 py-16 md:px-12 md:py-28">
      <div className="max-w-7xl mx-auto">
        {/* Header row */}
        <div className="flex flex-wrap items-end justify-between mb-10 gap-4">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-calm-clay font-bold mb-4">
              <span className="w-8 h-px bg-calm-clay" />
              Destination index
            </div>
            <h2
              className="font-bold text-calm-charcoal text-4xl md:text-6xl"
              style={{ letterSpacing: '-0.025em' }}
            >
              Where will{' '}
              <span style={{ color: '#b85e3e' }} className="italic">
                they
              </span>{' '}
              go?
            </h2>
            <p className="text-calm-charcoal/70 mt-4">
              Each country has its own pet import rules. We've mapped 84. Browse before you book.
            </p>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 bg-white rounded-full px-3 py-2 shadow-sm border border-calm-sand">
            <Search className="w-4 h-4 text-calm-charcoal/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent text-sm focus:outline-none placeholder-calm-charcoal/40 w-48 md:w-56"
              placeholder="Country, city, or route…"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((d) => (
            <Link to="/travel-planner" key={d.cc}>
              <div className="group relative bg-white rounded-3xl overflow-hidden border border-calm-sand hover:shadow-lift hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full">
                {/* Flag area */}
                <div
                  className="h-32 relative flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${d.color}22, ${d.color}11)` }}
                >
                  <span className="text-7xl">{flag(d.cc)}</span>
                  <div
                    className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: d.color }}
                  >
                    {DIFFICULTY_LABELS[d.difficulty] ?? 'Moderate'}
                  </div>
                </div>

                {/* Card body */}
                <div className="p-5">
                  <div className="text-[10px] uppercase tracking-wider text-calm-charcoal/40 font-bold">
                    {d.city}
                  </div>
                  <h3
                    className="text-xl font-bold text-calm-charcoal mb-2"
                    style={{ letterSpacing: '-0.01em' }}
                  >
                    {d.name}
                  </h3>
                  <p className="text-sm text-calm-charcoal/70 mb-3">{d.highlight}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-calm-charcoal/60 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {d.lead}
                    </span>
                    <DifficultyMeter level={d.difficulty} color={d.color} />
                  </div>
                  <div className="mt-4 pt-4 border-t border-calm-sand flex items-center justify-between">
                    <span className="text-sm font-semibold text-calm-charcoal">Plan this route</span>
                    <ArrowRight className="w-4 h-4 text-calm-terracotta group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Destinations;
