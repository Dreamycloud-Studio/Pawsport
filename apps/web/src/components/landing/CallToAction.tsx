import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '../ui';
import { mascots } from '../../assets/images';

const benefits = [
  'Free consultation and quote',
  'Expert guidance every step',
  'Stress-free relocation',
  'Happy, safe pets',
];

const CallToAction: React.FC = () => {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-brand-orange-400 via-brand-pink-400 to-brand-purple-500 text-white relative overflow-hidden">
      {/* Decorative Sparkle Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-10 right-20">
          <Sparkles className="w-24 h-24" />
        </div>
        <div className="absolute bottom-20 left-20">
          <Sparkles className="w-16 h-16" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Mascot */}
          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 border-4 border-white/30 shadow-2xl">
              <img
                src={mascots.passport}
                alt="Pawsport mascot ready to help"
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Right Side - CTA Content */}
          <div className="text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Start Planning Today! 🎉
            </h2>
            <p className="text-xl mb-8 opacity-95">
              Get your AI-powered travel plan in minutes. Join our community!
            </p>
            
            {/* Benefits List */}
            <div className="flex flex-wrap gap-3 mb-10 justify-center md:justify-start">
              {benefits.map((benefit, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-white/30"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/travel-planner">
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="w-full sm:w-auto bg-white text-brand-orange-600 hover:bg-gray-100 shadow-xl"
                >
                  Try AI Planning
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/community">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="w-full sm:w-auto backdrop-blur-sm"
                >
                  Explore Community
                </Button>
              </Link>
            </div>

            <p className="mt-8 text-sm opacity-90">
              Free to start • No credit card required 💖
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
