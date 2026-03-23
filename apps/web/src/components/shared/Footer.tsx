import React from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, Heart } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-12 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Brand Column */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-brand-orange-400 to-brand-pink-400 rounded-2xl flex items-center justify-center shadow-lg transform rotate-12">
                                <PawPrint className="w-5 h-5 text-white -rotate-12" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-brand-orange-600 to-brand-pink-600 bg-clip-text text-transparent">
                                Pawsport
                            </span>
                        </div>
                        <p className="text-gray-600">
                            Helping pets travel safely and connect with their community worldwide.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-600 hover:text-brand-orange-600 transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/travel-planner" className="text-gray-600 hover:text-brand-orange-600 transition-colors">
                                    Travel Planner
                                </Link>
                            </li>
                            <li>
                                <Link to="/community" className="text-gray-600 hover:text-brand-orange-600 transition-colors">
                                    Community
                                </Link>
                            </li>
                            <li>
                                <Link to="/showcase" className="text-gray-600 hover:text-brand-orange-600 transition-colors">
                                    Component Showcase
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Get in Touch</h3>
                        <p className="text-gray-600 mb-2">
                            Have questions? We're here to help!
                        </p>
                        <p className="text-gray-600">
                            📧 contact@pawsport.com
                        </p>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-600 text-sm">
                        &copy; {new Date().getFullYear()} Pawsport. All rights reserved.
                    </p>
                    <p className="text-gray-600 text-sm flex items-center gap-2">
                        Made with <Heart className="w-4 h-4 text-brand-pink-400 fill-brand-pink-400" /> for pets everywhere 🐾
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;