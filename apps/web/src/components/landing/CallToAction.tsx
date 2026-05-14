import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CallToAction: React.FC = () => {
  return (
    <section
      id="pricing"
      className="relative bg-calm-charcoal text-calm-cream px-6 py-16 md:px-12 md:py-32"
    >
      <div className="max-w-5xl mx-auto text-center relative">
        <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-calm-butter font-bold mb-5">
          <span className="w-8 h-px bg-calm-butter" />
          Start free
        </div>

        <h2
          className="font-bold mb-5 leading-[1.0] text-5xl md:text-7xl"
          style={{ letterSpacing: '-0.03em' }}
        >
          Your pet's plan,
          <br />
          <span className="italic text-calm-butter">42 seconds away</span>.
        </h2>

        <p className="text-calm-cream/70 text-lg mb-8 max-w-xl mx-auto">
          No credit card. The AI starts before you sign up — you only save your account when you want to keep the plan.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/travel-planner">
            <button className="inline-flex items-center gap-2 rounded-full font-semibold px-7 py-3.5 text-base bg-calm-terracotta text-calm-cream hover:bg-calm-clay transition-colors">
              Plan my pet's trip
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
          <Link to="/travel-planner">
            <button className="inline-flex items-center gap-2 rounded-full font-semibold px-7 py-3.5 text-base border-2 border-calm-cream/30 text-calm-cream hover:bg-white/5 transition-colors">
              Talk to the AI
            </button>
          </Link>
        </div>

        <div className="mt-10 flex items-center justify-center flex-wrap gap-6 text-xs text-calm-cream/60">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-calm-butter" /> 12,400 pets placed
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-calm-sage" /> 84 countries
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-calm-terracotta" /> 98% first-try customs
          </span>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
