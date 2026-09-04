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

No environment variables are required yet — the app has no database connection until
Milestone 2. Copy the template anyway so the file exists when it is needed.

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

`npm run typecheck` needs generated route types, so run `npm run build` (or start the dev
server) at least once after cloning.

## Environment variables

See [`.env.example`](.env.example) for the full list with descriptions. Real values belong
in `.env.local` locally and in Vercel Environment Variables in production — never in the
repository.

| Variable                        | Needed from  |
| ------------------------------- | ------------ |
| `DATABASE_URL`                  | Milestone 2  |
| `NEXT_PUBLIC_SUPABASE_URL`      | Milestone 2  |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Milestone 2  |
| `SUPABASE_SERVICE_ROLE_KEY`     | Milestone 2  |
| `NEXT_PUBLIC_SITE_URL`          | Milestone 11 |
| `OPENAI_API_KEY`                | Milestone 14 |

## Database migrations

Not yet applicable. Drizzle schema, migrations and the seed script arrive in Milestone 2;
this section will document `drizzle-kit generate` / `migrate` and the seed command then.

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

The project targets Vercel. Connecting the repository and entering production secrets is
done manually by the repository owner — see Milestone 13 in `MASTERPROMPT.md`.

## Project documents

- [`MASTERPROMPT.md`](MASTERPROMPT.md) — the specification: scope, stack, milestones and
  working rules. The source of truth.
- [`PROJECT_STATE.md`](PROJECT_STATE.md) — current state, decisions made, and what the next
  session needs to know.
