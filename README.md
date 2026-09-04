# Apex Archive

**The machines. The drivers. The circuits. The stories.**

A premium interactive digital archive of Formula 1 — cars, drivers, teams, circuits and
seasons, connected so you can navigate the sport's history entity by entity.

---

## Stack

| Layer      | Technology                                      |
| ---------- | ----------------------------------------------- |
| Framework  | Next.js 16 (App Router, Turbopack)              |
| UI runtime | React 19                                        |
| Language   | TypeScript (strict)                             |
| Styling    | Tailwind CSS 4 (CSS-first config)               |
| Components | shadcn/ui on Radix primitives                   |
| Theming    | next-themes (dark by default)                   |
| Database   | PostgreSQL via Supabase — _from Milestone 2_    |
| ORM        | Drizzle ORM — _from Milestone 2_                |
| Deployment | Vercel                                          |

## Requirements

- Node.js `>=20.9.0` (developed on v24)
- npm

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

The app runs at http://localhost:3000.

Fill in `DATABASE_URL` and `DIRECT_URL` before running anything that touches the database —
see [Database](#database) below. Pages that read no data build without them.

## Scripts

| Script                 | Purpose                                    |
| ---------------------- | ------------------------------------------ |
| `npm run dev`          | Development server                         |
| `npm run build`        | Production build                           |
| `npm run start`        | Serve the production build                 |
| `npm run lint`         | ESLint                                     |
| `npm run typecheck`    | `tsc --noEmit`                             |
| `npm run format`       | Format with Prettier                       |
| `npm run format:check` | Verify formatting without writing          |
| `npm run db:generate`  | Generate a migration from the schema       |
| `npm run db:migrate`   | Apply pending migrations                   |
| `npm run db:seed`      | Load the curated seed set (idempotent)     |
| `npm run db:verify`    | Smoke-test every data access layer query   |
| `npm run db:studio`    | Open Drizzle Studio against the database   |

`npm run typecheck` needs generated route types, so run `npm run build` (or start the dev
server) at least once after cloning.

## Environment variables

See [`.env.example`](.env.example) for the full list with descriptions. Real values belong
in `.env.local` locally and in Vercel Environment Variables in production — never in the
repository.

| Variable                        | Needed from  |
| ------------------------------- | ------------ |
| `DATABASE_URL`                  | Milestone 2  |
| `DIRECT_URL`                    | Milestone 2  |
| `NEXT_PUBLIC_SUPABASE_URL`      | Milestone 2  |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Milestone 2  |
| `SUPABASE_SERVICE_ROLE_KEY`     | Milestone 2  |
| `NEXT_PUBLIC_SITE_URL`          | Milestone 11 |
| `OPENAI_API_KEY`                | Milestone 14 |

## Database

Schema lives in [`lib/db/schema.ts`](lib/db/schema.ts). After changing it:

```bash
npm run db:generate
npm run db:migrate
```

To load the starter data and check the queries against it:

```bash
npm run db:seed
npm run db:verify
```

The seed is idempotent — it upserts by slug, so re-running refreshes rows rather than
duplicating them. Read [`lib/db/seed/DATA_SOURCES.md`](lib/db/seed/DATA_SOURCES.md) before
editing any of the data: unverified figures are deliberately left null, because null renders
as unknown while a wrong number renders as a fact.

**Connection strings.** Supabase's direct connection (`db.<ref>.supabase.co`) resolves over
IPv6 only. On an IPv4-only network it fails with `ENOTFOUND`, so `DIRECT_URL` should point at
the **session pooler** — same host as the transaction pooler, port 5432.

## Project structure

```
app/            routes (App Router)
  (marketing)/  landing and about
  cars/ drivers/ teams/ circuits/ seasons/ search/
components/
  ui/           shadcn primitives and shared design primitives
  archive/      domain components
  layout/       header, footer, mobile menu
lib/
  constants/    navigation and other static content
  utils.ts      cn() helper
```

## Deployment

The project targets Vercel.

### One-time setup (the user does this manually)

1. **Push to GitHub** — already done. Repo: https://github.com/NikitaDmitrenco/apex-archive.
2. **Connect to Vercel** — sign in to vercel.com/nikita-7472 and click "Add New Project". Import `NikitaDmitrenco/apex-archive`.
3. **Set environment variables** in Vercel → Project Settings → Environment Variables:
   - `DATABASE_URL` — Supabase session pooler, port **5432** (NOT 6543 — see "Failed approaches" #9 in `PROJECT_STATE.md`). Format: `postgres://postgres.[ref]:[password]@aws-1-eu-west-1.pooler.supabase.com:5432/postgres`.
   - `DIRECT_URL` — same session pooler (used by drizzle-kit for migrations and seed).
   - `NEXT_PUBLIC_SITE_URL` — your production URL (e.g. `https://apex-archive.vercel.app`).
   - Optional, when adding Supabase Storage (Milestone 14+):
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
   - Optional, when adding AI assistant (Milestone 14):
     - `OPENAI_API_KEY`
4. **First build** — Vercel builds automatically on push. The first build takes ~30 s.

### Production build locally

```bash
npm install
npm run build
npm run start
```

The production build will run `generateStaticParams` for every detail page, which requires the DATABASE_URL to be live. With the dummy `.env.local` already in place, `npm run build` will fail at the static-params step (it tries to query a non-existent DB). Run it on Vercel with real credentials.

### Smoke test after deployment

Visit each route once on the production URL:
- `/`
- `/cars`, `/drivers`, `/teams`, `/circuits`, `/seasons`
- Pick one slug from each and visit its detail page
- `/search?q=ferrari`
- `/compare?a=ferrari-f2004&b=mercedes-w12`
- `/eras`

All should render without errors.

### Region

`vercel.json` pins deployment to `fra1` because the Supabase project is in `aws-1-eu-west-1`. This minimises DB latency.

## Project documents

- [`MASTERPROMPT.md`](MASTERPROMPT.md) — the specification: scope, stack, milestones and
  working rules. The source of truth.
- [`PROJECT_STATE.md`](PROJECT_STATE.md) — current state, decisions made, and what the next
  session needs to know.
