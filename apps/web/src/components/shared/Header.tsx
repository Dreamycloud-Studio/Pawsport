import React from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, User, LogOut } from 'lucide-react';
import { Button } from '../ui';
import { useAuth } from '../../contexts/AuthContext';
import NotificationBell from './NotificationBell';

const Header: React.FC = () => {
    const { user, signOut } = useAuth();

    const handleLogout = async () => {
        await signOut();
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <nav className="max-w-7xl mx-auto px-6 py-4 md:px-12">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-12 h-12 bg-gradient-to-br from-brand-orange-400 to-brand-pink-400 rounded-2xl flex items-center justify-center shadow-lg transform rotate-12 group-hover:rotate-6 transition-transform">
                            <PawPrint className="w-7 h-7 text-white -rotate-12 group-hover:-rotate-6 transition-transform" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-brand-orange-600 to-brand-pink-600 bg-clip-text text-transparent">
                            Pawsport
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-8">
                        <Link to="/" className="text-gray-700 hover:text-brand-orange-600 transition-colors font-medium hidden md:block">
                            Home
                        </Link>
                        <Link to="/travel-planner" className="text-gray-700 hover:text-brand-orange-600 transition-colors font-medium hidden md:block">
                            Travel Planner
                        </Link>
                        <Link to="/community" className="text-gray-700 hover:text-brand-orange-600 transition-colors font-medium hidden md:block">
                            Community
                        </Link>
                        
                        {user ? (
                            <div className="flex items-center gap-4">
                                <NotificationBell />
                                <Link to="/profile" className="hidden md:flex items-center gap-2 text-sm text-gray-600 hover:text-brand-orange-600 transition-colors">
                                    <User className="w-4 h-4" />
                                    <span>Profile</span>
                                </Link>
                                <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={handleLogout}
                                    className="flex items-center gap-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="hidden md:inline">Logout</span>
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login">
                                    <Button size="sm" variant="outline">
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/register">
                                    <Button size="sm">
                                        Sign Up
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;