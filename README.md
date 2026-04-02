# FrameOps Threat Rules Manager

Senior take-home style frontend simulation: **React 19 + TypeScript (strict) + Vite + TanStack Query/Table/Virtual**.

This app manages **threat detection rules** (search, filters, sorting, selection, and an update-capable details panel) using a **mock in-memory API** with realistic async behavior.

## Setup

From the project root (`frameops-threat-rules-manager`):

```bash
npm install
```

Run locally:

```bash
npm run dev
```

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

## Key Features

- Threat rule catalog with **debounced search**, **severity/source/status filters**, and **client-side sorting**
- **Row selection** and a **rule details panel** with update actions:
  - Toggle rule status (enabled/disabled)
  - Update threshold
  - Assign to a mock current user
- **Async UX** for both queries and mutations (loading, error, pending/saving states)
- **AbortSignal support** in the mock API (structured like a real cancellable HTTP client)
- **Virtualized table** for 1000+ rows using fixed-height rows for consistent scrolling

## Tech Stack

- **React** + **TypeScript**
- **Vite**
- **@tanstack/react-query** for server state/caching
- **@tanstack/react-table** for column/row modeling
- **@tanstack/react-virtual** for row virtualization

## Design Decisions

- **Derived state for visible rows**
  - Filtering and sorting are computed from the React Query `data` + local UI inputs via `useMemo`.
  - The app does **not** store filtered/sorted results in React state (avoids duplicated state and drift).

- **React Query as the source of truth**
  - Threat rules are fetched and cached by stable query keys.
  - Mutations update both the list and details caches on success so the **table and details panel stay consistent**.
  - Queries keep `retry: 1`; mutations do **not** auto-retry.

- **Virtualized TanStack Table (simple + production-like)**
  - Fixed row height (44px), with a virtual “window” inside a scrollable container.
  - Header remains non-virtualized; only visible rows are rendered.

- **Performance optimization guided by profiling**
  - Split virtualization rendering into a lightweight positioned row wrapper and a memoized row-content component.
  - Conservative virtualization overscan and `translate3d` positioning reduce scroll-time work.
  - In a profiler sample, scroll render cost dropped from roughly **~45ms to ~8ms** for the visible rows (varies by machine).

- **AbortSignal support**
  - React Query’s `signal` is threaded into the mock API.
  - The mock async delay rejects on abort to prevent stale results from “winning” after fast selection changes.
  - The details query does not use `keepPreviousData`, so the panel clearly reflects the new rule’s loading state.

## Tradeoffs (kept intentionally simple)

- **Client-side filtering/sorting** (no server-side query building)
- **No optimistic updates** (clear correctness over latency masking)
- **Minimal styling** (production-like structure, not a fully designed UI)
- Mock backend is **in-memory**: data resets on reload; no persistence/auth.

## Project Layout (high level)

- `src/app` — root layout, providers
- `src/pages` — pages (currently `ThreatRulesPage`)
- `src/features/threat-rules` — domain types, mock API, hooks, and components
- `src/api` — query client factory
