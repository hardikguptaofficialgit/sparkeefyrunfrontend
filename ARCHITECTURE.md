# Sparkeefy AI Wingman — Frontend Architecture

## Overview

The frontend is a **Vite + React 19 SPA** that consumes the Sparkeefy Wingman REST API. It has no server-side logic — all business rules live in the backend.

```
┌─────────────────────────────────────────────────┐
│  Browser                                        │
│  ┌───────────────────────────────────────────┐  │
│  │  AppShell (layout, nav, scroll)           │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │  Pages (Dashboard, People, Wingman) │  │  │
│  │  └──────────────┬──────────────────────┘  │  │
│  │                 │                           │  │
│  │  TanStack Query │  React Hook Form + Zod   │  │
│  │                 ▼                           │  │
│  │           api.ts (fetch wrapper)            │  │
│  └─────────────────┬─────────────────────────┘  │
└────────────────────┼────────────────────────────┘
                     │  HTTPS + x-user-id header
                     ▼
              Backend /v1 API
```

## Folder layout

| Path | Role |
|------|------|
| `src/pages/` | One component per route — owns page-level layout and data fetching |
| `src/components/layout/` | App shell, sidebar, mobile nav, page headers |
| `src/components/ui/` | Reusable primitives (Button, Card, Input, Select, Badge) |
| `src/components/brand/` | Sparkeefy logo, splash loader |
| `src/hooks/use-api.ts` | TanStack Query hooks wrapping every API endpoint |
| `src/lib/api.ts` | Fetch wrapper — base URL, headers, error parsing |
| `src/lib/auth.ts` | User ID persistence in localStorage |
| `src/lib/types.ts` | TypeScript types mirroring backend responses |

## Data flow

1. Page component calls a hook (e.g. `usePeople()`)
2. Hook calls `apiRequest()` with the current user ID
3. TanStack Query caches the result (30s stale time)
4. Mutations (`useCreatePerson`, etc.) invalidate relevant query keys on success
5. Wingman run creation auto-generates a UUID `Idempotency-Key` per request

## Layout system

### Desktop (≥ lg)

- Fixed-height viewport shell with white border frame
- Collapsible left sidebar (72px collapsed / 256px expanded)
- Main content scrolls independently inside the frame

### Mobile (< lg)

- Top header with hamburger menu + centered wordmark
- Slide-out drawer for full navigation
- Bottom tab bar (5 items) — always visible, not overlapping content
- Main area scrolls between header and bottom nav

## Design tokens

Defined in `src/index.css` via Tailwind `@theme`:

- **Background:** pure black (`#000`)
- **Primary:** Sparkeefy pink (`#ff4d91`)
- **Cards:** dark grey (`#1a1a1a`)
- **Typography:** Inter body · Plus Jakarta Sans headings · Instrument Serif accent
- **Spacing:** 8px grid (padding multiples of 4/8/16/24/32)
- **Radius:** 8px small · 16px medium · 24px large · pill for nav items

## Tradeoffs

| Choice | Rationale |
|--------|-----------|
| SPA over SSR | Backend is API-only; no SEO requirement for dashboard |
| localStorage auth | Matches backend `x-user-id` fake auth; zero backend session state |
| TanStack Query over Redux | Server state is 90% of app state; simpler mental model |
| Component co-location | Pages own their layout; shared UI in `components/ui` |
| Vite over Next.js | Faster dev loop; no need for App Router or server components |

## Production mapping

| Current | Production upgrade |
|---------|-------------------|
| `localStorage` user ID | JWT in httpOnly cookie or Authorization header |
| Build-time `VITE_API_URL` | Environment-specific Vercel preview/production vars |
| Manual QA | Playwright E2E against staging API |
| Client-side routing | Same — or migrate to SSR if SEO needed later |

## What I Would Improve With More Time

1. **Error boundary per route** — graceful failure instead of blank screen
2. **Query key factory** — typed, centralized cache invalidation
3. **Shared form schemas** — import Zod schemas from backend package (monorepo)
4. **Accessibility audit** — keyboard nav, ARIA labels on mobile drawer
5. **Code splitting** — lazy-load heavy pages (Wingman run detail) for faster initial load
