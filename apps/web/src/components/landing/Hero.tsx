import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { mascots } from '../../assets/images';

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-calm-cream px-6 py-16 md:px-12 md:py-28">
      <div className="max-w-7xl mx-auto relative">
        <div className="grid md:grid-cols-12 items-center gap-12">
          {/* Left — editorial text */}
          <div className="md:col-span-7">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-calm-clay font-bold mb-6">
              <span className="w-8 h-px bg-calm-clay" />
              A travel agent for pets
            </div>

            <h1
              className="font-bold text-calm-charcoal mt-0 mb-6 leading-[1.0] text-[52px] md:text-[88px]"
              style={{ letterSpacing: '-0.03em' }}
            >
              Move with your
              <br />
              pet,{' '}
              <span className="italic" style={{ color: '#b85e3e' }}>
                calmly
              </span>
              .
            </h1>

            <p className="text-calm-charcoal/70 mb-8 max-w-lg text-base md:text-xl md:leading-relaxed">
              Pawsport is a planner, not a panic button. Tell us where you're going. We'll turn import rules, vet visits, and flight bookings into a quiet, dated plan.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link to="/travel-planner">
                <button className="inline-flex items-center gap-2 rounded-full font-semibold px-7 py-3.5 text-base bg-calm-terracotta text-calm-cream hover:bg-calm-clay transition-colors">
                  Start a plan
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <Link to="/travel-planner">
                <button className="inline-flex items-center gap-2 rounded-full font-semibold px-7 py-3.5 text-base bg-white border-2 border-calm-sand text-calm-charcoal hover:border-calm-terracotta transition-colors">
                  See a sample plan
                </button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-calm-charcoal/60">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-calm-sage" />
                12,400+ pets placed
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-calm-butter" />
                84 countries
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-calm-terracotta" />
                98% first-try customs
              </span>
            </div>
          </div>

          {/* Right — mascot card */}
          <div className="relative md:col-span-5 max-w-xs mx-auto md:max-w-none">
            <div className="relative inline-block w-full">
              {/* Glow */}
              <div className="absolute -inset-8 rounded-full bg-calm-butter/40 blur-2xl" />

              {/* Card */}
              <div className="relative bg-white rounded-[28px] p-6 shadow-lift border-4 border-calm-sand">
                <img
                  src={mascots.passport}
                  alt="Pet with passport"
                  className="w-full h-auto"
                  draggable="false"
                />
              </div>

              {/* Stat chip */}
              <div
                className="absolute -bottom-5 -left-5 bg-calm-charcoal text-calm-cream rounded-2xl px-4 py-2.5 shadow-lift"
                style={{ transform: 'rotate(-4deg)' }}
              >
                <div className="text-[10px] uppercase tracking-[0.18em] text-calm-cream/60 font-semibold">
                  Avg. plan
                </div>
                <div className="text-xl font-bold">42 seconds</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
