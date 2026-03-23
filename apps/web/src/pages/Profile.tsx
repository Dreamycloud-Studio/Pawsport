import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { User, Mail, MapPin, FileText, AlertCircle, CheckCircle, Plus, Trash2, PawPrint } from 'lucide-react';
import supabase from '../config/supabase';

interface UserProfile {
  display_name: string;
  bio: string;
  location: string;
  avatar_url: string;
}

interface Pet {
  id?: string;
  name: string;
  species: string;
  breed: string;
  age: number | string;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profile, setProfile] = useState<UserProfile>({
    display_name: '',
    bio: '',
    location: '',
    avatar_url: ''
  });
  const [pets, setPets] = useState<Pet[]>([]);
  const [showAddPet, setShowAddPet] = useState(false);
  const [newPet, setNewPet] = useState<Pet>({
    name: '',
    species: '',
    breed: '',
    age: ''
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchPets();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile({
          display_name: data.display_name || '',
          bio: data.bio || '',
          location: data.location || '',
          avatar_url: data.avatar_url || ''
        });
      }
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchPets = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setPets(data);
    } catch (err: any) {
      console.error('Error fetching pets:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!user) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...profile,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPet = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!user) return;

    try {
      const { error } = await supabase
        .from('pets')
        .insert({
          user_id: user.id,
          name: newPet.name,
          species: newPet.species,
          breed: newPet.breed,
          age: newPet.age ? parseInt(newPet.age.toString()) : null
        });

      if (error) throw error;

      setSuccess('Pet added successfully!');
      setNewPet({ name: '', species: '', breed: '', age: '' });
      setShowAddPet(false);
      fetchPets();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to add pet');
    }
  };

  const handleDeletePet = async (petId: string) => {
    if (!window.confirm('Are you sure you want to remove this pet?')) return;

    try {
      const { error } = await supabase
        .from('pets')
        .delete()
        .eq('id', petId);

      if (error) throw error;

      setSuccess('Pet removed successfully!');
      fetchPets();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to remove pet');
    }
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* User Profile Card */}
        <Card className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your account information</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </label>
              <Input
                type="email"
                value={user?.email || ''}
                disabled
                className="bg-gray-50"
              />
              <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
            </div>

            {/* Display Name */}
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Your Name
              </label>
              <Input
                id="displayName"
                type="text"
                value={profile.display_name}
                onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                placeholder="Your name"
                required
                disabled={loading}
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Location
              </label>
              <Input
                id="location"
                type="text"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                placeholder="City, Country"
                disabled={loading}
              />
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Bio
              </label>
              <textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Tell us about yourself and your pets..."
                rows={4}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Card>

        {/* Pets Section */}
        <Card className="p-8">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <PawPrint className="w-6 h-6 text-brand-orange-500" />
                  My Pets
                </h2>
                <p className="text-gray-600">Manage your furry friends</p>
              </div>
              <Button
                onClick={() => setShowAddPet(!showAddPet)}
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Pet
              </Button>
            </div>
          </div>

          {/* Add Pet Form */}
          {showAddPet && (
            <form onSubmit={handleAddPet} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
              <h3 className="font-semibold text-gray-900">Add New Pet</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="petName" className="block text-sm font-medium text-gray-700 mb-1">
                    Pet Name *
                  </label>
                  <Input
                    id="petName"
                    type="text"
                    value={newPet.name}
                    onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
                    placeholder="Buddy"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="species" className="block text-sm font-medium text-gray-700 mb-1">
                    Species *
                  </label>
                  <Input
                    id="species"
                    type="text"
                    value={newPet.species}
                    onChange={(e) => setNewPet({ ...newPet, species: e.target.value })}
                    placeholder="Dog, Cat, etc."
                    required
                  />
                </div>

                <div>
                  <label htmlFor="breed" className="block text-sm font-medium text-gray-700 mb-1">
                    Breed
                  </label>
                  <Input
                    id="breed"
                    type="text"
                    value={newPet.breed}
                    onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })}
                    placeholder="Golden Retriever"
                  />
                </div>

                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                    Age (years)
                  </label>
                  <Input
                    id="age"
                    type="number"
                    value={newPet.age}
                    onChange={(e) => setNewPet({ ...newPet, age: e.target.value })}
                    placeholder="3"
                    min="0"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" size="sm">
                  Add Pet
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowAddPet(false);
                    setNewPet({ name: '', species: '', breed: '', age: '' });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {/* Pets List */}
          {pets.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <PawPrint className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No pets added yet</p>
              <p className="text-sm">Click "Add Pet" to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pets.map((pet) => (
                <div
                  key={pet.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">{pet.name}</h3>
                      <p className="text-sm text-gray-600">{pet.species}</p>
                      {pet.breed && (
                        <p className="text-sm text-gray-500">{pet.breed}</p>
                      )}
                      {pet.age && (
                        <p className="text-xs text-gray-500 mt-1">{pet.age} years old</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeletePet(pet.id!)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Remove pet"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Profile;
