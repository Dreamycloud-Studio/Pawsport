import React from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, User, LogOut, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import NotificationBell from './NotificationBell';

const Header: React.FC = () => {
    const { user, signOut } = useAuth();

    return (
        <header className="sticky top-0 z-40 bg-calm-cream/90 backdrop-blur-md border-b border-calm-sand">
            <nav className="max-w-7xl mx-auto px-6 md:px-10 py-3.5 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5">
                    <div
                        className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-orange-400 to-brand-pink-400 flex items-center justify-center text-white shadow-warm"
                        style={{ transform: 'rotate(12deg)' }}
                    >
                        <PawPrint className="w-5 h-5" style={{ transform: 'rotate(-12deg)' }} />
                    </div>
                    <span
                        className="text-xl font-bold text-calm-charcoal"
                        style={{ letterSpacing: '-0.02em' }}
                    >
                        Pawsport
                    </span>
                </Link>

                {/* Nav links — hidden on mobile */}
                <div className="hidden md:flex items-center gap-7 text-sm font-medium text-calm-charcoal/80">
                    <Link to="/" className="hover:text-calm-terracotta transition-colors">Destinations</Link>
                    <Link to="/travel-planner" className="hover:text-calm-terracotta transition-colors">AI Planner</Link>
                    <Link to="/community" className="hover:text-calm-terracotta transition-colors">Stories</Link>
                    <a href="#pricing" className="hover:text-calm-terracotta transition-colors">Pricing</a>
                </div>

                {/* Right actions */}
                <div className="flex items-center gap-2">
                    {user ? (
                        <>
                            <NotificationBell />
                            <Link
                                to="/profile"
                                className="hidden md:flex items-center gap-1.5 text-sm text-calm-charcoal/70 hover:text-calm-terracotta transition-colors px-3 py-1.5"
                            >
                                <User className="w-4 h-4" />
                                Profile
                            </Link>
                            <button
                                onClick={signOut}
                                className="hidden md:flex items-center gap-1.5 text-sm font-medium text-calm-charcoal px-3 py-1.5 hover:text-calm-terracotta transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign out
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className="hidden md:block text-sm font-medium text-calm-charcoal px-3 py-1.5 hover:text-calm-terracotta transition-colors"
                        >
                            Sign in
                        </Link>
                    )}
                    <Link to="/travel-planner">
                        <button className="inline-flex items-center gap-2 rounded-full font-semibold px-5 py-2.5 text-sm bg-calm-terracotta text-calm-cream hover:bg-calm-clay transition-colors">
                            Start free
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default Header;
