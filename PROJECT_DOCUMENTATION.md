# PROJECT DOCUMENTATION

## 1. Project Overview

### What this project is

`my-routine-app` is a frontend-only **Routine Tracker / Habit Tracking** application built with React + TypeScript. It provides a monthly habit grid and an analytics layer (daily, weekly, category, and top-habit insights).

### What problem it solves

The app helps users move from informal habit intent ("I should do this more often") to structured tracking:

- Define habits with category, monthly goal, and color.
- Mark habit completion day-by-day in a monthly matrix.
- View derived progress metrics to understand consistency and performance.

### Main purpose

The main purpose is to provide a **local-first personal habit operating system** with:

- habit definition and management,
- completion tracking at day granularity,
- analytics and ranking views.

### Target users (inferred from code)

Not explicitly defined in business docs, but the UI and logic suggest:

- individual users tracking personal routines,
- users who prefer visual monthly tracking + metrics,
- productivity/self-improvement users.

---

## 2. Tech Stack

### Frontend framework

- **React 19** (`react`, `react-dom`)
- **TypeScript** (strict mode via `tsconfig.app.json`)

### Routing

- **React Router** (`react-router-dom`)
- Browser router with nested route layout (`AppShell` + `<Outlet />`)

### State management

- **Zustand** with `persist` middleware
- Store lives in `src/store/habitStore.ts`
- Persisted to `localStorage` key: `routine-tracker-store`

### Styling

- **Material UI (MUI)** for component primitives and theming
- **Tailwind CSS v4** imported globally in `src/index.css`
- App-level visual system in `src/theme.ts`

### Charts / visualization

- **Recharts** for:
  - daily bar chart,
  - category stacked bar chart,
  - weekly donut charts.

### Date/time handling

- **Day.js** for month/day operations, formatting, and date-key normalization.

### Build & tooling

- **Vite** for dev server and production build.
- **ESLint** with TypeScript + React Hooks + React Refresh presets.
- **PostCSS** with `@tailwindcss/postcss` + `autoprefixer`.

### Backend / API / DB / Auth

- **Backend:** Not present.
- **API calls:** Not present in current codebase.
- **Database:** Not present (localStorage persistence only).
- **Authentication/Authorization:** Not present.

---

## 3. Folder Structure

```txt
my-routine-app/
  src/
    app/
      layout/
      routes.tsx
    data/
      storage/
    domain/
      calculations/
      models/
      services/
      utils/
    features/
      analytics/
        components/
        hooks/
        pages/
      dashboard/
        components/
        hooks/
        pages/
      habits/
        components/
        pages/
      tasks/
        components/
        hooks/
        pages/
    store/
    utils/
    App.tsx
    main.tsx
    theme.ts
    index.css
  package.json
  vite.config.ts
  eslint.config.js
  postcss.config.mjs
  tsconfig*.json
  README.md
  DESIGN.md
```

### Folder/file purpose

- `src/app/`
  - Routing and app shell concerns.
  - `routes.tsx` defines active route graph.
  - `layout/AppShell.tsx` provides global page container and `<Outlet />`.

- `src/features/analytics/`
  - Analytics page and chart widgets.
  - `hooks/useAnalyticsData.ts` builds aggregated data for analytics UI.

- `src/features/habits/`
  - Habit tracking UI: tracker page, habit dialog, manager list, grid components.
  - `pages/TrackerPage.tsx` is the primary habit-tracking screen.

- `src/domain/calculations/`
  - Pure business/derived metric functions:
    - daily summary,
    - weekly progress,
    - category progress,
    - top-habit ranking.

- `src/domain/models/`
  - Core domain types (`Habit`, completion formats).

- `src/store/`
  - Global state (`habitStore.ts`) using Zustand.
  - `useHabitStore.ts` re-export convenience.

- `src/utils/`
  - Shared helpers (date keys, completion key, week grouping, ID generation).

- `src/theme.ts`
  - MUI design system, palette, typography, component-level overrides.

- `src/data/storage/`, `src/features/tasks/`, `src/store/AppStore.tsx`, and several `src/domain/services/*`
  - Appear to be **legacy/older iteration modules** and are not part of the current routed flow.

---

## 4. Application Flow

### App entry point

1. `src/main.tsx` mounts `<App />`.
2. `src/App.tsx` wraps app with:
   - `ThemeProvider(appTheme)`
   - `CssBaseline`
   - `Routes`

### Routing flow

- `src/app/routes.tsx`:
  - `/` → `AppShell`
    - index route → `TrackerPage`
    - `/analytics` → `AnalyticsPage`

### Data flow

1. User actions in UI call store actions (`addHabit`, `updateHabit`, `deleteHabit`, `toggleCompletion`).
2. Zustand mutates raw state (`habits`, `completions`).
3. `useAnalyticsData` derives metrics from store state + visible month.
4. Components render charts/tables/cards from derived data.
5. Persist middleware writes state to localStorage.

### User action path example (completion toggle)

`HabitMonthGrid` cell click → `toggleCompletion(habitId, dateKey)` → completion key created/removed in store map → selectors recompute via `useAnalyticsData` → grid + charts + summary update.

---

## 5. Feature-wise Explanation

## A) Habit Tracker (Monthly Grid)

### Purpose

Enable month-level habit tracking with day-cell toggles.

### Important files

- `src/features/habits/pages/TrackerPage.tsx`
- `src/features/habits/components/HabitMonthGrid.tsx`
- `src/features/habits/components/HabitDialog.tsx`
- `src/store/habitStore.ts`

### UI flow

- User opens tracker page.
- Month navigation (`Previous`, `Today`, `Next`) changes visible month.
- Habit grid shows active habits vs month dates.
- Clicking a day cell toggles completion.
- Add habit opens modal dialog.

### Business logic

- Active habits are used for rendering/metrics.
- Completion uses normalized date keys (`YYYY-MM-DD`) and key format `habitId-date`.
- Soft delete sets `active=false`.

### State management

- Store is Zustand (`useHabitStore`), persistent.
- Tracker reads raw completions + analytics projections from `useAnalyticsData`.

### Edge cases handled

- Empty habit state shows onboarding call-to-action panel.
- Daily/summary calculations avoid divide-by-zero (return 0 when totals are 0).

---

## B) Analytics Page

### Purpose

Present aggregated insights for selected month.

### Important files

- `src/features/analytics/pages/AnalyticsPage.tsx`
- `src/features/analytics/hooks/useAnalyticsData.ts`
- `src/features/analytics/components/*`
- `src/domain/calculations/*`

### UI flow

- Displays summary cards first.
- Weekly donut cards.
- Daily + category charts.
- Top habits table.
- Habit management section with edit/delete and add dialog.

### Business logic

- All analytics are computed from:
  - active habits,
  - month date keys,
  - completion map.
- No computed analytics persisted in store.

### Edge cases handled

- If there are no habits, analytics page shows empty state with add button.

---

## C) Habit Management

### Purpose

Create, update, and soft-delete habits.

### Important files

- `src/features/habits/components/HabitDialog.tsx`
- `src/features/habits/components/HabitManagerList.tsx`
- `src/features/habits/constants.ts`

### Behavior

- Dialog supports both create and edit modes.
- Title is trimmed and required.
- Monthly goal clamped to `1..31`.
- Color and category selection included.
- Delete action soft-deletes habit.

---

## 6. API Documentation

No API integration is implemented in the current codebase.

### Observed

- No `fetch`, `axios`, SDK clients, or API service modules are used in active flow.
- No base URL or HTTP middleware patterns are present.
- No endpoint definitions are present.

---

## 7. State Management

### Approach

- Zustand global store with persistence middleware.

### Store file

- `src/store/habitStore.ts`

### Store shape

- `habits: Habit[]`
- `completions: CompletionMap` (`Record<string, boolean>`)

### Actions

- `addHabit(input)`
- `updateHabit(input)`
- `deleteHabit(habitId)` (soft delete)
- `toggleCompletion(habitId, date)`

### Persistence

- localStorage key: `routine-tracker-store`
- Persist config includes:
  - `version: 2`
  - migration from legacy completion array to map (`normalizeCompletions`)
  - partialize to persist only `habits` and `completions`

### Consumption pattern

- Components use selector-based `useHabitStore((state) => ...)` reads.
- `useAnalyticsData` memoizes derived analytics from store state + selected month.

---

## 8. Authentication / Authorization

Authentication and authorization are **not implemented** in the current codebase.

- No login/signup UI
- No token/session handling
- No protected routes
- No role-based access

---

## 9. UI and Styling Architecture

### Styling method

- Hybrid:
  - MUI (`sx`, themed components)
  - Tailwind utility classes (mostly layout helpers like `overflow-x-auto`)
  - global CSS variables in `src/index.css`

### Theme

- `src/theme.ts` defines:
  - palette tokens (cream, violet, orange, etc.)
  - typography scale
  - component overrides (Paper, Button, Chip, Dialog, TextField, OutlinedInput)

### Reusable UI patterns

- Header + action button (`PageHeader`)
- Metric cards (`SummaryCards`)
- Chart cards (`DailyBarChartCard`, `CategoryProgressChartCard`, `WeeklyCards`)
- Data table (`TopHabitsTable`)

### Responsive behavior

- MUI responsive props (`sx` breakpoints, responsive typography/grid sizing).
- Grid/table containers use horizontal overflow handling.

---

## 10. Important Components

| Component                   | Purpose                                | Where used                | Notes                                             |
| --------------------------- | -------------------------------------- | ------------------------- | ------------------------------------------------- |
| `AppShell`                  | Global page container and outlet       | App routes root           | Shared layout shell                               |
| `TrackerPage`               | Main tracking page                     | `/` route                 | Month navigation + grid + analytics cards         |
| `AnalyticsPage`             | Dedicated analytics + habit management | `/analytics` route        | Edit/delete habits + weekly/category/top insights |
| `HabitMonthGrid`            | Habit vs day interactive matrix        | Tracker page              | Custom button-based grid for fast toggling        |
| `HabitDialog`               | Create/edit habit modal                | Tracker + Analytics pages | Input validation/clamping in component            |
| `SummaryCards`              | KPI card row                           | Tracker + Analytics pages | Circular progress indicators by metric tone       |
| `DailyBarChartCard`         | Daily completion chart                 | Tracker + Analytics       | Recharts bar chart                                |
| `CategoryProgressChartCard` | Category stacked progress chart        | Tracker + Analytics       | Vertical stacked bars                             |
| `WeeklyCards`               | Weekly donut progress cards            | Analytics page            | One donut per week bucket                         |
| `TopHabitsTable`            | Ranked habit table                     | Tracker + Analytics       | Score/goal/completed ranking view                 |
| `HabitManagerList`          | List management for edit/delete        | Analytics page            | Uses chips + actions                              |

---

## 11. Utilities and Helpers

### `src/utils/date.ts`

- `toDateKey(value)` → normalized `YYYY-MM-DD`
- `todayKey()`
- `daysInMonth(year, monthIndex)`
- `monthRangeKeys(year, monthIndex)`
- `completionKey(habitId, value)` for map lookup
- `parseDateKey(dateKey)`

### `src/utils/week.ts`

- week-grouping helpers over date key arrays

### `src/utils/ids.ts`

- lightweight client-side ID generation

### Domain calculations (`src/domain/calculations/`)

- `progress.ts`: summary metrics, daily series, top habits
- `weekly.ts`: Monday-based week grouping and weekly progress
- `category.ts`: category progress aggregates

---

## 12. Environment Variables

No environment variables are referenced in the current codebase.

| Variable                                    | Purpose | Usage |
| ------------------------------------------- | ------- | ----- |
| Not clearly defined in the current codebase | N/A     | N/A   |

---

## 13. Build and Run Instructions

Lock file present: `package-lock.json` → use **npm**.

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

### Create production build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

### Tests

No test scripts are defined in `package.json`.

---

## 14. Deployment Notes

Deployment configuration is **not clearly defined in the current codebase**.

### Observed

- No platform-specific config files (Vercel/Netlify/Docker/CI deploy manifests) were found.
- Standard Vite output would be `dist/` after `npm run build`.

---

## 15. Known Patterns and Architecture Decisions

### Patterns used

- **Feature-based structure** (`features/habits`, `features/analytics`).
- **Domain calculation isolation** for derived metrics.
- **Global store for raw state**, derived analytics computed on demand.
- **Soft deletion** of habits (`active` flag).
- **Completion map** (`Record<string, boolean>`) optimized for O(1) lookup by composite key.

### Naming / structure conventions

- Components in PascalCase.
- Utility and store modules in camelCase/lowercase file naming.
- Types separated under `domain/models`.

### Important decision visible in code

- Migration path exists from older completion array schema to map schema in store persistence (`version: 2` + `migrate`).

---

## 16. Developer Onboarding Guide

### Recommended reading order

1. `README.md`
2. `src/app/routes.tsx`
3. `src/store/habitStore.ts`
4. `src/domain/calculations/*.ts`
5. `src/features/habits/pages/TrackerPage.tsx`
6. `src/features/analytics/pages/AnalyticsPage.tsx`
7. `src/theme.ts`

### Start project locally

```bash
npm install
npm run dev
```

### Add a new feature (recommended path)

1. Add/extend domain model (`src/domain/models`).
2. Add pure calculations in `src/domain/calculations`.
3. Extend Zustand store action/state if needed.
4. Add feature UI under `src/features/<feature>/`.
5. Wire route in `src/app/routes.tsx` if required.

### Add a new API call (future pattern suggestion)

Not currently implemented. A clean extension path would be:

- create `src/services/api/*`,
- keep store actions side-effect free where possible,
- add async hooks for fetching/mutations.

### Debugging common issues

- State persistence bugs: inspect localStorage key `routine-tracker-store`.
- Date misalignment: validate `toDateKey()` and month key generation.
- Chart mismatch: verify derived series from `useAnalyticsData`.
- Route issues: check nested route definitions and `Outlet` in `AppShell`.

---

## 17. Current Limitations / Observations

### Observations

- No backend/API/auth/test coverage yet.
- Current architecture is frontend-local and persistence-local only.

### Potential technical debt

- The repository contains **legacy/parallel code paths** not used by active routes, including:
  - `src/features/tasks/*`
  - `src/store/AppStore.tsx`
  - `src/domain/services/*`
  - `src/data/storage/*`
  - duplicate/older dashboard implementations
- This may create confusion for new contributors and should be consolidated.

### Refactoring opportunities

- Remove or archive unused legacy modules.
- Standardize on one date utility namespace (`src/utils/*` vs `src/domain/utils/*`).
- Add tests for calculation functions and store actions.
- Add explicit docs for product scope and module ownership.

---

## Appendix: Active Route Surface (Current)

- `/` → `TrackerPage`
- `/analytics` → `AnalyticsPage`

These are the main user-facing screens in the current runtime flow.
