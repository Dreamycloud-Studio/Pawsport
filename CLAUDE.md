# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Monorepo (run from repo root)
```bash
pnpm install                        # Install all dependencies
turbo run dev --filter=web          # Start frontend dev server (port 3000)
turbo run build                     # Build all packages
turbo run type-check                # Type-check all packages
turbo run lint                      # Lint all packages
```

### Frontend only (`apps/web/`)
```bash
npm start      # Dev server (proxies /api → localhost:5000)
npm run build  # Production CRA build
npm test       # Run Jest tests
npm test -- --testPathPattern=<file>  # Run single test file
```

### Legacy server (`server/`)
```bash
npm run dev    # ts-node-dev watch mode on port 5000
npm run build  # tsc compile
npm test       # Jest
```

## Architecture

Pawsport is an AI-powered pet travel planner. The repo has two generations of code:

**Active development** — pnpm monorepo (`apps/`, `packages/`, `api/`):
- `apps/web/` — React 17 + TypeScript frontend (Create React App)
- `packages/core/` — Shared types, Supabase client singleton, RAG utility, timeline calculator
- `api/` — Vercel serverless functions (the real backend)

**Legacy structure** — `client/` and `server/` directories exist but are not the active frontend. Changes should go in `apps/web/`.

### Frontend (`apps/web/src/`)

Pages live in `pages/`. The main app is **TravelPlanner** — a 3-panel layout:
- `ChatSidebar` — trip list, create/delete/select trips
- `AITravelChat` — chat with AI, calls `/api/chat` (streaming) and `/api/travel/checklist` (plan generation)
- `PlanPanel` — renders `StructuredTravelPlan` (timeline + checklist)

Trip state is persisted to `localStorage` via `lib/tripStorage.ts` (key: `pawsport.travelPlanner.v1`). No server-side persistence for trip data.

Auth is Supabase-based via `AuthContext` (`contexts/AuthContext.tsx`) — use the `useAuth()` hook everywhere.

UI uses Tailwind with a custom "calm" color palette (cream, sand, charcoal, terracotta, clay, sage, moss) defined in the Tailwind config. Use `cn()` from `lib/utils.ts` for conditional class merging.

**React 17 + Router v5** — use `<Route component={...}>` syntax, not v6 `element` prop. No path aliases in imports.

### API (Vercel Serverless Functions)

All serverless functions live in `api/`. Key endpoints:

| Endpoint | Description |
|---|---|
| `POST /api/chat` | General chat via OpenAI GPT-3.5-turbo |
| `POST /api/travel/checklist` | Generate `StructuredTravelPlan` via GPT-4 |
| `POST /api/regulations/query` | RAG pipeline: Claude Haiku rewrites query → OpenAI embeds → pgvector search → Claude Sonnet answers |

The RAG pipeline (`api/regulations/query.ts`) uses a **read-only** PostgreSQL connection (`POSTGRES_READONLY_URL`) with pgvector. The `regulation_chunks` table has columns: `content`, `source_name`, `source_url`, `topic`, `country`, `pet_types`, `embedding`.

The shared server library lives in `lib/services/` — `LLMService` wraps OpenAI calls for checklist generation.

### Shared Package (`packages/core/`)

Exposes: types, `getSupabaseClient()`, `queryRegulations()`, timeline utilities. Imported in `apps/web` as `@pawsport/core` via workspace resolution.

## Environment Variables

**`apps/web/.env`** (frontend):
```
REACT_APP_SUPABASE_URL=
REACT_APP_SUPABASE_ANON_KEY=
REACT_APP_API_URL=http://localhost:5000
```

**Vercel / production** (for serverless functions):
```
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
POSTGRES_READONLY_URL=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```
