import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, MessageCircle, ArrowRight } from 'lucide-react';

const COMMUNITY_POSTS = [
  {
    user:     '@kira.travels',
    pet:      '🐱 Loki',
    loc:      'Berlin → Singapore',
    text:     'Loki cleared customs in 35 min. SG airport pet desk is unreal — pic of his first nap inside.',
    likes:    42,
    comments: 8,
  },
  {
    user:     '@gus_the_corgi',
    pet:      '🐶 Gus',
    loc:      'NYC → Lisbon',
    text:     'For anyone doing the EU route — book the cargo slot BEFORE the vet appointment. Learned the hard way!',
    likes:    128,
    comments: 24,
  },
  {
    user:     '@miss_pebbles',
    pet:      '🐱 Pebbles',
    loc:      'Auckland → LA',
    text:     'Two-leg flight with a layover in Tahiti. Pebbles slept through both. Bringing the Pawsport carrier checklist saved my brain.',
    likes:    73,
    comments: 11,
  },
];

const CommunityPreview: React.FC = () => {
  return (
    <section className="bg-calm-cream px-6 py-16 md:px-12 md:py-28">
      <div className="max-w-7xl mx-auto">
        {/* Header row */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-calm-clay font-bold mb-4">
              <span className="w-8 h-px bg-calm-clay" />
              Nose Booper
            </div>
            <h2
              className="font-bold text-calm-charcoal text-4xl md:text-6xl"
              style={{ letterSpacing: '-0.025em' }}
            >
              From the{' '}
              <span style={{ color: '#b85e3e' }} className="italic">
                community
              </span>
              .
            </h2>
          </div>
          <Link
            to="/community"
            className="text-sm font-semibold text-calm-terracotta flex items-center gap-1 hover:text-calm-clay transition-colors"
          >
            Browse all routes <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {COMMUNITY_POSTS.map((p, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-calm-sand">
              {/* User row */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-calm-sand text-calm-charcoal flex items-center justify-center text-lg">
                  {p.pet[0]}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-calm-charcoal">{p.user}</div>
                  <div className="text-xs text-calm-charcoal/60 flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5" />
                    {p.loc}
                  </div>
                </div>
              </div>

              <p className="text-sm text-calm-charcoal/85 mb-4">{p.text}</p>

              <div className="flex items-center gap-3 text-xs text-calm-charcoal/60 pt-3 border-t border-calm-sand">
                <span className="inline-flex items-center gap-1">🐾 {p.likes}</span>
                <span className="inline-flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" /> {p.comments}
                </span>
                <span className="ml-auto text-[10px] uppercase tracking-wider text-calm-terracotta font-bold">
                  {p.pet}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunityPreview;
