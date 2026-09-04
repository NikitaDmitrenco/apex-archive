# PROJECT STATE

> Оперативная память проекта Apex Archive между Claude-сессиями. Читать вместе с
> `MASTERPROMPT.md` и `README.md` в начале каждой новой сессии (см. раздел 0 мастер-промпта).
> Не доверять этому файлу слепо — при расхождении с фактическим кодом доверять коду и
> исправлять этот файл.

Last updated: 2026-09-04 (Milestone 0 completed)

---

## Current milestone

Milestone 0 — Project Audit & Architecture (завершён, ожидает подтверждения пользователя)

## Overall progress

~4% (архитектура зафиксирована, код приложения не написан)

## Completed

- Milestone 0 — Project Audit & Architecture:
  - Проверено фактическое состояние репозитория: пустая директория, git не инициализирован,
    из файлов присутствуют только `MASTERPROMPT.md` и `PROJECT_STATE.md`.
  - Зафиксированы точные версии стека (см. "Technical decisions").
  - Финализирована схема БД (см. "Database status").
  - Финализированы роуты, файловая структура, env-переменные, design tokens (см. ниже).

## In progress

- none

## Not completed

- Milestones 1–14

## Technical decisions

Версии проверены через `npm view <pkg> versions/dist-tags --json` 2026-09-04. Все —
последние **стабильные** (не canary/beta/rc) на этот момент.

| Пакет | Версия | Примечание |
|---|---|---|
| next | **16.3.4** | Стабильный Next.js 16 уже доступен в registry (не canary) → используем его согласно правилу раздела 2 MASTERPROMPT (переопределяет упоминание "15.x" как дефолт). Требует `react`/`react-dom` `^19.0.0`, Node `>=20.9.0`. |
| react / react-dom | **19.2.8** | `react-dom@19.2.8` жёстко требует `react@^19.2.8` — версии должны совпадать. |
| typescript | **7.0.2** | Актуальный `latest` в registry на дату проверки. На Milestone 1, при инициализации проекта, перепроверить совместимость с `create-next-app`/`shadcn` CLI — если возникнут конфликты, зафиксировать как "Failed approaches" и откатиться на последнюю TS 5.x LTS-ветку. |
| tailwindcss | **4.3.3** | Tailwind 4 стабилен, конфликтов с shadcn CLI на момент проверки не выявлено (перепроверить практически на Milestone 1). |
| shadcn (CLI) | **4.20.1** | Пакет называется `shadcn` (не `shadcn-ui`, тот deprecated). |
| drizzle-orm | **0.45.2** | v1 существует только в `beta`/`rc` dist-tags, не `latest` → используем стабильную 0.x ветку. |
| drizzle-kit | **0.31.10** | |
| @supabase/supabase-js | **2.115.0** | |
| Node.js | v24.14.0 (локально) | Соответствует требованию Next.js 16 (`>=20.9.0`). |

Framer Motion, GSAP, Recharts, Zod, next-themes — конкретные версии зафиксировать на
Milestone 1 при фактической установке (`npm install <pkg>@latest` и записать резолвнутую
версию сюда).

## Architecture decisions

### Dark mode — основной режим
Digital museum / cinematic направление лучше всего читается в dark mode. Решение: **dark —
основная (default) тема, light — полноценно поддерживаемая, но вторичная**. Переключатель
темы обязателен (Milestone 1, `next-themes`). Это решение можно пересмотреть по фидбеку
пользователя после Milestone 1 (визуальная проверка).

### Design tokens

**Цветовая палитра (dark, primary):**
| Токен | Значение | Назначение |
|---|---|---|
| `--background` | `#0A0A0C` | базовый фон, не чистый чёрный (глубина) |
| `--surface` | `#131316` | карточки, панели |
| `--foreground` | `#F4F3EF` | основной текст, тёплый off-white (editorial, не стерильный) |
| `--muted-foreground` | `#8A8A90` | вторичный текст, подписи |
| `--border` | `#232327` | тонкие разделители (в духе "тонкие линии" из брифа) |
| `--accent` | `#C9A227` | приглушённое золото/латунь — ассоциация с трофеями/архивом, НЕ типичный F1-красный |
| `--accent-foreground` | `#0A0A0C` | текст поверх accent |
| `--destructive` | `#B3402A` | только для ошибок/предупреждений, не декоративно |

**Light (paritetный):**
| Токен | Значение |
|---|---|
| `--background` | `#FAFAF8` |
| `--surface` | `#FFFFFF` |
| `--foreground` | `#111113` |
| `--muted-foreground` | `#6B6B70` |
| `--border` | `#E4E3DE` |
| `--accent` | `#9C7A1C` (затемнён для контраста на светлом фоне) |

Явно избегаем: glossy racing red как основной accent, neon-оттенки, glassmorphism-подложки.

**Типографика:**
- **Display/editorial headline** (крупные statement-заголовки, "THE FASTEST SPORT..."):
  serif — **Fraunces** (Google Fonts, вариативный, премиальный editorial-характер).
- **UI/body sans** (навигация, текст, карточки): **Inter** (variable font, высокая
  читаемость на всех размерах).
- **Technical/spec mono** (технические характеристики в стиле спецификации —
  "V10 · 3.0L · ~900 HP", лаптаймы, годы): **IBM Plex Mono**.
Все три — свободные (Google Fonts / open source), подключаются через `next/font`.

**Типографическая шкала** (модульная, база 16px, коэффициент ~1.25, с расширением вверх
для hero-заголовков):
`12 / 14 / 16 / 18 / 20 / 25 / 32 / 40 / 56 / 80 / 112` px (последние два — только для
landing hero на десктопе, с адаптивным уменьшением через `clamp()`).

**Spacing:** базовая шкала Tailwind (4px unit) без изменений + расширенные editorial-токены
для вертикальных отступов секций: `section-y-sm: 64px`, `section-y-md: 96px`,
`section-y-lg: 160px` (десктоп; на мобильных секции масштабируются вниз, финальные значения
подбираются визуально на Milestone 1/3).

### Файловая структура — зафиксирована как в разделе 7.4 MASTERPROMPT, с уточнениями:
```
apex-archive/
  app/
    (marketing)/
      page.tsx                # landing (M3)
      about/page.tsx
    cars/page.tsx  [slug]/page.tsx
    drivers/page.tsx  [slug]/page.tsx
    teams/page.tsx  [slug]/page.tsx
    circuits/page.tsx  [slug]/page.tsx
    seasons/page.tsx  [year]/page.tsx
    search/page.tsx
    layout.tsx / loading.tsx / error.tsx / not-found.tsx  (root + по роут-группам)
  components/
    ui/            # shadcn primitives
    archive/        # CarCard, DriverHero, TeamTimeline, CircuitLayout, StatBlock...
    layout/         # Nav, MobileMenu, Footer
  lib/
    db/
      schema.ts
      queries/       # cars.ts, drivers.ts, teams.ts, circuits.ts, seasons.ts, search.ts
      migrations/
      seed/          # seed.ts + DATA_SOURCES.md
    validation/       # zod schemas (query params, filters)
    env.ts             # проверка обязательных env-переменных при старте
    constants/         # nav items, design tokens as TS consts
    utils/
  types/                # DTO-типы, выведенные из zod/drizzle
  drizzle.config.ts
  .env.example
  .gitignore
  MASTERPROMPT.md
  PROJECT_STATE.md
  README.md
```
Отличие от исходного черновика раздела 7.4: `about` вложен в `(marketing)` route group
вместе с landing (общий layout секции "маркетинговых" страниц); `api/` route handlers не
заведены заранее — создаются по факту необходимости (например, если понадобится endpoint
вне Server Actions), решение по необходимости на соответствующем milestone.

### Роуты (MVP) — подтверждены без изменений от раздела 7.5:
`/`, `/about`, `/cars`, `/cars/[slug]`, `/drivers`, `/drivers/[slug]`, `/teams`,
`/teams/[slug]`, `/circuits`, `/circuits/[slug]`, `/seasons`, `/seasons/[year]`, `/search`.

## Database status

Схема спроектирована (3NF, явные junction-таблицы), **не применена** — применение на
Milestone 2. Все "статистические" поля (wins/poles/podiums/points и т.п.) **не
дублируются** в отдельных `*_stats` таблицах — вычисляются агрегирующими запросами в data
access layer поверх `results`/`races`/`driver_standings`/`constructor_standings`. Причина:
избежать рассинхронизации денормализованных данных при MVP-масштабе (десятки-сотни строк),
это соответствует принципу "не создавать лишнюю инфраструктуру без необходимости"
(MASTERPROMPT, раздел 14).

Во всех сущностных таблицах — колонка `data_confidence` (`enum: 'verified' | 'placeholder' |
'uncertain'`) для фиксации достоверности данных (раздел 6 MASTERPROMPT), плюс
`created_at`/`updated_at` (timestamps).

### Таблицы

**drivers**
`id (uuid pk)`, `slug (unique)`, `full_name`, `nationality`, `date_of_birth`,
`date_of_death (nullable)`, `career_start_year`, `career_end_year (nullable = active)`,
`photo_url (nullable)`, `bio (text, nullable)`, `data_confidence`, `created_at`, `updated_at`.

**teams**
`id (uuid pk)`, `slug (unique)`, `name`, `nationality`, `founded_year`,
`dissolved_year (nullable)`, `logo_url (nullable)`, `base_location (nullable)`,
`bio (text, nullable)`, `data_confidence`, `created_at`, `updated_at`.

**seasons**
`id (uuid pk)`, `year (int, unique)`, `world_champion_driver_id (fk drivers, nullable)`,
`constructors_champion_team_id (fk teams, nullable)`, `summary (text, nullable)`,
`data_confidence`, `created_at`, `updated_at`.

**circuits**
`id (uuid pk)`, `slug (unique)`, `name`, `country`, `location (nullable)`,
`length_km (numeric)`, `turns (int)`, `laps_standard (int, nullable)`,
`lap_record_time (nullable)`, `lap_record_holder_driver_id (fk drivers, nullable)`,
`lap_record_year (int, nullable)`, `first_gp_year (int, nullable)`,
`layout_image_url (nullable)`, `data_confidence`, `created_at`, `updated_at`.

**cars**
`id (uuid pk)`, `slug (unique)`, `name`, `team_id (fk teams)`, `season_id (fk seasons)`,
`chassis_name (nullable)`, `engine_manufacturer (nullable)`, `engine_config (nullable, e.g. "V10")`,
`capacity_liters (numeric, nullable)`, `power_hp (int, nullable, ~приблизительно)`,
`weight_kg (int, nullable)`, `image_url (nullable)`,
`technical_breakdown (jsonb, nullable — {front_wing, suspension, engine, rear_wing, tyres, chassis})`,
`data_confidence`, `created_at`, `updated_at`.

**races**
`id (uuid pk)`, `season_id (fk seasons)`, `circuit_id (fk circuits)`, `round_number (int)`,
`name`, `date (date)`, `laps (int)`, `distance_km (numeric, nullable)`,
`pole_position_driver_id (fk drivers, nullable)`, `fastest_lap_driver_id (fk drivers, nullable)`,
`winner_driver_id (fk drivers, nullable)`, `winner_team_id (fk teams, nullable)`,
`data_confidence`, `created_at`, `updated_at`.

**results**
`id (uuid pk)`, `race_id (fk races)`, `driver_id (fk drivers)`, `team_id (fk teams)`,
`car_id (fk cars, nullable)`, `grid_position (int, nullable)`, `finish_position (int, nullable = DNF)`,
`status (enum: finished | dnf | dsq | dns)`, `points (numeric)`, `data_confidence`.
Unique constraint: `(race_id, driver_id)`.

**driver_standings** *(замена расплывчатой "championships" из раздела 7.3 —
см. обоснование выше)*
`id (uuid pk)`, `season_id (fk seasons)`, `driver_id (fk drivers)`, `team_id (fk teams)`,
`position (int)`, `points (numeric)`, `wins (int)`, `podiums (int)`.
Unique: `(season_id, driver_id)`.

**constructor_standings**
`id (uuid pk)`, `season_id (fk seasons)`, `team_id (fk teams)`, `position (int)`,
`points (numeric)`, `wins (int)`.
Unique: `(season_id, team_id)`.

**driver_team_seasons** *(junction: раздел 7.3, "при необходимости" — нужна с Milestone 5)*
`id (uuid pk)`, `driver_id (fk drivers)`, `team_id (fk teams)`, `season_id (fk seasons)`,
`car_id (fk cars, nullable)`. Индекс по `(driver_id, season_id)`.

**articles** *(схема — сейчас; UI — только Milestone 14, "Stories")*
`id (uuid pk)`, `slug (unique)`, `title`, `subtitle (nullable)`, `body (text, markdown)`,
`cover_image_url (nullable)`, `tags (text[], nullable)`, `published_at (timestamp, nullable)`,
`created_at`, `updated_at`. Без `data_confidence` — редакционный контент, не статистика.

### Full-Text Search (подготовка, раздел 7.9)
На `drivers.full_name`, `teams.name`, `cars.name`, `circuits.name`, `seasons.summary` —
`tsvector`-генерируемые колонки (`generated always as`) + GIN-индексы. Точные weight-настройки
(`setweight`, приоритет полей) фиксируются на Milestone 2 при реализации.

### Отложено намеренно (не создавать сейчас)
`users`, `favorites` — только Milestone 14 (User accounts/Favorites), до этого не нужны.
`car_stats` / `driver_stats` / `team_stats` / `circuit_stats` — не создаются вообще при
текущем масштабе данных (см. обоснование выше); пересмотреть, если объём данных вырастет
настолько, что агрегирующие запросы станут узким местом производительности (маловероятно
для MVP с десятками-сотнями строк).

## Routes implemented

- none (только зафиксированы в плане, раздел "Architecture decisions" выше)

## Components implemented

- none

## Data implemented

- none. Реальные данные F1 не загружены. Правило "не выдумывать статистику" — см.
  MASTERPROMPT.md раздел 6. На Milestone 2 — курируемый seed-набор (15–30 cars, 15–30
  drivers, 8–10 teams, 10–15 circuits, несколько seasons) с обязательной пометкой
  `data_confidence` и источника в `DATA_SOURCES.md`.

## Known bugs

- none

## Failed approaches

- none

## Why they failed

- n/a

## Environment / configuration

- Репозиторий: пустая директория, **git не инициализирован** (`git init` — Milestone 1).
- Node.js: v24.14.0, npm: 11.18.0, git: 2.53.0 доступны локально (Windows 11).
- Supabase project URL: https://supabase.com/dashboard/project/graglvzassyzsyedraex
- Vercel account: vercel.com/nikita-7472
- GitHub owner: NikitaDmitrenco
- `.env.example` — ещё не создан физически; список переменных зафиксирован (создать файл на
  Milestone 1):
  ```
  DATABASE_URL=
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_ANON_KEY=
  SUPABASE_SERVICE_ROLE_KEY=
  NEXT_PUBLIC_SITE_URL=
  OPENAI_API_KEY=
  ```
  (`OPENAI_API_KEY` понадобится только на Milestone 14, но заводим переменную в
  `.env.example` заранее, значение не требуется до тех пор.)

## Deployment status

- Не задеплоено. Vercel-проект не подключён.

## Git status

- Репозиторий не инициализирован (`git init` предстоит на Milestone 1).

## Next milestone

Milestone 1 — Project Foundation:
- `create-next-app` (Next.js 16.3.4, TS, Tailwind, App Router), проверить фактически
  разрешившиеся версии зависимостей и записать их сюда.
- `git init` + `.gitignore` + первый коммит.
- shadcn/ui init, базовые UI-примитивы под design tokens, зафиксированные выше.
- Root layout, next-themes (dark по умолчанию), шрифты (Fraunces/Inter/IBM Plex Mono через
  `next/font`).
- Навигация (desktop + fullscreen mobile menu), footer.
- Пустые placeholder-страницы для всех MVP-роутов.
- ESLint/Prettier, `tsc --noEmit`, `next build` — все должны проходить.

## Important notes for the next Claude session

- Milestone 0 завершён: архитектура, схема БД (не применена), файловая структура, роуты,
  design tokens, env-переменные — задокументированы выше. Кода приложения ещё нет,
  `package.json` не создан, git не инициализирован.
- **Next.js 16.3.4** — не 15.x, как было в исходном черновике брифа. Причина — правило
  раздела 2 MASTERPROMPT: если на момент работы в registry уже стабильный (не canary) Next 16,
  использовать его. Если к моменту Milestone 1 это изменится (Next 16 окажется нестабильным
  на практике при `create-next-app`) — зафиксировать проблему в "Failed approaches" и
  откатиться на последнюю 15.x с объяснением.
- TypeScript 7.0.2 зафиксирован по dist-tag `latest`, но не проверен практически с
  `create-next-app`/shadcn CLI — первая реальная проверка будет на Milestone 1.
- "championships" из раздела 7.3 MASTERPROMPT сознательно реализована как две таблицы —
  `driver_standings` + `constructor_standings` — вместо одной полиморфной. Это соответствует
  требованию нормализации (раздел 7.3: "явные junction-таблицы для many-to-many"), полиморфный
  FK внутри одной таблицы этому противоречил бы.
- Ждать команду пользователя (`продолжать` или явное указание) перед стартом Milestone 1.
