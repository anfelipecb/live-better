'use client';

import { useEffect, type ReactNode } from 'react';
import { AppProvider } from '@/context/AppContext';
import { getTimeOfDay } from '@/lib/utils';

// ── Time-of-Day Provider ──────────────────────────────────────────────

function TimeOfDayProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    function updateTimeAttribute() {
      document.documentElement.setAttribute('data-time', getTimeOfDay());
    }

    // Set immediately on mount
    updateTimeAttribute();

    // Update every minute
    const interval = setInterval(updateTimeAttribute, 60_000);

    return () => clearInterval(interval);
  }, []);

  return <>{children}</>;
}

// ── Combined Providers ────────────────────────────────────────────────

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <TimeOfDayProvider>{children}</TimeOfDayProvider>
    </AppProvider>
  );
}
