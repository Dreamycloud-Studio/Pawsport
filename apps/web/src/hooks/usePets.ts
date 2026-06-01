import { useCallback, useEffect, useState } from 'react';
import supabase from '../config/supabase';

export interface StoredPet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number | null;
}

interface CreatePetInput {
  name: string;
  species: string;
  breed: string;
  age?: number | null;
}

interface UsePetsResult {
  pets: StoredPet[];
  isLoading: boolean;
  error: string;
  createPet: (input: CreatePetInput) => Promise<StoredPet | null>;
  refresh: () => Promise<void>;
}

export function getSpeciesEmoji(species: string): string {
  const normalized = species.trim().toLowerCase();
  if (normalized === 'dog') return '🐶';
  if (normalized === 'cat') return '🐱';
  if (normalized === 'bird') return '🐦';
  if (normalized === 'rabbit') return '🐰';
  return '🐾';
}

export function usePets(userId?: string): UsePetsResult {
  const [pets, setPets] = useState<StoredPet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    if (!userId) {
      setPets([]);
      setError('');
      return;
    }

    setIsLoading(true);
    setError('');

    const { data, error: fetchError } = await supabase
      .from('pets')
      .select('id, name, species, breed, age')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError(fetchError.message || 'Failed to load pets');
      setPets([]);
      setIsLoading(false);
      return;
    }

    setPets((data || []) as StoredPet[]);
    setIsLoading(false);
  }, [userId]);

  const createPet = useCallback(
    async (input: CreatePetInput) => {
      if (!userId) {
        setError('You need to sign in to create a pet profile.');
        return null;
      }

      setError('');

      const payload = {
        user_id: userId,
        name: input.name.trim(),
        species: input.species.trim(),
        breed: input.breed.trim(),
        age: typeof input.age === 'number' ? input.age : null,
      };

      const { data, error: insertError } = await supabase
        .from('pets')
        .insert(payload)
        .select('id, name, species, breed, age')
        .single();

      if (insertError) {
        setError(insertError.message || 'Failed to create pet profile');
        return null;
      }

      const createdPet = data as StoredPet;
      setPets((prev) => [createdPet, ...prev]);
      return createdPet;
    },
    [userId]
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    pets,
    isLoading,
    error,
    createPet,
    refresh,
  };
}
