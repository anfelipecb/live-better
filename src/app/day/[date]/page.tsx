'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { TimeBlock as TimeBlockType } from '@/types';
import { getToday, formatDate } from '@/lib/utils';
import PageContainer from '@/components/layout/PageContainer';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import TimeBlock from '@/components/planner/TimeBlock';
import TaskForm from '@/components/planner/TaskForm';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function DayPlannerPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = use(params);
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false);
  const [activeBlock, setActiveBlock] = useState<TimeBlockType>('morning');

  // ── Date helpers ─────────────────────────────────────────────────────

  const dateObj = new Date(date + 'T12:00:00');
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  function navigateDay(offset: number) {
    const d = new Date(date + 'T12:00:00');
    d.setDate(d.getDate() + offset);
    router.push(`/day/${formatDate(d)}`);
  }

  function goToToday() {
    router.push(`/day/${getToday()}`);
  }

  // ── Add task handler ─────────────────────────────────────────────────

  function handleAddTask(block: TimeBlockType) {
    setActiveBlock(block);
    setModalOpen(true);
  }

  // ── Render ───────────────────────────────────────────────────────────

  const isToday = date === getToday();

  return (
    <PageContainer>
      <Header
        title={formattedDate}
        subtitle="Plan your day"
        action={
          <div className="flex items-center gap-2">
            {!isToday && (
              <Button variant="ghost" size="sm" onClick={goToToday}>
                Today
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateDay(-1)}
              aria-label="Previous day"
            >
              <ChevronLeft size={18} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateDay(1)}
              aria-label="Next day"
            >
              <ChevronRight size={18} />
            </Button>
          </div>
        }
      />

      {/* Time blocks */}
      <div className="flex flex-col gap-6">
        <TimeBlock timeBlock="morning" date={date} onAddTask={handleAddTask} />
        <TimeBlock timeBlock="afternoon" date={date} onAddTask={handleAddTask} />
        <TimeBlock timeBlock="evening" date={date} onAddTask={handleAddTask} />
      </div>

      {/* Add task modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Task"
      >
        <TaskForm
          date={date}
          timeBlock={activeBlock}
          onClose={() => setModalOpen(false)}
        />
      </Modal>
    </PageContainer>
  );
}
