'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import {
  LayoutDashboard,
  CalendarDays,
  CalendarRange,
  Dumbbell,
  UtensilsCrossed,
  ChefHat,
  ShoppingCart,
  Target,
  User,
  Flame,
  Zap,
} from 'lucide-react';

const today = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

interface NavItem {
  label: string;
  href: string | (() => string);
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/', icon: Zap },
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Day Planner', href: () => `/day/${today()}`, icon: CalendarDays },
  { label: 'Week View', href: '/week', icon: CalendarRange },
  { label: 'Workouts', href: '/workouts', icon: Dumbbell },
  { label: 'Meals', href: '/meals', icon: UtensilsCrossed },
  { label: 'Recipes', href: '/recipes', icon: ChefHat },
  { label: 'Shopping', href: '/shopping', icon: ShoppingCart },
  { label: 'Goals', href: '/goals', icon: Target },
  { label: 'Profile', href: '/profile', icon: User },
];

const mobileItems: NavItem[] = [
  navItems[0], // Home (Zap icon)
  navItems[2], // Day Planner
  navItems[4], // Workouts
  navItems[5], // Meals
  navItems[8], // Goals
];

function resolveHref(href: string | (() => string)): string {
  return typeof href === 'function' ? href() : href;
}

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname.startsWith(href);
}

export default function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col glass z-40">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-6 py-5 border-b border-white/5">
          <Flame size={24} className="text-accent" />
          <span className="text-xl font-bold text-dark-100">Elevate</span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 flex flex-col gap-1 px-3 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const href = resolveHref(item.href);
            const active = isActive(pathname, href);
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'glass-accent text-accent'
                    : 'text-dark-300 hover:bg-white/5 hover:text-dark-100'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User button */}
        <div className="px-6 py-4 border-t border-white/5">
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'w-8 h-8',
              },
            }}
          />
        </div>
      </aside>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass z-40 border-t border-white/5">
        <div className="flex items-center justify-around py-2">
          {mobileItems.map((item) => {
            const href = resolveHref(item.href);
            const active = isActive(pathname, href);
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                  active ? 'text-accent' : 'text-dark-400 hover:text-dark-200'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
