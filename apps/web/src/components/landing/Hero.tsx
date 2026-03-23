import React from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, ArrowRight, Sparkles } from 'lucide-react';
import { Button, Badge } from '../ui';
import { mascots } from '../../assets/images';

const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-brand-pink-50 via-brand-orange-50 to-brand-yellow-50">
      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div>
            <Badge variant="orange" className="mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Pet Travel
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Plan Your Pet's{' '}
              <span className="bg-gradient-to-r from-brand-orange-500 to-brand-pink-500 bg-clip-text text-transparent">
                Perfect Journey!
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              Get personalized travel plans with AI and share your pet's adventures with our community! 🐾
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/travel-planner">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/community">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Explore Community
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column - Mascot Display */}
          <div className="relative">
            <div className="relative bg-white rounded-3xl p-8 shadow-2xl border-4 border-brand-orange-200">
              <img
                src={mascots.passport}
                alt="Pawsport mascot with passport"
                className="w-full h-auto"
              />
            </div>
            
            {/* Floating Stats Badge */}
            <div className="absolute -bottom-6 -left-6 bg-gradient-to-br from-brand-orange-400 to-brand-pink-400 text-white rounded-2xl shadow-xl p-6 hidden md:block transform rotate-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <PawPrint className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold">10,000+</div>
                  <div className="text-white/90 text-sm">Happy Pets!</div>
                </div>
              </div>
            </div>
            
            {/* Floating Mascot Pair */}
            <div className="absolute -top-8 -right-8 bg-white rounded-2xl p-4 shadow-xl border-4 border-brand-pink-200 hidden lg:block w-48 animate-bounce">
              <img
                src={mascots.pair}
                alt="Dog and cat friends"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
