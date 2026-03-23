import React from 'react';
import { PawPrint, Heart, Sparkles, MapPin } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Input, Select } from '../components/ui';

const ComponentShowcase: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-pink-50 via-brand-orange-50 to-brand-yellow-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-brand-orange-500 to-brand-pink-500 bg-clip-text text-transparent">
              UI Component Library
            </span>
          </h1>
          <p className="text-xl text-gray-600">Pawsport Design System</p>
        </div>

        {/* Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>Different button variants and sizes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4 items-center">
                <Button variant="primary">Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="outline">Outline Button</Button>
              </div>
              <div className="flex flex-wrap gap-4 items-center">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
              <div className="flex flex-wrap gap-4 items-center">
                <Button>
                  <Sparkles className="w-5 h-5 mr-2" />
                  With Icon
                </Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badges */}
        <Card>
          <CardHeader>
            <CardTitle>Badges</CardTitle>
            <CardDescription>Color variants for badges</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Badge variant="orange">
                <PawPrint className="w-4 h-4" />
                Orange Badge
              </Badge>
              <Badge variant="pink">
                <Heart className="w-4 h-4" />
                Pink Badge
              </Badge>
              <Badge variant="purple">
                <Sparkles className="w-4 h-4" />
                Purple Badge
              </Badge>
              <Badge variant="gray">
                <MapPin className="w-4 h-4" />
                Gray Badge
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Cards */}
        <div>
          <h2 className="text-3xl font-bold mb-6 text-center">Card Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <div className="w-12 h-12 bg-gradient-to-br from-brand-orange-400 to-brand-pink-400 rounded-2xl flex items-center justify-center mb-4">
                <PawPrint className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Travel Planning</CardTitle>
              <CardDescription className="mt-2">
                Get AI-powered travel plans with all the documents you need.
              </CardDescription>
            </Card>

            <Card>
              <div className="w-12 h-12 bg-gradient-to-br from-brand-purple-400 to-brand-pink-400 rounded-2xl flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Community</CardTitle>
              <CardDescription className="mt-2">
                Connect with pet owners on similar travel routes.
              </CardDescription>
            </Card>

            <Card>
              <div className="w-12 h-12 bg-gradient-to-br from-brand-orange-400 to-brand-purple-400 rounded-2xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <CardTitle>AI Assistant</CardTitle>
              <CardDescription className="mt-2">
                Smart recommendations for your pet's journey.
              </CardDescription>
            </Card>
          </div>
        </div>

        {/* Form Elements */}
        <Card>
          <CardHeader>
            <CardTitle>Form Elements</CardTitle>
            <CardDescription>Inputs and selects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-w-md">
              <Input 
                label="Pet Name" 
                placeholder="Enter your pet's name"
              />
              <Input 
                label="Email" 
                type="email"
                placeholder="your@email.com"
              />
              <Select label="Pet Type">
                <option value="">Select pet type</option>
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="other">Other</option>
              </Select>
              <Input 
                label="With Error" 
                error="This field is required"
                placeholder="Error state example"
              />
            </div>
          </CardContent>
        </Card>

        {/* Icons */}
        <Card>
          <CardHeader>
            <CardTitle>Icons (Lucide React)</CardTitle>
            <CardDescription>Available icons from lucide-react</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-6 items-center">
              <PawPrint className="w-8 h-8 text-brand-orange-400" />
              <Heart className="w-8 h-8 text-brand-pink-400" />
              <Sparkles className="w-8 h-8 text-brand-purple-400" />
              <MapPin className="w-8 h-8 text-brand-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComponentShowcase;
