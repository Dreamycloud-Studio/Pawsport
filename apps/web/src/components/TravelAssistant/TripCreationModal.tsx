import React, { useMemo, useState } from 'react';
import { XCircle } from 'lucide-react';
import { PlannerTrip, TripStatus } from '../../types';
import { Button } from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { StoredPet, getSpeciesEmoji } from '../../hooks/usePets';

interface CreateTripPayload {
  petName: string;
  petEmoji: string;
  species: string;
  breed: string;
  origin: string;
  destination: string;
  travelDate: string;
  vaccinationStatus: string;
  status: TripStatus;
}

interface TripCreationModalProps {
  isOpen: boolean;
  pets: StoredPet[];
  isLoadingPets: boolean;
  petsError?: string;
  onClose: () => void;
  onCreateTrip: (payload: CreateTripPayload) => void;
  onCreatePet: (input: { name: string; species: string; breed: string }) => Promise<StoredPet | null>;
}

function toIsoDate(dateValue: string): string {
  return new Date(`${dateValue}T12:00:00`).toISOString();
}

function defaultTravelDateInput(): string {
  const date = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const TripCreationModal: React.FC<TripCreationModalProps> = ({
  isOpen,
  pets,
  isLoadingPets,
  petsError,
  onClose,
  onCreateTrip,
  onCreatePet,
}) => {
  const [selectedPetId, setSelectedPetId] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [travelDate, setTravelDate] = useState(defaultTravelDateInput());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [showCreatePet, setShowCreatePet] = useState(false);
  const [newPetName, setNewPetName] = useState('');
  const [newPetSpecies, setNewPetSpecies] = useState('dog');
  const [newPetBreed, setNewPetBreed] = useState('');
  const [creatingPet, setCreatingPet] = useState(false);
  const [createPetError, setCreatePetError] = useState('');

  const selectedPet = useMemo(() => pets.find((pet) => pet.id === selectedPetId) || null, [pets, selectedPetId]);

  if (!isOpen) {
    return null;
  }

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};
    if (!selectedPetId) nextErrors.pet = 'Select a pet profile before creating a trip.';
    if (!origin.trim()) nextErrors.origin = 'Origin is required.';
    if (!destination.trim()) nextErrors.destination = 'Destination is required.';
    if (!travelDate.trim()) {
      nextErrors.travelDate = 'Travel date is required.';
    } else if (Number.isNaN(new Date(`${travelDate}T12:00:00`).getTime())) {
      nextErrors.travelDate = 'Use a valid travel date.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleCreatePet = async () => {
    setCreatePetError('');

    if (!newPetName.trim() || !newPetSpecies.trim() || !newPetBreed.trim()) {
      setCreatePetError('Pet name, species, and breed are required.');
      return;
    }

    setCreatingPet(true);
    const pet = await onCreatePet({
      name: newPetName,
      species: newPetSpecies,
      breed: newPetBreed,
    });
    setCreatingPet(false);

    if (!pet) {
      setCreatePetError('Could not create pet profile. Please try again.');
      return;
    }

    setSelectedPetId(pet.id);
    setShowCreatePet(false);
    setNewPetName('');
    setNewPetSpecies('dog');
    setNewPetBreed('');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm() || !selectedPet) {
      return;
    }

    onCreateTrip({
      petName: selectedPet.name,
      petEmoji: getSpeciesEmoji(selectedPet.species),
      species: selectedPet.species,
      breed: selectedPet.breed,
      origin: origin.trim(),
      destination: destination.trim(),
      travelDate: toIsoDate(travelDate),
      vaccinationStatus: 'unknown',
      status: 'draft',
    });

    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl border border-gray-100">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Create New Trip</h2>
            <p className="text-sm text-gray-500">Select a pet and set your required trip details.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close create trip dialog"
          >
            <XCircle size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          <div className="rounded-xl border border-gray-200 p-3 bg-gray-50/80">
            <div className="flex items-center justify-between gap-3 mb-3">
              <p className="text-sm font-medium text-gray-800">Pet Profile</p>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setShowCreatePet((prev) => !prev)}
              >
                {showCreatePet ? 'Hide pet form' : 'Create pet profile'}
              </Button>
            </div>

            <Select
              label="Select pet *"
              value={selectedPetId}
              onChange={(event) => {
                setSelectedPetId(event.target.value);
                if (errors.pet) {
                  setErrors((prev) => ({ ...prev, pet: '' }));
                }
              }}
              disabled={isLoadingPets || pets.length === 0}
              error={errors.pet}
            >
              <option value="">{isLoadingPets ? 'Loading pets...' : 'Choose a pet profile'}</option>
              {pets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name} ({pet.species}, {pet.breed})
                </option>
              ))}
            </Select>

            {petsError && <p className="mt-2 text-xs text-red-600">{petsError}</p>}
            {!isLoadingPets && pets.length === 0 && (
              <p className="mt-2 text-xs text-amber-700">No pet profiles found. Create one to continue.</p>
            )}

            {showCreatePet && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Pet name *"
                  value={newPetName}
                  onChange={(event) => setNewPetName(event.target.value)}
                />
                <Select
                  label="Species *"
                  value={newPetSpecies}
                  onChange={(event) => setNewPetSpecies(event.target.value)}
                >
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                  <option value="bird">Bird</option>
                  <option value="rabbit">Rabbit</option>
                  <option value="other">Other</option>
                </Select>
                <Input
                  label="Breed *"
                  value={newPetBreed}
                  onChange={(event) => setNewPetBreed(event.target.value)}
                  className="sm:col-span-2"
                />
                {createPetError && <p className="sm:col-span-2 text-xs text-red-600">{createPetError}</p>}
                <div className="sm:col-span-2">
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleCreatePet}
                    disabled={creatingPet}
                  >
                    {creatingPet ? 'Creating pet...' : 'Save pet profile'}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Origin *"
              placeholder="City, Country"
              value={origin}
              onChange={(event) => {
                setOrigin(event.target.value);
                if (errors.origin) {
                  setErrors((prev) => ({ ...prev, origin: '' }));
                }
              }}
              error={errors.origin}
            />
            <Input
              label="Destination *"
              placeholder="City, Country"
              value={destination}
              onChange={(event) => {
                setDestination(event.target.value);
                if (errors.destination) {
                  setErrors((prev) => ({ ...prev, destination: '' }));
                }
              }}
              error={errors.destination}
            />
            <Input
              label="Travel date *"
              type="date"
              value={travelDate}
              onChange={(event) => {
                setTravelDate(event.target.value);
                if (errors.travelDate) {
                  setErrors((prev) => ({ ...prev, travelDate: '' }));
                }
              }}
              error={errors.travelDate}
              className="sm:col-span-2"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create trip</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TripCreationModal;
export type { CreateTripPayload };
