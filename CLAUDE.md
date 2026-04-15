# Elevate - Life Improvement Dashboard

## Project Overview
A full-stack life management app for a grad student focused on body recomposition, nutrition, and productivity. Built with Next.js 16, TypeScript, Tailwind CSS v4, Clerk auth, and Supabase.

## Tech Stack
- **Next.js 16** with App Router (`src/app/`)
- **TypeScript** for type safety
- **Tailwind CSS v4** with dark glassmorphism theme (configured in `globals.css` `@theme` blocks)
- **Clerk** for authentication (sign up, sign in, sign out)
- **Supabase** for PostgreSQL database with Row Level Security
- **React Context + useReducer** for client-side state with Supabase persistence layer
- **TheMealDB API** for recipe discovery (proxied via API routes)
- **NYT Article Search API** for wellbeing articles (proxied via API routes)
- **lucide-react** for icons
- **Inter** font via `next/font/google`

## Authentication
- Clerk handles sign up, sign in, sign out
- Clerk JWT template "supabase" enables RLS in Supabase
- Middleware at `src/middleware.ts` protects all routes except `/sign-in`, `/sign-up`, `/shared/*`, and API routes
- `ClerkProvider` wraps the app with dark theme

## Database (Supabase)
15 tables, all with `user_id text NOT NULL` and RLS policies scoped to `auth.jwt() ->> 'sub'`:

| Table | Purpose |
|-------|---------|
| `profiles` | User settings, credit multipliers |
| `body_stats` | Weight/body fat tracking |
| `tasks` | Day planner tasks |
| `workouts` | Workout logs with exercises (JSONB) |
| `meal_assignments` | Meal plan slots |
| `shopping_items` | Shopping list |
| `habits` | Trackable daily habits |
| `habit_logs` | Per-day habit completions |
| `goals` | Goals with milestones (JSONB) |
| `credit_events` | XP/credit activity log |
| `rewards` | Unlockable rewards |
| `saved_recipes` | Recipes saved from TheMealDB API |
| `saved_articles` | Articles saved from NYT API |
| `onboarding` | Difficulty calibration data |
| `shared_links` | Public share tokens |

## External APIs
- **TheMealDB** (no key): `/api/recipes/search`, `/api/recipes/[id]`, `/api/recipes/categories`
- **NYT Article Search** (API key in env): `/api/articles/search`
- All proxied through Next.js API routes to hide keys and enable caching

## Pages (23 routes)
| Route | Description |
|---|---|
| `/` | Home — Solo Leveling-inspired daily companion with quests and XP |
| `/dashboard` | Dashboard — today's overview, habits, quick actions |
| `/sign-in` | Clerk sign-in page |
| `/sign-up` | Clerk sign-up page |
| `/discover` | Search TheMealDB recipes, browse by category, save to account |
| `/discover/[id]` | TheMealDB recipe detail, save, add to meal plan |
| `/articles` | Browse NYT wellbeing articles, save favorites |
| `/day/[date]` | Day planner with morning/afternoon/evening time blocks |
| `/week` | Week overview — 7 day cards, color-coded by workout type |
| `/workouts` | Workout list + weekly schedule |
| `/workouts/log` | Log a new workout (form) |
| `/workouts/[id]` | Workout detail/edit view |
| `/meals` | Weekly meal planner grid (7 days x 4 meal slots) |
| `/recipes` | Saved recipe browser with search and filter |
| `/recipes/[id]` | Recipe detail with ingredients, steps, macros |
| `/shopping` | Shopping list (auto-generated from meals + manual items) |
| `/goals` | Daily habit tracker with streaks + academic/career goals |
| `/profile` | Profile info, body stats logging, progress charts |

## State Management
Single `AppContext` (`src/context/AppContext.tsx`) with a combined reducer handling 26 action types. The context:
1. Creates a Supabase client authenticated with the Clerk session JWT
2. Loads all user data from Supabase on mount (`LOAD_STATE` action)
3. Seeds default profile + rewards + habits for new users
4. Wraps `dispatch` in `persistingDispatch` — optimistic UI updates with fire-and-forget Supabase writes

**Persistence layer** (`src/lib/supabase/`):
- `mappers.ts` — 24 functions converting snake_case ↔ camelCase
- `queries.ts` — 30 typed CRUD functions across all tables
- `persist.ts` — switches on all action types to write to Supabase

## Gamification System (Solo Leveling-inspired)
- **XP Events**: earn XP for workouts (+50), tasks (+10), habits (+15), meals (+10), water (+5/glass)
- **10 Rank Levels**: E-Rank → Shadow Monarch
- **Rewards Store**: spend XP on rewards (Order Delivery, Cheat Meal, Gaming Session, etc.)
- **Daily Quests**: home page shows quest-style cards with XP incentives

## Project Structure
```
src/
  app/            — Pages, layouts, API routes
  app/api/        — TheMealDB + NYT proxy routes
  components/     — Reusable components organized by feature
  context/        — AppContext with Supabase persistence
  data/           — Seed data (exercises, recipes, habits)
  lib/            — Utilities (dates, helpers)
  lib/supabase/   — Client, server, queries, mappers, persist
  types/          — TypeScript interfaces
```

## Environment Variables (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NYT_API_KEY
```

## Running Locally
```bash
npm run dev    # starts on localhost:3000
npm run build  # production build
npm run lint   # ESLint check
```

## Deployment
Deployed to Vercel with all environment variables configured. Push to main triggers auto-deploy.
