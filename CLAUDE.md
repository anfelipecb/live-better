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
Single `AppContext` with a combined reducer delegating to domain-specific slice reducers:
- `tasksReducer` — day planner tasks
- `workoutsReducer` — workout logs
- `mealsReducer` — meal plan assignments
- `recipesReducer` — recipe library (seeded with ~15 recipes)
- `shoppingReducer` — shopping list items
- `habitsReducer` — daily habits + completion logs
- `goalsReducer` — goals with milestones
- `profileReducer` — body stats, user preferences

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

## Deployment
Deployed to Vercel. Push to main branch triggers automatic deployment.
