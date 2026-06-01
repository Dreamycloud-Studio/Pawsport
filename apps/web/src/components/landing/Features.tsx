import React from 'react';
import { mascots } from '../../assets/images';

const STEPS = [
  { n: '01', title: 'Tell us about your pet', body: 'Species, weight, microchip status. 30 seconds.' },
  { n: '02', title: 'Pick a destination',     body: 'Browse 84 countries — or ask the AI which route is easiest.' },
  { n: '03', title: 'Get a dated plan',        body: 'Vet visits, papers, flights, prep. All scheduled, all explained.' },
  { n: '04', title: 'Refer to it, six weeks long', body: 'Your checklist auto-saves and can be shared with your vet.' },
];

const Features: React.FC = () => {
  return (
    <section className="bg-white border-y border-calm-sand px-6 py-16 md:px-12 md:py-28">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-12 gap-12">
          {/* Left — heading + mascot */}
          <div className="md:col-span-5">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-calm-clay font-bold mb-4">
              <span className="w-8 h-px bg-calm-clay" />
              How it works
            </div>
            <h2
              className="font-bold text-calm-charcoal mb-5 text-4xl md:text-6xl"
              style={{ letterSpacing: '-0.025em' }}
            >
              A plan you can{' '}
              <span className="italic" style={{ color: '#5b6f4c' }}>
                follow
              </span>
              .
            </h2>
            <p className="text-calm-charcoal/70 mb-6 max-w-md">
              Pet relocation has ~40 dependent tasks. We linearize them into one quiet, weekly cadence.
            </p>

            <div className="relative w-full max-w-[260px]">
              <div className="bg-white rounded-3xl border-4 border-calm-sand shadow-lift p-4">
                <img
                  src={mascots.suitcase}
                  alt="Pet with suitcase"
                  className="w-full h-auto"
                  draggable="false"
                />
              </div>
            </div>
          </div>

          {/* Right — numbered steps */}
          <div className="md:col-span-7 space-y-4">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="flex gap-5 bg-calm-cream rounded-3xl p-6 border border-calm-sand hover:bg-white transition-colors"
              >
                <div
                  className="flex-shrink-0 text-2xl font-bold text-calm-terracotta tabular-nums"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  {s.n}
                </div>
                <div>
                  <h3
                    className="text-xl font-bold text-calm-charcoal mb-1.5"
                    style={{ letterSpacing: '-0.01em' }}
                  >
                    {s.title}
                  </h3>
                  <p className="text-calm-charcoal/70">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
