import React, { useEffect, useState } from 'react';
import { XCircle } from 'lucide-react';
import { PlannerTrip, TripStatus } from '../../types';
import { Button } from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { StoredPet, getSpeciesEmoji } from '../../hooks/usePets';

export type TripUpdate = Partial<
  Pick<
    PlannerTrip,
    | 'petName'
    | 'petEmoji'
    | 'species'
    | 'breed'
    | 'origin'
    | 'destination'
    | 'travelDate'
    | 'vaccinationStatus'
    | 'status'
  >
>;

interface TripEditModalProps {
  isOpen: boolean;
  trip: PlannerTrip | null;
  pets: StoredPet[];
  onClose: () => void;
  onSave: (tripId: string, updates: TripUpdate) => void;
}

function toDateInputValue(isoDate: string): string {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return '';

  const year = parsed.getFullYear();
  const month = `${parsed.getMonth() + 1}`.padStart(2, '0');
  const day = `${parsed.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function toIsoDate(dateValue: string): string {
  return new Date(`${dateValue}T12:00:00`).toISOString();
}

const TripEditModal: React.FC<TripEditModalProps> = ({ isOpen, trip, pets, onClose, onSave }) => {
  const [selectedPetId, setSelectedPetId] = useState('');
  const [petName, setPetName] = useState('');
  const [species, setSpecies] = useState('dog');
  const [breed, setBreed] = useState('');
  const [petEmoji, setPetEmoji] = useState('🐾');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [vaccinationStatus, setVaccinationStatus] = useState('unknown');
  const [status, setStatus] = useState<TripStatus>('draft');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!trip) return;

    const matchedPet = pets.find(
      (pet) =>
        pet.name.toLowerCase() === trip.petName.toLowerCase() &&
        pet.species.toLowerCase() === trip.species.toLowerCase() &&
        pet.breed.toLowerCase() === trip.breed.toLowerCase()
    );

    setSelectedPetId(matchedPet?.id || '');
    setPetName(trip.petName);
    setSpecies(trip.species);
    setBreed(trip.breed);
    setPetEmoji(trip.petEmoji || getSpeciesEmoji(trip.species));
    setOrigin(trip.origin);
    setDestination(trip.destination);
    setTravelDate(toDateInputValue(trip.travelDate));
    setVaccinationStatus(trip.vaccinationStatus || 'unknown');
    setStatus(trip.status);
    setErrors({});
  }, [trip, pets]);

  if (!isOpen || !trip) {
    return null;
  }

  const handlePetSelect = (petId: string) => {
    setSelectedPetId(petId);
    if (!petId) return;

    const selected = pets.find((pet) => pet.id === petId);
    if (!selected) return;

    setPetName(selected.name);
    setSpecies(selected.species);
    setBreed(selected.breed);
    setPetEmoji(getSpeciesEmoji(selected.species));
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!petName.trim()) nextErrors.petName = 'Pet name is required.';
    if (!species.trim()) nextErrors.species = 'Species is required.';
    if (!breed.trim()) nextErrors.breed = 'Breed is required.';
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

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    onSave(trip.id, {
      petName: petName.trim(),
      species: species.trim(),
      breed: breed.trim(),
      petEmoji,
      origin: origin.trim(),
      destination: destination.trim(),
      travelDate: toIsoDate(travelDate),
      vaccinationStatus,
      status,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl border border-gray-100">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Edit Trip</h2>
            <p className="text-sm text-gray-500">Update every important attribute for this trip.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close edit trip dialog"
          >
            <XCircle size={20} />
          </button>
        </div>

        <form onSubmit={handleSave} className="px-5 py-4 space-y-4">
          <div className="rounded-xl border border-gray-200 p-3 bg-gray-50/80">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="Load from pet profile"
                value={selectedPetId}
                onChange={(event) => handlePetSelect(event.target.value)}
              >
                <option value="">Custom trip pet details</option>
                {pets.map((pet) => (
                  <option key={pet.id} value={pet.id}>
                    {pet.name} ({pet.species}, {pet.breed})
                  </option>
                ))}
              </Select>
              <Input
                label="Pet emoji"
                value={petEmoji}
                maxLength={2}
                onChange={(event) => setPetEmoji(event.target.value || '🐾')}
              />
              <Input
                label="Pet name *"
                value={petName}
                onChange={(event) => setPetName(event.target.value)}
                error={errors.petName}
              />
              <Select
                label="Species *"
                value={species}
                onChange={(event) => {
                  const value = event.target.value;
                  setSpecies(value);
                  setPetEmoji(getSpeciesEmoji(value));
                }}
                error={errors.species}
              >
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="bird">Bird</option>
                <option value="rabbit">Rabbit</option>
                <option value="other">Other</option>
              </Select>
              <Input
                label="Breed *"
                value={breed}
                onChange={(event) => setBreed(event.target.value)}
                error={errors.breed}
              />
              <Select
                label="Vaccination status"
                value={vaccinationStatus}
                onChange={(event) => setVaccinationStatus(event.target.value)}
              >
                <option value="up-to-date">Up to date</option>
                <option value="pending">Pending</option>
                <option value="unknown">Unknown</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Origin *"
              value={origin}
              onChange={(event) => setOrigin(event.target.value)}
              error={errors.origin}
            />
            <Input
              label="Destination *"
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              error={errors.destination}
            />
            <Input
              label="Travel date *"
              type="date"
              value={travelDate}
              onChange={(event) => setTravelDate(event.target.value)}
              error={errors.travelDate}
            />
            <Select
              label="Trip status"
              value={status}
              onChange={(event) => setStatus(event.target.value as TripStatus)}
            >
              <option value="draft">Draft</option>
              <option value="in_progress">In progress</option>
              <option value="completed">Completed</option>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TripEditModal;
