'use client';

import type { ExerciseSet, WorkoutCategory } from '@/types';
import Input from '@/components/ui/Input';
import { X } from 'lucide-react';

interface ExerciseSetRowProps {
  set: ExerciseSet;
  category: WorkoutCategory;
  onChange: (set: ExerciseSet) => void;
  onDelete: () => void;
}

export default function ExerciseSetRow({
  set,
  category,
  onChange,
  onDelete,
}: ExerciseSetRowProps) {
  return (
    <div className="flex items-end gap-3">
      <span className="text-sm text-dark-400 pb-2 min-w-[2rem]">
        #{set.setNumber}
      </span>

      {category === 'strength' && (
        <>
          <div className="flex-1">
            <Input
              label="Reps"
              type="number"
              min={0}
              value={set.reps ?? ''}
              placeholder="0"
              onChange={(e) =>
                onChange({
                  ...set,
                  reps: e.target.value ? Number(e.target.value) : undefined,
                })
              }
            />
          </div>
          <div className="flex-1">
            <Input
              label="Weight (kg)"
              type="number"
              min={0}
              step={0.5}
              value={set.weightKg ?? ''}
              placeholder="0"
              onChange={(e) =>
                onChange({
                  ...set,
                  weightKg: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
            />
          </div>
        </>
      )}

      {category === 'cycling' && (
        <>
          <div className="flex-1">
            <Input
              label="Duration (min)"
              type="number"
              min={0}
              value={set.durationMin ?? ''}
              placeholder="0"
              onChange={(e) =>
                onChange({
                  ...set,
                  durationMin: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
            />
          </div>
          <div className="flex-1">
            <Input
              label="Distance (km)"
              type="number"
              min={0}
              step={0.1}
              value={set.distanceKm ?? ''}
              placeholder="0"
              onChange={(e) =>
                onChange({
                  ...set,
                  distanceKm: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
            />
          </div>
        </>
      )}

      {category === 'yoga' && (
        <div className="flex-1">
          <Input
            label="Duration (min)"
            type="number"
            min={0}
            value={set.durationMin ?? ''}
            placeholder="0"
            onChange={(e) =>
              onChange({
                ...set,
                durationMin: e.target.value
                  ? Number(e.target.value)
                  : undefined,
              })
            }
          />
        </div>
      )}

      <button
        type="button"
        onClick={onDelete}
        className="pb-2 text-dark-400 hover:text-danger transition-colors"
        aria-label="Remove set"
      >
        <X size={18} />
      </button>
    </div>
  );
}
