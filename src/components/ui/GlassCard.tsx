'use client';

import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  accent?: boolean;
  hover?: boolean;
}

export default function GlassCard({
  children,
  className = '',
  accent = false,
  hover = false,
}: GlassCardProps) {
  const baseClasses = accent ? 'glass-accent' : 'glass';
  const hoverClass = hover ? 'glass-hover' : '';

  return (
    <div className={`${baseClasses} ${hoverClass} rounded-xl p-6 ${className}`}>
      {children}
    </div>
  );
}
