# Sparkeefy AI Wingman — Frontend

Dark-themed SaaS dashboard for Sparkeefy Wingman. Manage people, memories, and AI reply runs with a mobile-responsive UI inspired by [sparkeefy.com](https://www.sparkeefy.com).

**Live app:** `https://sparkeefywingmanai.vercel.app`  
**Local dev:** `http://localhost:3000`

---

## Table of Contents

1. [Assumptions](#assumptions)
2. [Setup Instructions](#setup-instructions)
3. [Pages & Features](#pages--features)
4. [API Integration](#api-integration)
5. [Environment Variables](#environment-variables)
6. [Project Structure](#project-structure)
7. [Architecture](#architecture)
8. [Testing & QA](#testing--qa)
9. [Known Limitations](#known-limitations)
10. [What I Would Improve With More Time](#what-i-would-improve-with-more-time)

---

## Assumptions

| Topic | Assumption |
|-------|------------|
| **Backend** | Consumes the Sparkeefy Wingman REST API at `/v1`. Backend repo handles auth, AI, and data ownership. |
| **Authentication** | Client sends `x-user-id` on every API request. Dev defaults to `demo-user`; production generates a unique anonymous ID stored in `localStorage`. |
| **Design** | Dark theme only. Pink/black Sparkeefy palette. No glassmorphism, no heavy glow. Subtle micro-interactions only. |
| **Typography** | Inter (body), Plus Jakarta Sans (headings), Instrument Serif (accent word *Caring*). |
| **Routing** | Client-side SPA via React Router — no server-side rendering required. |
| **Deployment** | Static build on Vercel. API URL injected via `VITE_API_URL` at build time. |

---

## Setup Instructions

### Prerequisites

- **Node.js 20+**
- **Running backend API** (local Express or deployed Cloudflare Worker)

### 1. Configure environment

```bash
cd frontend
cp .env.example .env
```

Set `VITE_API_URL` to your backend:

```bash
# Local
VITE_API_URL=http://localhost:4000/v1

# Production
VITE_API_URL=https://your-worker.workers.dev/v1
```

### 2. Install & run

```bash
npm install
npm run dev
```

Open **http://localhost:3000**

### 3. Production build

```bash
npm run build
npm run preview   # optional — preview production build locally
```

### 4. Demo account

In **Settings → Use Demo Account**, switch to `demo-user` to see seeded backend data.

---

## Pages & Features

| Route | Page | Description |
|-------|------|-------------|
| `/` | Dashboard | Stats, recent runs, quick actions |
| `/people` | People List | All recipients with avatars |
| `/people/new` | Create Person | Form: displayName, relationshipLabel, pronouns |
| `/people/:id` | Person Details | Edit person, link to memories and runs |
| `/people/:id/memories` | Memories Manager | Add, edit, activate/deactivate memories |
| `/wingman/new` | New Wingman Run | Message input, tone, goal, recent chat context |
| `/wingman` | Run History | All past runs with status badges |
| `/wingman/:id` | Run Details | Suggested replies, reasoning, memory used |
| `/settings` | Settings | User ID, demo account, API info |

### UX highlights

- **Desktop** — collapsible sidebar navigation
- **Mobile** — top header, slide-out drawer, bottom tab bar
- **Layout** — thin white frame border (Sparkeefy-inspired), scrollable main content area
- **Forms** — React Hook Form + Zod validation matching backend rules
- **Data fetching** — TanStack Query with 30s stale time

---

## API Integration

All requests go through [`src/lib/api.ts`](./src/lib/api.ts) with automatic `x-user-id` header from [`src/lib/auth.ts`](./src/lib/auth.ts).

### Hooks ([`src/hooks/use-api.ts`](./src/hooks/use-api.ts))

| Hook | Backend endpoint |
|------|------------------|
| `usePeople()` | `GET /v1/people` |
| `usePerson(id)` | `GET /v1/people/:id` |
| `useCreatePerson()` | `POST /v1/people` |
| `useUpdatePerson()` | `PATCH /v1/people/:id` |
| `useMemories(personId)` | `GET /v1/people/:id/memories` |
| `useCreateMemory()` | `POST /v1/people/:id/memories` |
| `useUpdateMemory()` | `PATCH /v1/people/:id/memories/:memoryId` |
| `useWingmanRuns()` | `GET /v1/wingman-runs` |
| `useWingmanRun(id)` | `GET /v1/wingman-runs/:id` |
| `useCreateWingmanRun()` | `POST /v1/wingman-runs` (auto `Idempotency-Key`) |

### Example — what the frontend sends

Creating a Wingman run (same contract as backend README):

```json
POST /v1/wingman-runs
Headers: x-user-id, Idempotency-Key, Content-Type

{
  "personId": "uuid",
  "input": {
    "message": "She said I seem distant. Help me reply.",
    "tone": "warm",
    "goal": "reassure without sounding desperate"
  },
  "context": {
    "recentMessages": [
      { "role": "recipient", "text": "you feel distant lately" }
    ]
  }
}
```

---

## Environment Variables

Copy from [`.env.example`](./.env.example) — **no secrets required** in the frontend.

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Yes | Backend API base URL including `/v1` |

Example:

```bash
VITE_API_URL=http://localhost:4000/v1
```

> Vite exposes only variables prefixed with `VITE_`. Values are baked in at build time.

---

## Project Structure

```
frontend/
├── public/brand/          Logo assets (heart + wordmark)
├── src/
│   ├── components/
│   │   ├── brand/         Logo, splash loader
│   │   ├── layout/        App shell, sidebar, page header
│   │   └── ui/            shadcn-style primitives (Button, Card, Input…)
│   ├── hooks/             TanStack Query API hooks
│   ├── lib/               api.ts, auth.ts, types.ts, utils.ts
│   ├── pages/             Route-level page components
│   ├── App.tsx            Route definitions
│   ├── main.tsx           Entry point
│   └── index.css          Tailwind theme tokens
├── index.html
├── vite.config.ts
└── vercel.json            Security headers (CSP, HSTS)
```

---

## Architecture

Full details: **[ARCHITECTURE.md](./ARCHITECTURE.md)**

```
Browser
  └── React SPA (Vite)
        ├── AppShell (layout, nav, scroll container)
        ├── Pages (route components)
        ├── TanStack Query (server state cache)
        └── api.ts → REST backend (/v1)
```

### Design system ([`src/index.css`](./src/index.css))

| Token | Value | Usage |
|-------|-------|-------|
| `--color-background` | `#000000` | Page background |
| `--color-primary` | `#ff4d91` | Sparkeefy pink — buttons, active states |
| `--color-card` | `#1a1a1a` | Cards, sidebar |
| `--color-muted` | `#b0b0b0` | Secondary text |
| `--radius-md` | `16px` | Cards, inputs |
| `--radius-pill` | `9999px` | Nav pills, badges |

### Key tradeoffs

| Decision | Why |
|----------|-----|
| Vite + React (not Next.js) | Lighter SPA; backend is separate REST API per spec |
| Client-side auth (`x-user-id`) | Matches backend fake auth; easy to swap for JWT later |
| TanStack Query | Declarative caching, loading/error states, minimal boilerplate |
| shadcn-style components | Consistent, accessible primitives without a heavy UI framework |

---

## Testing & QA

No automated E2E suite yet. Manual checklist:

| Flow | Steps |
|------|-------|
| **Create person** | People → Add Person → fill form → save → appears in list |
| **Add memory** | Person detail → Memories → add preference/boundary → shows in list |
| **Wingman run** | New Run → select person → enter message + context → submit → view replies |
| **Run history** | Wingman → History → click run → see snapshots and suggested replies |
| **Ownership** | Settings → change user ID → data isolates per user |
| **Mobile** | Resize to phone width → bottom nav works, pages scroll, drawer opens |
| **Demo data** | Settings → Use Demo Account → seeded people and runs appear |

Backend integration tests: run `npm test` in the **backend** repo.

---

## Known Limitations

- **No real login** — user ID is client-controlled via localStorage
- **No offline support** — requires live API connection
- **No automated frontend tests** — manual QA only
- **Build-time API URL** — changing `VITE_API_URL` requires a rebuild/redeploy
- **No run deletion** — matches backend (runs are immutable history)

---

## What I Would Improve With More Time

1. **Real authentication UI** — login/signup flow wired to JWT backend
2. **Playwright E2E tests** — cover critical flows (create person → run → view result)
3. **Optimistic updates** — instant UI feedback on create/edit before server confirms
4. **Run filtering & search** — filter history by person, status, date range
5. **Toast notifications** — success/error feedback on mutations
6. **Skeleton loading states** — replace generic loader with content-aware placeholders
7. **PWA support** — installable app with service worker for offline shell

---

## Related Docs

- [ARCHITECTURE.md](./ARCHITECTURE.md) — frontend module layout and design decisions
- [DEPLOY.md](./DEPLOY.md) — Vercel deployment steps
- Backend README — API docs, example calls, database schema

---

**Author:** Hardik Gupta · Sparkeefy AI Wingman take-home project
