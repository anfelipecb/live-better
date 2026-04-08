interface ProgressBarProps {
  value: number;
  color?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export default function ProgressBar({
  value,
  color = 'accent',
  className = '',
  size = 'md',
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const heightClass = size === 'sm' ? 'h-1.5' : 'h-2.5';

  return (
    <div
      className={`w-full bg-dark-700 rounded-full overflow-hidden ${heightClass} ${className}`}
    >
      <div
        className={`${heightClass} rounded-full bg-${color} transition-all duration-500 ease-out`}
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}
