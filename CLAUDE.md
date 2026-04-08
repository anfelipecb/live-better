# Elevate - Life Improvement Dashboard

## Project Overview
A comprehensive life management app for a grad student focused on body recomposition, nutrition, and productivity. Built with Next.js 16, TypeScript, and Tailwind CSS v4.

## Tech Stack
- **Next.js 16** with App Router (`src/app/`)
- **TypeScript** for type safety
- **Tailwind CSS v4** with dark glassmorphism theme (configured in `globals.css` `@theme` blocks)
- **React Context + useReducer** for client-side state (no database — data lives in memory)
- **lucide-react** for icons
- **Inter** font via `next/font/google`

## Design System
- **Dark glassmorphism**: frosted glass cards over dark gradient backgrounds
- **Time-of-day adaptive accent colors**: blue (morning 5am-12pm), amber (afternoon 12pm-6pm), purple (evening 6pm-5am)
- **Custom CSS classes**: `.glass`, `.glass-hover`, `.glass-accent`, `.glass-strong`, `.accent-glow`
- **Color palette**: `dark-950` through `dark-100` for surfaces, semantic colors for status

## Pages (12 routes)
| Route | Description |
|---|---|
| `/` | Dashboard — today's overview, habits, quick actions |
| `/day/[date]` | Day planner with morning/afternoon/evening time blocks |
| `/week` | Week overview — 7 day cards, color-coded by workout type |
| `/workouts` | Workout list + weekly schedule |
| `/workouts/log` | Log a new workout (form) |
| `/workouts/[id]` | Workout detail/edit view |
| `/meals` | Weekly meal planner grid (7 days x 4 meal slots) |
| `/recipes` | Recipe browser with search and filter |
| `/recipes/[id]` | Recipe detail with ingredients, steps, macros |
| `/shopping` | Shopping list (auto-generated from meals + manual items) |
| `/goals` | Daily habit tracker with streaks + academic/career goals |
| `/profile` | Profile info, body stats logging, progress charts |

## State Management
Single `AppContext` (`src/context/AppContext.tsx`) with a combined reducer handling 24 action types. All state is client-side (in-memory) via `useReducer`. The context provides `state` and `dispatch` to all components via the `useApp()` hook.

**Domains**: tasks, workouts, exercises, recipes, meal assignments, shopping list, habits, habit logs, goals, profile, body stats.

**Seed data** loaded on init: 32 exercises, 15 recipes, 8 habits, 3 goals with milestones.

## Project Structure
```
src/
  app/          — Pages and layouts (App Router)
  components/   — Reusable components organized by feature
  context/      — AppContext, reducers, initial state
  data/         — Seed data (exercises, recipes, habits)
  lib/          — Utility functions (dates, helpers)
  types/        — TypeScript interfaces
```

## Conventions
- Interactive components use `'use client'` directive
- Root layout is a server component wrapping a client `Providers` component
- IDs generated with `crypto.randomUUID()`
- Dates stored as ISO strings (`'YYYY-MM-DD'`)
- All components in `src/components/` organized by feature area

## Running Locally
```bash
npm run dev    # starts on localhost:3000
npm run build  # production build
npm run lint   # ESLint check
```

## Key Features
- **Dashboard**: Time-of-day greeting, habit ring, streak counter, today's workout/meals/tasks, goal progress, quick actions
- **Day Planner**: Morning/afternoon/evening time blocks with task CRUD (add, toggle, delete), priority levels, date navigation
- **Week Overview**: 7-day grid with color-coded workout types, task completion, meal plan status
- **Workout Tracker**: Log strength (sets/reps/weight), cycling (distance/time), yoga (duration). Searchable 32-exercise library. Detail view with data tables.
- **Meal Planner**: Weekly grid (7 days x 4 slots), recipe picker, daily calorie/macro totals, weekly nutrition summary
- **Recipe Browser**: Search + category filter, full detail with macro breakdown bar, ingredients, steps. Assign to meal plan from recipe page.
- **Shopping List**: Auto-generate from week's meal plan, manual items, categorized collapsible sections, check-off and clear
- **Goals & Habits**: Daily habit toggles with streak calculation, 7-day visualization, goal milestones with progress bars
- **Profile**: View/edit profile, log body weight/fat%, SVG line charts for trends over time

## Deployment
Deployed to Vercel. Push to main branch triggers automatic deployment.
