# Christchurch Bitcoin Meetup Website

## Overview

A website for the Christchurch Bitcoin Meetup group. Built as a pnpm workspace monorepo using TypeScript with React + Vite frontend and Express 5 backend.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + TailwindCSS + Framer Motion
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle for server), Vite (frontend)

## Features

- **Upcoming Meetups**: Auto-generated dates for the first Wednesday of each month (next 6). Shows RSVP counts.
- **RSVP System**: Name/nym-based RSVP with unique constraint per name+meetup date. Prevents duplicate RSVPs (409 response). RSVPs stored in PostgreSQL database.
- **Education page** (`/education`): Curated links organized by category (getting-started, education, wallets, news).
- **Tools page** (`/tools`): Bitcoin tools (explorers, dashboards, protocols).
- **Design**: Clean dark aesthetic inspired by Cyphermunk House — black background, warm orange/amber Bitcoin accent color, Inter sans-serif font, rounded cards with subtle borders, no neon effects.

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server
│   └── web/                # React + Vite frontend (Christchurch Bitcoin Meetup)
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## API Endpoints

All under `/api`:

- `GET /api/healthz` — Health check
- `GET /api/meetups` — List next 6 upcoming meetups (first Wednesday of each month) with RSVP counts
- `POST /api/rsvps` — Create RSVP (body: `{ name, meetupDate }`, returns 201 or 409 for duplicates)
- `GET /api/rsvps/counts` — Get RSVP counts per meetup date
- `GET /api/resources` — List curated Bitcoin resources (static data)
- `GET /api/merchants` — List local merchants accepting Bitcoin (static data)

## Database Schema

- **rsvps** table: `id`, `name`, `meetup_date`, `created_at` with unique constraint on `(name, meetup_date)`

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck`
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/web` (`@workspace/web`)

React + Vite app with client-side routing (wouter). Clean dark design with orange Bitcoin accents (Cyphermunk House-inspired). Pages: Home (Hero + Upcoming Meetups with RSVP modal), Education (curated resources by category), Tools (Bitcoin tools). Uses generated React Query hooks from `@workspace/api-client-react`.

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/`:
- `health.ts` — GET /healthz
- `meetups.ts` — GET /meetups (auto-generates first-Wednesday dates, queries RSVP counts from DB)
- `rsvps.ts` — POST /rsvps, GET /rsvps/counts (uses DB for persistence)
- `resources.ts` — GET /resources (static data)
- `merchants.ts` — GET /merchants (static data)

### `lib/db` (`@workspace/db`)

Database layer. Schema: `src/schema/rsvps.ts` defines the rsvps table. Push with `pnpm --filter @workspace/db run push`.

### `lib/api-spec` (`@workspace/api-spec`)

OpenAPI 3.1 spec and Orval codegen config. Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` / `lib/api-client-react`

Generated Zod schemas and React Query hooks from the OpenAPI spec.
