'use client';

import { useState } from 'react';
import type { WorkoutCategory } from '@/types';
import { useApp } from '@/context/AppContext';
import Input from '@/components/ui/Input';
import GlassCard from '@/components/ui/GlassCard';
import { Search, Check } from 'lucide-react';

interface ExercisePickerProps {
  category: WorkoutCategory;
  onSelect: (exerciseId: string) => void;
  selectedIds: string[];
}

export default function ExercisePicker({
  category,
  onSelect,
  selectedIds,
}: ExercisePickerProps) {
  const { state } = useApp();
  const [search, setSearch] = useState('');

  const filtered = state.exercises
    .filter((ex) => ex.category === category)
    .filter((ex) =>
      ex.name.toLowerCase().includes(search.toLowerCase()),
    );

  return (
    <GlassCard className="p-4">
      <div className="relative mb-3">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400"
        />
        <Input
          placeholder="Search exercises..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="max-h-48 overflow-y-auto space-y-1">
        {filtered.length === 0 && (
          <p className="text-sm text-dark-400 py-2 text-center">
            No exercises found
          </p>
        )}
        {filtered.map((ex) => {
          const isSelected = selectedIds.includes(ex.id);
          return (
            <button
              key={ex.id}
              type="button"
              disabled={isSelected}
              onClick={() => onSelect(ex.id)}
              className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                isSelected
                  ? 'opacity-40 cursor-not-allowed text-dark-400'
                  : 'text-dark-200 hover:bg-white/5 cursor-pointer'
              }`}
            >
              <div>
                <span>{ex.name}</span>
                <span className="ml-2 text-xs text-dark-500">
                  {ex.muscleGroup} / {ex.equipment}
                </span>
              </div>
              {isSelected && <Check size={14} className="text-success" />}
            </button>
          );
        })}
      </div>
    </GlassCard>
  );
}
