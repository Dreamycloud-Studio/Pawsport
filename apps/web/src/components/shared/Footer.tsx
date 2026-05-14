import React from 'react';
import { Link } from 'react-router-dom';
import { PawPrint } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Destinations',  to: '/' },
  { label: 'AI Planner',    to: '/travel-planner' },
  { label: 'Stories',       to: '/community' },
  { label: 'Pricing',       to: '/#pricing' },
  { label: 'About',         to: '/' },
  { label: 'Privacy',       to: '/' },
  { label: 'Terms',         to: '/' },
];

const Footer: React.FC = () => {
  return (
    <footer className="bg-calm-cream border-t border-calm-sand px-6 py-10 md:px-12 md:py-14">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-sm text-calm-charcoal/60">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-orange-400 to-brand-pink-400 flex items-center justify-center text-white"
            style={{ transform: 'rotate(12deg)' }}
          >
            <PawPrint className="w-4.5 h-4.5" style={{ transform: 'rotate(-12deg)' }} />
          </div>
          <span className="text-lg font-bold text-calm-charcoal">Pawsport</span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {NAV_LINKS.map((l) => (
            <Link key={l.label} to={l.to} className="hover:text-calm-terracotta transition-colors">
              {l.label}
            </Link>
          ))}
        </div>

        {/* Copyright */}
        <span className="text-xs">© 2026 · Made with ❤️ for pets</span>
      </div>
    </footer>
  );
};

export default Footer;
