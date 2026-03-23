import React from 'react';
import { Sparkles, Users } from 'lucide-react';
import { Badge } from '../ui';
import { mascots } from '../../assets/images';

const features = [
  {
    icon: Sparkles,
    title: 'AI Travel Planning',
    description: 'Our AI creates custom travel plans with all documents, flights, and requirements for your destination.',
    color: 'from-brand-purple-400 to-brand-pink-400',
    bgColor: 'bg-brand-purple-50',
  },
  {
    icon: Users,
    title: 'Community Wall',
    description: 'Share your pet travel stories, photos, and tips with other pet parents around the world!',
    color: 'from-brand-orange-400 to-brand-pink-400',
    bgColor: 'bg-brand-orange-50',
  },
];

const Features: React.FC = () => {
  return (
    <section id="features" className="py-20 md:py-32 bg-gradient-to-b from-white to-brand-orange-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="purple" className="mb-4">
            ✨ What We Offer ✨
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Everything You Need in{' '}
            <span className="bg-gradient-to-r from-brand-orange-500 to-brand-pink-500 bg-clip-text text-transparent">
              One Place
            </span>
          </h2>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`p-12 rounded-3xl ${feature.bgColor} border-2 border-white hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center`}
            >
              <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg transform rotate-3 hover:rotate-6 transition-transform mx-auto`}>
                <feature.icon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-600 text-lg">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Mascot Decoration */}
        <div className="mt-16 flex justify-center">
          <div className="relative">
            <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-brand-orange-200 max-w-xs transform hover:scale-105 transition-transform">
              <img
                src={mascots.happy}
                alt="Pawsport mascot ready for adventure"
                className="w-full h-auto"
              />
            </div>
            <div className="absolute -top-4 -right-4 bg-gradient-to-r from-brand-orange-400 to-brand-pink-400 text-white px-4 py-2 rounded-full shadow-lg transform rotate-6 animate-pulse">
              <span className="text-sm font-medium">Let's go! ✈️</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
