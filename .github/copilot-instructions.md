# Pawsport AI Coding Agent Instructions

## Project Overview
Pawsport is an AI-powered pet travel assistant with two core features:
1. **Travel Assistant**: AI chat + structured travel plan generation (checklist, timeline, regulation lookup)
2. **Nose Booper**: Community layer connecting pet owners on similar travel routes

## Architecture

### Monorepo Structure
- `apps/web/` — React 17 + TypeScript SPA (Create React App)
- `packages/core/` — Shared types, Supabase client singleton, RAG utility, timeline utils
- `api/` — Vercel serverless functions (the backend)
- `lib/` — Shared server-side services (LLMService, community/matching logic)

Build and deployment are managed by **pnpm workspaces + Turbo**. Vercel builds from `apps/web/` and routes `/api/*` to the serverless functions in `api/`.

### Key Data Flows

1. **Travel Planning**: `TravelPlanner` page → `AITravelChat` → `POST /api/travel/checklist` → GPT-4 → `StructuredTravelPlan` → `PlanPanel`
2. **Regulation Query**: `useRegulationQuery()` hook → `POST /api/regulations/query` → Claude Haiku (query rewrite) → OpenAI embeddings → pgvector search → Claude Sonnet (answer generation)
3. **General Chat**: `AITravelChat` → `POST /api/chat` → GPT-3.5-turbo → streamed response
4. **Community**: `Community` page → `POST/GET /api/community/posts` → Supabase

### Trip State
Trip data is persisted client-side in `localStorage` via `apps/web/src/lib/tripStorage.ts` (key: `pawsport.travelPlanner.v1`). There is no server-side persistence for trip planner state.

### Auth
Supabase auth via `AuthContext` (`apps/web/src/contexts/AuthContext.tsx`). Always use the `useAuth()` hook to access user/session. Never read Supabase directly from components.

## Development Workflows

```bash
# From repo root
pnpm install
turbo run dev --filter=web      # Frontend dev server on :3000

# Frontend only (apps/web/)
npm start
npm run build
npm test
npm test -- --testPathPattern=<file>   # Single test file
```

The frontend proxies `/api` → `http://localhost:5000` in development (configured in `apps/web/package.json`). For full-stack local dev, Vercel CLI (`vercel dev`) runs both together.

## Code Conventions

### Component Organization
- **Pages** (`pages/`): Route-level containers
- **Feature components**: Domain-organized under `TravelAssistant/`, `NoseBooper/`, `landing/`
- **Shared** (`shared/`): `Header`, `Footer`, `ProtectedRoute`, `NotificationBell`
- **UI primitives** (`ui/`): `Button`, `Card`, `Input`, `Badge`, `Select`

### Styling
Tailwind CSS with a custom "calm" color palette (cream, sand, charcoal, terracotta, clay, sage, moss) — not standard Tailwind colors. Use `cn()` from `apps/web/src/lib/utils.ts` for conditional class merging.

### React Version
**React 17 + Router v5** — use `<Route component={...}>` syntax, not the v6 `element` prop. No path aliases in imports.

### API Serverless Functions
All backend logic lives in `api/`. Each file exports a default `handler(req, res)` function. Shared services are in `lib/services/`.

### Type Definitions
- Frontend types: `apps/web/src/types/index.ts`
- Shared types (used by both frontend and api): `packages/core/src/types/index.ts`

## Critical Integration Points

### LLM Services
- `OPENAI_API_KEY` — used by `api/chat.ts`, `api/travel/checklist.ts`, and the embedding step in `api/regulations/query.ts`
- `ANTHROPIC_API_KEY` — used by `api/regulations/query.ts` for query rewriting (Claude Haiku) and answer generation (Claude Sonnet)

### RAG Database
`api/regulations/query.ts` uses a **read-only** PostgreSQL connection (`POSTGRES_READONLY_URL`) with pgvector. The `regulation_chunks` table holds pre-embedded regulation documents filtered by `country` and `pet_types`.

### Supabase
Frontend: `REACT_APP_SUPABASE_URL` + `REACT_APP_SUPABASE_ANON_KEY`  
API/server: `SUPABASE_URL` + `SUPABASE_ANON_KEY` + `SUPABASE_SERVICE_ROLE_KEY`

### Route Structure
- `/api/chat` — General AI chat
- `/api/travel/checklist` — Generate structured travel plan
- `/api/travel/regulations` — Regulation summary (placeholder)
- `/api/travel/documents` — Document explainer (placeholder)
- `/api/regulations/query` — RAG regulation lookup
- `/api/community/posts` — Community posts
- `/api/notifications` — Notifications
