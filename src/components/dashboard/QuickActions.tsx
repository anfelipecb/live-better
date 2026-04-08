'use client';

import Link from 'next/link';
import { getToday } from '@/lib/utils';
import { Dumbbell, CalendarDays, ChefHat, Target } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface QuickAction {
  label: string;
  href: string;
  icon: LucideIcon;
}

const actions: QuickAction[] = [
  { label: 'Log Workout', href: '/workouts/log', icon: Dumbbell },
  { label: 'Plan Day', href: '', icon: CalendarDays }, // href set dynamically
  { label: 'Add Recipe', href: '/recipes', icon: ChefHat },
  { label: 'Track Goal', href: '/goals', icon: Target },
];

export default function QuickActions() {
  const today = getToday();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {actions.map((action) => {
        const Icon = action.icon;
        const href = action.label === 'Plan Day' ? `/day/${today}` : action.href;

        return (
          <Link
            key={action.label}
            href={href}
            className="glass glass-hover rounded-xl p-4 flex flex-col items-center gap-3 text-center transition-all"
          >
            <Icon className="text-accent" size={24} />
            <span className="text-sm font-medium text-dark-200">
              {action.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
