import React from 'react';
import { MessageCircle } from 'lucide-react';

const QUOTES = [
  {
    name: 'Sara & Mochi',
    loc:  'Brooklyn → Tokyo',
    pet:  'Calico cat',
    text: 'The 180-day rabies wait sounded terrifying. Pawsport laid it out as a timeline I could actually follow. Mochi\'s home with us in Shibuya now.',
  },
  {
    name: 'Diego & Pepper',
    loc:  'Madrid → Toronto',
    pet:  'Pomeranian',
    text: 'I had three different vets giving me different paperwork. The AI cross-checked CFIA\'s site and was right every time.',
  },
  {
    name: 'Léa & Biscuit',
    loc:  'Paris → London',
    pet:  'Beagle',
    text: 'What I loved most: the checklist saved itself. I checked things off over six weeks without losing my place.',
  },
];

const Stories: React.FC = () => {
  return (
    <section className="bg-white px-6 py-16 md:px-12 md:py-28">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-calm-clay font-bold mb-4">
            <span className="w-8 h-px bg-calm-clay" />
            Stories
          </div>
          <h2
            className="font-bold text-calm-charcoal text-4xl md:text-6xl"
            style={{ letterSpacing: '-0.025em' }}
          >
            Pet parents who{' '}
            <span style={{ color: '#5b6f4c' }} className="italic">
              arrived
            </span>
            .
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {QUOTES.map((q, i) => (
            <div key={i} className="bg-calm-cream rounded-3xl p-7 border border-calm-sand">
              <MessageCircle className="w-5 h-5 text-calm-terracotta mb-4" />
              <p className="text-calm-charcoal leading-relaxed mb-5">"{q.text}"</p>
              <div className="pt-5 border-t border-calm-sand">
                <div className="font-semibold text-calm-charcoal text-sm">{q.name}</div>
                <div className="text-xs text-calm-charcoal/60 mt-1">
                  {q.loc} · {q.pet}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stories;
