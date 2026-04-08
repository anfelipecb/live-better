'use client';

import { useState } from 'react';
import type { TimeBlock, Priority } from '@/types';
import { useApp } from '@/context/AppContext';
import { generateId } from '@/lib/utils';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface TaskFormProps {
  date: string;
  timeBlock: TimeBlock;
  onClose: () => void;
}

export default function TaskForm({ date, timeBlock, onClose }: TaskFormProps) {
  const { dispatch } = useApp();
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [notes, setNotes] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    dispatch({
      type: 'ADD_TASK',
      payload: {
        id: generateId(),
        date,
        timeBlock,
        title: title.trim(),
        priority,
        completed: false,
        notes: notes.trim() || undefined,
      },
    });

    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Title */}
      <Input
        label="Title"
        placeholder="What do you need to do?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        autoFocus
      />

      {/* Priority */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-dark-200">Priority</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="w-full bg-dark-800 border border-dark-600 focus:border-accent rounded-lg px-4 py-2 text-dark-100 outline-none transition-colors cursor-pointer"
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Time Block (read-only) */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-dark-200">Time Block</label>
        <div className="w-full bg-dark-800/50 border border-dark-600 rounded-lg px-4 py-2 text-dark-300 capitalize">
          {timeBlock}
        </div>
      </div>

      {/* Notes */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-dark-200">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes..."
          rows={3}
          className="w-full bg-dark-800 border border-dark-600 focus:border-accent rounded-lg px-4 py-2 text-dark-100 placeholder-dark-400 outline-none transition-colors resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Save Task</Button>
      </div>
    </form>
  );
}
