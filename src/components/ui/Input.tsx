'use client';

import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
}

export default function Input({ label, className = '', ...props }: InputProps) {
  const input = (
    <input
      className={`w-full bg-dark-800 border border-dark-600 focus:border-accent rounded-lg px-4 py-2 text-dark-100 placeholder-dark-400 outline-none transition-colors ${className}`}
      {...props}
    />
  );

  if (label) {
    return (
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-dark-200">{label}</label>
        {input}
      </div>
    );
  }

  return input;
}
