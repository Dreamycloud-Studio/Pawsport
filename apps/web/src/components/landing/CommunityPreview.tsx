import React from 'react';
import { Heart, MessageCircle, MapPin } from 'lucide-react';
import { Card, Badge, Button } from '../ui';
import { Link } from 'react-router-dom';
import { mascots } from '../../assets/images';

const samplePosts = [
  {
    username: 'sarahpaws',
    location: 'London → Sydney',
    pet: 'Max the Golden',
    caption: 'Max loved his first international flight! ✈️',
    likes: 234,
    comments: 18,
  },
  {
    username: 'catmom_travels',
    location: 'NYC → Berlin',
    pet: 'Luna & Leo',
    caption: 'Both cats settled in perfectly! 🐱',
    likes: 189,
    comments: 12,
  },
  {
    username: 'frenchie_adventures',
    location: 'Toronto → Amsterdam',
    pet: 'Bella',
    caption: 'Amsterdam parks are Bella approved! 🌷',
    likes: 312,
    comments: 24,
  },
];

const CommunityPreview: React.FC = () => {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-brand-pink-50 via-brand-purple-50 to-brand-blue-50 relative overflow-hidden">
      {/* Floating Mascot Decorations */}
      <div className="hidden lg:block absolute top-10 left-10 w-40 opacity-20 animate-bounce">
        <img
          src={mascots.pair}
          alt="Pet friends"
          className="w-full h-auto"
        />
      </div>
      <div className="hidden lg:block absolute bottom-20 right-10 w-48 opacity-30">
        <img
          src={mascots.traveling}
          alt="Traveling pets"
          className="w-full h-auto"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="pink" className="mb-4">
            🐾 Join the Community 🐾
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Share Your{' '}
            <span className="bg-gradient-to-r from-brand-orange-500 to-brand-pink-500 bg-clip-text text-transparent">
              Pet's Adventures
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with fellow pet travelers, share tips, and get inspired by their journeys!
          </p>
        </div>

        {/* Community Posts Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {samplePosts.map((post, index) => (
            <Card key={index} className="overflow-hidden">
              {/* Post Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-brand-orange-100 to-brand-pink-100 flex items-center justify-center mb-4 -mx-6 -mt-6">
                <img
                  src={mascots.suitcase}
                  alt={post.pet}
                  className="h-32 object-contain"
                />
              </div>

              {/* Post Content */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-brand-orange-600">@{post.username}</span>
                  <Badge variant="gray" className="text-xs px-2 py-1">
                    <MapPin className="w-3 h-3" />
                    {post.location.split(' → ')[0]}
                  </Badge>
                </div>
                
                <p className="text-gray-600">{post.caption}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 pt-2 border-t">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {post.likes}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {post.comments}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link to="/community">
            <Button size="lg">
              Explore Full Community
              <MessageCircle className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CommunityPreview;
