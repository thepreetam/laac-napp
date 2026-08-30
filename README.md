# LAAC Pipeline — New Attorney Pipeline Project

A web platform connecting California law students and recent graduates to legal aid organizations that hire, supervise, and mentor before bar admission.

## Overview

LAAC Pipeline is a project of the Legal Aid Association of California (LAAC), funded through a Legal Aid Infrastructure & Innovation grant from the California Access to Justice Commission.

### Features

- **Student onboarding** — multi-step profile builder capturing practice interests, languages, counties, bar status, and scheduling preferences
- **Employer directory** — searchable, filterable listing of legal aid organizations across five California regions
- **Deterministic matching engine** — scores and ranks every open role against a student's profile using five weighted factors (skills 30%, interests 25%, language 20%, geography 15%, timing 10%)
- **Match explanations** — plain-language reasons for every match, with weak-spot callouts
- **Employer dashboards** — candidate matches ranked by fit for each employer
- **Career services portal** — partnership information and outcomes reporting for law school career offices
- **Accessibility** — text-size scaling, underline-links toggle, reduce-motion toggle, full keyboard navigation
- **Staff review mode** — annotation layer and brand-alternative toggle for internal review

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with custom design tokens
- **UI Components**: shadcn/ui (Base UI primitives)
- **Store**: MACHAAO API (pluggable via `STORE_BACKEND` env var)
- **Deployment**: MACHAAO Platform Cloud

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm

### Local Development

```bash
# Install dependencies
pnpm install

# Copy environment template
cp .env.template .env.local

# Start dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

See `.env.template` for all required and optional variables. Key variables:

| Variable | Description |
|---|---|
| `MACHAAO_API_TOKEN` | App API token (auto-injected on deploy) |
| `MACHAAO_APP_ID` | MACHAAO app ID (auto-injected on deploy) |
| `MACHAAO_DEVELOPER_TOKEN` | Developer token (auto-injected on deploy) |
| `MACHAAO_API_BASE_URL` | API base URL (default: `https://api.machaao.com`) |
| `MACHAAO_API_VERSION` | API version (default: `v2`) |
| `STORE_BACKEND` | Store implementation selector (default: `machaao`) |
| `SESSION_SECRET` | Session signing secret |
| `PORT` | Server port (default: `3000`) |

### Deployment

```bash
# Deploy to MACHAAO Platform
/deploy
```

The platform handles containerization automatically. The `start-app.sh` script builds and starts the Next.js server.

## Architecture

```
app/
  api/              # API routes (auth, profile, matches, roles, health)
  (pages)/          # Page routes
components/         # React components (UI, features)
config/             # Centralized configuration
lib/
  server/           # Server-only utilities (matcher, session)
  api-client.js     # Client-side fetch helpers
  auth-context.tsx   # Client-side auth state
  data.ts           # Seed data (employers, roles, regions)
  types.ts          # TypeScript type definitions
store/
  base.js           # Store interface (abstract)
  machaao-store.js  # MACHAAO API implementation
  index.js          # Store factory
```

## License

Prototype — not for production use. Content is illustrative.
