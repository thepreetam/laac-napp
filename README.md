# LAAC Pipeline — New Attorney Pipeline Project

A web platform connecting California law students and recent graduates to legal aid organizations that hire, supervise, and mentor before bar admission.

## Overview

LAAC Pipeline is a project of the Legal Aid Association of California (LAAC), funded through a Legal Aid Infrastructure & Innovation grant from the California Access to Justice Commission. The platform demystifies the process of finding entry-level jobs in legal aid, curates available resources for recent law school graduates, and hosts a matching portal to connect law students with legal services organizations for summer work and fellowships.

### Key Features

#### For Students
- **Multi-step onboarding** — guided profile builder capturing practice interests, languages, counties, bar status, car access, transit needs, and scheduling preferences
- **Deterministic matching engine** — scores and ranks every open role using five weighted factors:
  - Skills/interests overlap (30%)
  - Practice area match (25%)
  - Language overlap (20%)
  - Geography/county match (15%)
  - Timing/accessibility (10%)
- **Match explanations** — plain-language reasons for every match with weak-spot callouts (location, practice area, language)
- **Match filtering** — filter by practice area, pre-bar hire status, hybrid options; sort by fit, proximity, or start date
- **Student dashboard** — top matches, profile completeness tracker, saved roles

#### For Employers
- **Employer directory** — searchable, filterable listing of legal aid organizations across five California regions (Bay Area, Central Valley, Los Angeles, Rural North, Inland Empire/Imperial)
- **Employer onboarding** — three-step wizard to post organization profile and first role
- **Employer dashboard** — candidate matches ranked by fit with invite-to-interview actions
- **Role management** — post and manage open positions with practice area, county, and pre-bar hire details

#### For Career Services
- **Partner school portal** — partnership information, current partner schools list, and FAQ for career services teams
- **Outcomes reporting** — aggregated placement data for accreditation and advising

#### Platform Features
- **California interactive map** — choropleth map showing employers by region with click-to-filter
- **Fellowship timeline** — visual timeline of the fellowship application cycle
- **Pathway cards** — four career pathways (fellowships, pre-bar hire, internship, rural placement)
- **Accessibility controls** — text-size scaling (base/lg/xl), underline-links toggle, reduce-motion toggle
- **Staff review mode** — annotation layer for internal review, brand-alternative color toggle (sea/gold)
- **Authentication** — email/password login and registration with HTTP-only cookie sessions
- **Responsive design** — mobile-first with desktop enhancements at 1024px+ breakpoints

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript (components/pages), JavaScript (API routes/store) |
| **Styling** | Tailwind CSS v4 with custom design tokens |
| **UI Components** | shadcn/ui (Base UI primitives) |
| **Icons** | Lucide React |
| **Maps** | react-simple-maps with d3-geo |
| **Store** | MACHAAO API (pluggable via `STORE_BACKEND` env var) |
| **HTTP Client** | Axios (server-side), Fetch API (client-side) |
| **Package Manager** | pnpm |
| **Deployment** | MACHAAO Platform Cloud |

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

# Edit .env.local with your MACHAAO credentials
# (For local development without MACHAAO, the app uses seed data)

# Start dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo Accounts

The application seeds three demo accounts on first startup. Use these to explore different personas:

| Role | Email | Password | Entry Point |
|---|---|---|---|
| **Student** | `demo@lawschool.edu` | `demo123` | `/app` (student dashboard) |
| **Employer** | `hr@baylegal.org` | `demo123` | `/employers/dashboard` |
| **Admin** | `admin@laac.org` | `demo123` | `/admin` (admin dashboard) |

**Demo student profile (Maya R.):**
- UC Law SF, graduating 2026
- Bar status: studying
- Practice interests: Housing, Domestic violence
- Languages: Spanish
- Target counties: Alameda, San Francisco, San Joaquin
- Needs transit, no car, evenings OK, hybrid OK

The seed runs automatically via `start-app.sh` on deploy, or manually via:

```bash
curl -X POST http://localhost:3000/api/seed
```

Seeding is idempotent — running it again after the initial seed is a no-op.

### Environment Variables

See `.env.template` for all required and optional variables:

| Variable | Description | Default |
|---|---|---|
| `MACHAAO_API_TOKEN` | App API token (auto-injected on deploy) | — |
| `MACHAAO_APP_ID` | MACHAAO app ID (auto-injected on deploy) | — |
| `MACHAAO_DEVELOPER_TOKEN` | Developer token (auto-injected on deploy) | — |
| `MACHAAO_API_BASE_URL` | API base URL | `https://api.machaao.com` |
| `MACHAAO_API_VERSION` | API version | `v2` |
| `STORE_BACKEND` | Store implementation selector | `machaao` |
| `SESSION_SECRET` | Session signing secret | `laac-pipeline-dev-secret` |
| `PORT` | Server port | `3000` |
| `OPENROUTER_API_KEY` | OpenRouter API key for AI features (optional) | — |

### Deployment

```bash
# Deploy to MACHAAO Platform
/deploy
```

The platform handles containerization automatically. The `start-app.sh` script builds and starts the Next.js server.

## Architecture

### Directory Structure

```
app/
  api/
    auth/           # Authentication endpoints (login, register, logout, me)
    employers/      # Employer data endpoint
    health/         # Health check endpoint
    matches/        # Match computation endpoint
    profile/        # User profile CRUD endpoint
    roles/          # Role management endpoint
  app/              # Authenticated student area
    matches/        # Match results page
  employers/        # Employer pages
    [id]/           # Individual employer detail
    dashboard/      # Employer dashboard
  fellowships/      # Fellowship/pathways information
  for-schools/      # Career services portal
  how-matching-works/ # Matching explanation page
  login/            # Login page
  onboarding/
    student/        # Student onboarding wizard
    employer/       # Employer onboarding wizard
  signup/           # Registration page
  about/            # About LAAC page

components/
  ui/               # shadcn/ui base components (button, card, input, etc.)
  auth-form.tsx     # Login/signup form with persona selection
  ca-map.tsx        # Interactive California county map
  california-map-section.tsx # Map section with region info
  candidate-card.tsx # Employer view of matched candidate
  dashboard-top-matches.tsx # Dashboard match preview
  employer-card.tsx # Employer directory card
  employer-onboarding.tsx # Employer onboarding wizard
  hero-match-preview.tsx # Homepage match animation
  match-card.tsx    # Student match result card
  match-drawer.tsx  # Match explanation side panel
  matching-app.tsx  # Full matching interface with filters
  pathway-card.tsx  # Career pathway card
  profile-completeness.tsx # Circular progress indicator
  prototype-banner.tsx # Development notice banner
  site-footer.tsx   # Site footer with navigation
  site-header.tsx   # Sticky header with mobile menu
  staff-mode.tsx    # Staff review mode with annotations
  student-onboarding.tsx # Student onboarding wizard
  timeline-rail.tsx # Fellowship timeline visualization
  trust-strip.tsx   # LAAC disclaimer component

config/
  index.js          # Config module entry point
  settings.js       # Centralized settings from environment variables

lib/
  api-client.js     # Client-side fetch helpers (GET, POST, PUT)
  auth-context.tsx  # React context for authentication state
  ca-counties.ts    # California county FIPS codes and region mapping
  data.ts           # Seed data (employers, roles, regions, matches, schools)
  types.ts          # TypeScript type definitions
  utils.ts          # Utility functions (cn for className merging)
  server/
    matcher.js      # Deterministic matching engine with weighted scoring
    session.js      # Session cookie management

store/
  base.js           # Abstract store interface (StoreInterface)
  index.js          # Store factory (reads STORE_BACKEND env var)
  machaao-store.js  # MACHAAO API implementation

public/
  images/           # Static images
  *.png, *.svg      # Icons and logos
```

### Store Abstraction Layer

The application uses a pluggable store abstraction layer:

```
Routes → Services → Store Interface → Store Implementation
```

- **Store Interface** (`store/base.js`) — defines the data access contract
- **MACHAAO Store** (`store/machaao-store.js`) — default implementation using MACHAAO API
- **Store Factory** (`store/index.js`) — selects implementation via `STORE_BACKEND` env var

To swap backends, implement the `StoreInterface` class and set `STORE_BACKEND=<new_backend>`.

### Matching Engine

The matching engine (`lib/server/matcher.js`) computes compatibility scores using five weighted factors:

1. **Skills/Interests (30%)** — overlap between student's practice interests and role's practice area
2. **Practice Area (25%)** — direct match on primary practice area
3. **Language (20%)** — overlap between student's languages and office languages
4. **Geography (15%)** — whether the role's county is in the student's target counties
5. **Timing (10%)** — hybrid availability, pre-bar hire status, transit access

Each match includes:
- Numerical score (0-100)
- Plain-language reasons explaining the match
- Weak-spot callout (location, practice area, or language tradeoff)
- Language overlap details

### Authentication Flow

1. User registers/logs in via `/api/auth/register` or `/api/auth/login`
2. Server calls MACHAAO API to authenticate and receive a token
3. Token and user info stored in HTTP-only cookies (`laac-auth-token`, `laac-user-id`, etc.)
4. Client-side `AuthContext` fetches `/api/auth/me` on mount to restore session
5. Protected routes check session via `getSessionFromRequest()` in API routes

### Data Storage

All persistent data is stored via the MACHAAO API:

| Data Type | Storage Method | Key Pattern |
|---|---|---|
| User profile | app-data (O(1)) | `user-{email-slug}-profile` |
| User preferences | app-data (O(1)) | `user-{email-slug}-preferences` |
| Custom roles | app-data (O(1)) | `pipeline-roles-registry` |
| User registry | app-data (O(1)) | `pipeline-user-registry` |

## Pages

| Route | Description | Auth Required |
|---|---|---|
| `/` | Homepage with hero, pathways, map, matching explanation | No |
| `/login` | Login form with student/employer persona | No |
| `/signup` | Registration form | No |
| `/onboarding/student` | Multi-step student profile builder | No |
| `/onboarding/employer` | Multi-step employer setup wizard | No |
| `/app` | Student dashboard with top matches | Yes |
| `/app/matches` | Full match results with filters and sorting | Yes |
| `/employers` | Searchable employer directory | No |
| `/employers/[id]` | Individual employer detail page | No |
| `/employers/dashboard` | Employer view of candidate matches | Yes |
| `/fellowships` | Fellowship pathways and timeline | No |
| `/how-matching-works` | Matching algorithm explanation | No |
| `/for-schools` | Career services partnership portal | No |
| `/about` | About LAAC | No |

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Authenticate user |
| POST | `/api/auth/logout` | Clear session cookies |
| GET | `/api/auth/me` | Get current user from session |
| GET | `/api/profile` | Get user profile and preferences |
| PUT | `/api/profile` | Update user preferences |
| GET | `/api/matches` | Compute matches for current user |
| GET | `/api/roles` | List roles (custom + seed) |
| POST | `/api/roles` | Create new role |
| GET | `/api/employers` | List all employers |

## Design System

The application uses a custom design system built on Tailwind CSS v4:

- **Typography**: Fraunces (display), Source Sans 3 (body), IBM Plex Mono (code)
- **Color palette**: Paper/ink system with sea, gold, clay, sage accents
- **Shadows**: Paper-style shadows (subtle, low, never glowing)
- **Border radius**: Small and deliberate (2px-28px scale)
- **Dark mode**: Full dark mode support via CSS custom properties
- **Brand alternatives**: Staff mode can toggle between "cool sea" and "warm gold" accent schemes

## Accessibility

- Text size scaling (base, large, extra-large)
- Underline links toggle
- Reduce motion toggle (respects `prefers-reduced-motion`)
- Full keyboard navigation with visible focus states
- ARIA labels on all interactive elements
- Skip-to-content link
- Screen reader announcements for dynamic content

## License

Prototype — not for production use. Content is illustrative.
