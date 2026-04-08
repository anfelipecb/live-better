import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?:
    | 'default'
    | 'success'
    | 'warning'
    | 'danger'
    | 'strength'
    | 'cycling'
    | 'yoga'
    | 'rest';
  className?: string;
}

const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-dark-600/50 text-dark-200',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  danger: 'bg-danger/15 text-danger',
  strength: 'bg-strength/15 text-strength',
  cycling: 'bg-cycling/15 text-cycling',
  yoga: 'bg-yoga/15 text-yoga',
  rest: 'bg-rest/15 text-rest',
};

export default function Badge({
  children,
  variant = 'default',
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
