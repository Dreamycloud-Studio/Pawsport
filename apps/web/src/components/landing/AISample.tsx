import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, User, Download, CheckCircle } from 'lucide-react';

interface BubbleProps {
  role: 'user' | 'ai';
  text: string;
}

const Bubble: React.FC<BubbleProps> = ({ role, text }) => {
  const isUser = role === 'user';
  return (
    <div className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
          isUser
            ? 'bg-calm-sand text-calm-charcoal'
            : 'bg-gradient-to-br from-brand-orange-400 to-brand-pink-400 text-white'
        }`}
      >
        {isUser ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
          isUser
            ? 'bg-calm-sand text-calm-charcoal'
            : 'bg-calm-cream text-calm-charcoal border border-calm-sand'
        }`}
      >
        {text}
      </div>
    </div>
  );
};

const PLAN_ITEMS = [
  { date: 'Jun 02', task: 'Rabies booster',      cat: 'VET',    done: true  },
  { date: 'Jun 15', task: 'EU pet passport',      cat: 'DOCS',   done: false },
  { date: 'Jul 01', task: 'Book Air France slot', cat: 'FLIGHT', done: false },
  { date: 'Jul 18', task: 'Tapeworm + carrier',   cat: 'PREP',   done: false },
  { date: 'Jul 22', task: 'Bella flies home ✈️',  cat: 'FLY',    done: false },
];

const AISample: React.FC = () => {
  return (
    <section className="bg-calm-cream px-6 py-16 md:px-12 md:py-28">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-10">
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-calm-clay font-bold mb-4">
            <span className="w-8 h-px bg-calm-clay" />
            AI Planner
          </div>
          <h2
            className="font-bold text-calm-charcoal text-4xl md:text-6xl"
            style={{ letterSpacing: '-0.025em' }}
          >
            A sample{' '}
            <span style={{ color: '#b85e3e' }} className="italic">
              plan
            </span>
            .
          </h2>
          <p className="text-calm-charcoal/70 mt-4">
            Below: an actual plan the AI built for a 9kg beagle moving from NYC to Paris in July.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Chat preview */}
          <div className="bg-white rounded-3xl shadow-lift overflow-hidden border border-calm-sand md:col-span-3">
            {/* Chat header */}
            <div className="px-5 py-3 border-b border-calm-sand flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-orange-400 to-brand-pink-400 text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-sm text-calm-charcoal">Pawsport AI</div>
                <div className="text-[11px] text-calm-charcoal/50 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-calm-sage rounded-full" />
                  Bella · Paris
                </div>
              </div>
            </div>

            {/* Bubbles */}
            <div className="p-5 space-y-3.5" style={{ minHeight: 360 }}>
              <Bubble role="user" text="Bringing Bella, my 9kg beagle, from NYC to Paris in late July." />
              <Bubble
                role="ai"
                text="Got it. Paris = EU route. You'll need a rabies booster ≥21 days before flight, an EU pet passport, and a tapeworm treatment 24–120h before arrival. Bella's already microchipped, so we're on a 6-week runway. Here's the plan."
              />
              <Bubble role="user" text="What about her crate?" />
              <Bubble
                role="ai"
                text="Air France requires IATA-spec. For her size, a Sherpa #3 or Petmate #200 works. I'll add 'crate-train (2 weeks)' to your prep section."
              />
            </div>

            <div className="px-5 pb-4">
              <Link to="/travel-planner">
                <button className="w-full inline-flex items-center justify-center gap-2 rounded-full font-semibold px-5 py-2.5 text-sm bg-calm-terracotta text-calm-cream hover:bg-calm-clay transition-colors">
                  Try the AI planner
                  <Sparkles className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>

          {/* Plan output */}
          <div className="bg-calm-charcoal text-calm-cream rounded-3xl p-6 md:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-calm-cream/50 font-bold">
                  Plan
                </div>
                <div className="text-xl font-bold">Bella → Paris 🇫🇷</div>
              </div>
              <button className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-calm-cream hover:bg-white/20 transition-colors">
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {PLAN_ITEMS.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span
                    className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 ${
                      item.done
                        ? 'bg-calm-butter border-calm-butter text-calm-charcoal'
                        : 'border-calm-cream/30'
                    }`}
                  >
                    {item.done && <CheckCircle className="w-3 h-3" />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-calm-cream/50 font-semibold tracking-wider">
                      {item.cat} · {item.date}
                    </div>
                    <div
                      className={`text-sm font-medium ${
                        item.done ? 'line-through text-calm-cream/50' : ''
                      }`}
                    >
                      {item.task}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-5 border-t border-calm-cream/10 flex items-center justify-between text-xs">
              <span className="text-calm-cream/60">Saved to your account</span>
              <span className="inline-flex items-center gap-1 text-calm-butter">
                <CheckCircle className="w-3 h-3" /> Auto-saving
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AISample;
