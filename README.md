# FrameOps Threat Rules Manager

Senior take-home style frontend: React 19, TypeScript (strict), Vite, and TanStack Query / Table / Virtual.

## Prerequisites

- [Node.js](https://nodejs.org/) 20+ (LTS recommended)
- npm 10+

## Setup

From the project root (`frameops-threat-rules-manager`):

```bash
npm install
```

## Scripts

| Script       | Description                    |
| ------------ | ------------------------------ |
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Typecheck and production build |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Stack

- **Vite** — bundler and dev server
- **@tanstack/react-query** — server/async state (`AppProviders` + `src/api/query-client.ts`)
- **@tanstack/react-table** — table primitives (install ready; use in features)
- **@tanstack/react-virtual** — list virtualization (install ready; use in features)

## Project layout

- `src/app` — root layout, providers
- `src/pages` — route-level pages
- `src/components` — shared UI
- `src/features/threat-rules` — threat-rules feature module
- `src/api` — HTTP client and query client factory
- `src/hooks` — shared hooks
- `src/types` — shared TypeScript types
- `src/utils` — small pure helpers
