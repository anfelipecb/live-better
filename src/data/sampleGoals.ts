import type { Goal } from '@/types';

export const sampleGoals: Goal[] = [
  {
    id: 'goal-mscapp',
    title: 'Complete MSCAPP with Honors',
    description:
      'Graduate from the Masters in Computational Analysis and Public Policy program with honors, maintaining a strong GPA and completing a standout capstone.',
    category: 'academic',
    deadline: '2026-06-15',
    milestones: [
      {
        id: 'ms-mscapp-1',
        title: 'Finish all assignments',
        completed: true,
      },
      {
        id: 'ms-mscapp-2',
        title: 'Maintain 3.8+ GPA',
        completed: true,
      },
      {
        id: 'ms-mscapp-3',
        title: 'Complete capstone project',
        completed: false,
      },
      {
        id: 'ms-mscapp-4',
        title: 'Graduate',
        completed: false,
      },
    ],
  },
  {
    id: 'goal-body-fat',
    title: 'Reach 15% Body Fat',
    description:
      'Achieve a lean physique through consistent training and nutrition, dropping body fat percentage progressively from the current level down to 15%.',
    category: 'fitness',
    deadline: '2026-12-31',
    milestones: [
      {
        id: 'ms-bf-1',
        title: 'Consistent 6 day/week training',
        completed: true,
      },
      {
        id: 'ms-bf-2',
        title: 'Hit 20% body fat',
        completed: true,
      },
      {
        id: 'ms-bf-3',
        title: 'Hit 17% body fat',
        completed: false,
      },
      {
        id: 'ms-bf-4',
        title: 'Hit 15% body fat',
        completed: false,
      },
    ],
  },
  {
    id: 'goal-portfolio',
    title: 'Build a Side Project Portfolio',
    description:
      'Create a portfolio of full-stack projects to showcase software engineering skills and land a great role after graduation.',
    category: 'career',
    deadline: '2026-09-01',
    milestones: [
      {
        id: 'ms-port-1',
        title: 'Complete Elevate app',
        completed: true,
      },
      {
        id: 'ms-port-2',
        title: 'Build 2nd full-stack project',
        completed: false,
      },
      {
        id: 'ms-port-3',
        title: 'Create portfolio site',
        completed: false,
      },
      {
        id: 'ms-port-4',
        title: 'Apply to 10 companies',
        completed: false,
      },
    ],
  },
];
