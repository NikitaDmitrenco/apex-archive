# PROJECT STATE

> Оперативная память проекта Apex Archive между Claude-сессиями. Читать вместе с
> `MASTERPROMPT.md` и `README.md` в начале каждой новой сессии (см. раздел 0 мастер-промпта).
> Не доверять этому файлу слепо — при расхождении с фактическим кодом доверять коду и
> исправлять этот файл.

Last updated: 2026-09-04 (Milestone 1 completed)

---

## Current milestone

Milestone 1 — Project Foundation (завершён, ожидает подтверждения пользователя)

## Overall progress

~12% (архитектура + рабочий скелет приложения; данных и реальных страниц ещё нет)

## Completed

- **Milestone 0 — Project Audit & Architecture:** зафиксированы версии стека, схема БД,
  роуты, файловая структура, env-переменные, design tokens.
- **Milestone 1 — Project Foundation:** рабочее Next.js-приложение с дизайн-системой,
  навигацией, темами и заглушками всех MVP-роутов. Валидация (typecheck / lint / format /
  build / браузер) пройдена.

## In progress

- none

## Not completed

- Milestones 2–14

## Technical decisions

Фактически установленные версии (`npm ls --depth=0`, 2026-09-04):

| Пакет                       | Версия     | Примечание                                                                                                                                                                                                                                          |
| --------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| next                        | **16.3.4** | Стабильный Next 16 доступен в registry → используем его вместо 15.x (правило раздела 2 MASTERPROMPT). Turbopack — дефолтный бандлер.                                                                                                                |
| react / react-dom           | **19.2.8** | `react-dom` требует ровно `react@^19.2.8`.                                                                                                                                                                                                          |
| typescript                  | **5.9.3**  | **Корректировка решения Milestone 0.** Там было записано 7.0.2 по dist-tag `latest`. Официальный шаблон `create-next-app@16.3.4` пинит `typescript: "^5"` — это тестируемая с Next 16 ветка. Следуем шаблону: рабочий стек важнее номера версии. |
| tailwindcss                 | **4.3.3**  | CSS-first конфигурация (`@theme` в `app/globals.css`), файла `tailwind.config.ts` нет и он не нужен.                                                                                                                                                |
| shadcn (CLI)                | **4.20.1** | Ставится и как зависимость проекта — так устроен shadcn 4.                                                                                                                                                                                          |
| radix-ui                    | **1.6.7**  | Единый пакет, импорт через namespace: `import { Dialog } from "radix-ui"`.                                                                                                                                                                          |
| next-themes                 | **0.4.6**  |                                                                                                                                                                                                                                                     |
| lucide-react                | **1.40.0** | Иконки.                                                                                                                                                                                                                                             |
| class-variance-authority    | **0.7.1**  |                                                                                                                                                                                                                                                     |
| tailwind-merge              | **3.6.0**  |                                                                                                                                                                                                                                                     |
| tw-animate-css              | **1.4.0**  | Добавлен shadcn init.                                                                                                                                                                                                                               |
| eslint                      | **9.39.5** | npm выдаёт deprecation warning, но это версия, которую тянет `eslint-config-next@16.3.4`. Линт работает. Не трогать без причины.                                                                                                                    |
| eslint-config-prettier      | **10.1.8** | Импорт `eslint-config-prettier/flat`, последним в массиве конфигов.                                                                                                                                                                                 |
| prettier                    | **3.9.6**  |                                                                                                                                                                                                                                                     |
| prettier-plugin-tailwindcss | **0.8.1**  | Сортировка классов Tailwind.                                                                                                                                                                                                                        |
| Node.js                     | v24.14.0   | Требование Next 16 — `>=20.9.0`.                                                                                                                                                                                                                    |

Ещё не установлены (ставить на своих milestone'ах, не раньше): `drizzle-orm` / `drizzle-kit` /
`@supabase/supabase-js` / `zod` (Milestone 2), `framer-motion` / `gsap` (Milestone 11),
`recharts` (по необходимости). На Milestone 0 планировались drizzle-orm 0.45.2,
drizzle-kit 0.31.10, @supabase/supabase-js 2.115.0 — перепроверить актуальность при установке.

## Architecture decisions

### Темы

`next-themes`, `attribute="class"`, **`defaultTheme="dark"`, `enableSystem={false}`**.
Архив открывается тёмным всегда; light доступен переключателем. Системная тема сознательно
не учитывается — бинарный переключатель предсказуемее, а dark является брендовым режимом.
Пересмотреть, если пользователь захочет уважать `prefers-color-scheme`.

### Именование токенов — ВАЖНО, источник путаницы

В брифе «accent» = фирменное золото. В shadcn `--accent` — это приглушённая поверхность для
hover. Поэтому:

- **`--primary` = фирменное золото** (`#C9A227` dark / `#9C7A1C` light) — кнопки, ссылки,
  focus ring, акценты.
- **`--accent` = нейтральная hover-поверхность** (`#1C1C20` dark / `#F0EFEB` light).

Не «исправлять» это, поменяв местами — сломает все shadcn-компоненты.

### Design tokens (реализованы в `app/globals.css`)

Dark (основной): `--background #0A0A0C`, `--card/popover #131316`, `--foreground #F4F3EF`,
`--muted-foreground #8A8A90`, `--border/input #232327`, `--primary #C9A227`,
`--secondary/muted/accent #1C1C20`, `--destructive #B3402A`, `--ring #C9A227`.

Light: `--background #FAFAF8`, `--card/popover #FFFFFF`, `--foreground #111113`,
`--muted-foreground #6B6B70`, `--border/input #E4E3DE`, `--primary #9C7A1C`,
`--secondary/muted/accent #F0EFEB`, `--destructive #A33822`, `--ring #9C7A1C`.

`--radius: 0.125rem` — минимальное скругление (бриф запрещает «чрезмерное скругление углов»).

Шрифты через `next/font/google`: **Fraunces** (`--font-display`, editorial-заголовки),
**Inter** (`--font-sans`, UI/текст), **IBM Plex Mono** (`--font-mono`, технические подписи,
навигация, spec-строки).

Кастомные токены в `@theme`: размеры `--text-display-sm/md/lg`, `--text-hero` (все на
`clamp()`, поэтому hero не ломается на узких экранах); вертикальный ритм
`--spacing-section-sm/md/lg` (4rem / 6rem / 10rem) → утилиты `py-section-md` и т.п.

Кастомная утилита **`spec-label`** — мелкий mono uppercase с трекингом (технические подписи).
Названа именно так, не `text-spec`: см. "Failed approaches".

### Навигация — разрешённая неоднозначность брифа

Раздел 3 MASTERPROMPT показывает пункт «Archive» в меню, но в списке роутов (раздел 7.5)
маршрута `/archive` нет. Решение: **«Archive» — это заголовок группы, а не ссылка.**

- Desktop: пять сущностных ссылок (Cars/Drivers/Teams/Circuits/Seasons), разделитель,
  затем Search/About.
- Mobile (полноэкранное меню): над сущностными ссылками стоит подпись `ARCHIVE` — ровно та
  визуальная структура, что в брифе.

Если пользователь имел в виду отдельную страницу `/archive` — это надо будет добавить явно.

### Конвенции кода

- Имена файлов — kebab-case (`site-header.tsx`), имена компонентов — PascalCase.
- Импорт-алиас `@/*` от корня проекта. `src/` не используется.
- Динамические роуты: `params` — это Promise (Next 15/16). Типы страниц берутся из
  генерируемых глобалов: `PageProps<"/cars/[slug]">`, `LayoutProps<"/">`.
  **Эти типы генерируются при `next build`/`next dev`** — на чистом клоне
  `tsc --noEmit` упадёт с `Cannot find name 'PageProps'`, пока не выполнен билд. Это не баг.

### Файловая структура (фактическая)

```
app/
  (marketing)/page.tsx            # landing (заглушка до M3)
  (marketing)/about/page.tsx
  cars|drivers|teams|circuits/page.tsx + [slug]/page.tsx
  seasons/page.tsx + [year]/page.tsx
  search/page.tsx
  layout.tsx  loading.tsx  error.tsx  not-found.tsx
  globals.css
components/
  ui/          button.tsx (shadcn), container.tsx (Container+Section), typography.tsx (Display/Eyebrow/Lede)
  layout/      site-header.tsx, mobile-menu.tsx, site-footer.tsx, theme-toggle.tsx
  archive/     placeholder-page.tsx (временный, удалить по мере готовности страниц)
  theme-provider.tsx
lib/
  constants/navigation.ts
  utils.ts     # cn()
```

`lib/db/`, `lib/validation/`, `lib/env.ts`, `types/`, `drizzle.config.ts` — создаются на
Milestone 2 (сейчас их нет, и это правильно).

## Database status

Схема спроектирована, **не применена** — реализация на Milestone 2. Ни Drizzle, ни Supabase
ещё не установлены.

Все «статистические» показатели (wins/poles/podiums/points) **не денормализуются** в
отдельные `*_stats` таблицы — считаются агрегирующими запросами в data access layer поверх
`results` / `races` / `driver_standings` / `constructor_standings`. Причина: избежать
рассинхронизации при MVP-масштабе (десятки-сотни строк).

Во всех сущностных таблицах — `data_confidence` (`'verified' | 'placeholder' | 'uncertain'`,
раздел 6 MASTERPROMPT) + `created_at` / `updated_at`.

### Таблицы

**drivers** — `id (uuid pk)`, `slug (unique)`, `full_name`, `nationality`, `date_of_birth`,
`date_of_death?`, `career_start_year`, `career_end_year?` (null = активен), `photo_url?`,
`bio?`, `data_confidence`, timestamps.

**teams** — `id`, `slug (unique)`, `name`, `nationality`, `founded_year`, `dissolved_year?`,
`logo_url?`, `base_location?`, `bio?`, `data_confidence`, timestamps.

**seasons** — `id`, `year (int, unique)`, `world_champion_driver_id (fk drivers)?`,
`constructors_champion_team_id (fk teams)?`, `summary?`, `data_confidence`, timestamps.

**circuits** — `id`, `slug (unique)`, `name`, `country`, `location?`, `length_km (numeric)`,
`turns (int)`, `laps_standard?`, `lap_record_time?`, `lap_record_holder_driver_id (fk)?`,
`lap_record_year?`, `first_gp_year?`, `layout_image_url?`, `data_confidence`, timestamps.

**cars** — `id`, `slug (unique)`, `name`, `team_id (fk teams)`, `season_id (fk seasons)`,
`chassis_name?`, `engine_manufacturer?`, `engine_config?` (напр. "V10"), `capacity_liters?`,
`power_hp?` (приблизительное), `weight_kg?`, `image_url?`,
`technical_breakdown (jsonb: front_wing, suspension, engine, rear_wing, tyres, chassis)?`,
`data_confidence`, timestamps.

**races** — `id`, `season_id (fk)`, `circuit_id (fk)`, `round_number`, `name`, `date`,
`laps`, `distance_km?`, `pole_position_driver_id (fk)?`, `fastest_lap_driver_id (fk)?`,
`winner_driver_id (fk)?`, `winner_team_id (fk)?`, `data_confidence`, timestamps.

**results** — `id`, `race_id (fk)`, `driver_id (fk)`, `team_id (fk)`, `car_id (fk)?`,
`grid_position?`, `finish_position?` (null = сход), `status ('finished'|'dnf'|'dsq'|'dns')`,
`points (numeric)`, `data_confidence`. Unique `(race_id, driver_id)`.

**driver_standings** — `id`, `season_id (fk)`, `driver_id (fk)`, `team_id (fk)`, `position`,
`points`, `wins`, `podiums`. Unique `(season_id, driver_id)`.

**constructor_standings** — `id`, `season_id (fk)`, `team_id (fk)`, `position`, `points`,
`wins`. Unique `(season_id, team_id)`.

**driver_team_seasons** (junction) — `id`, `driver_id (fk)`, `team_id (fk)`,
`season_id (fk)`, `car_id (fk)?`. Индекс по `(driver_id, season_id)`.

**articles** (схема сейчас, UI — Milestone 14) — `id`, `slug (unique)`, `title`, `subtitle?`,
`body (markdown)`, `cover_image_url?`, `tags (text[])?`, `published_at?`, timestamps.
Без `data_confidence` — это редакционный контент, не статистика.

### Обоснование: почему не одна таблица `championships`

Раздел 7.3 MASTERPROMPT называет таблицу `championships`. Реализуем её как **две** —
`driver_standings` и `constructor_standings`. Одна таблица потребовала бы полиморфного FK
(entity_id, указывающий то на драйвера, то на команду), что противоречит требованию
нормализации из того же раздела. Кроме того, для страницы сезона (раздел 4.6) нужны полные
standings, а не только чемпион.

### FTS (подготовка к Milestone 9)

На `drivers.full_name`, `teams.name`, `cars.name`, `circuits.name`, `seasons.summary` —
генерируемые `tsvector`-колонки + GIN-индексы. Веса (`setweight`) определить на Milestone 2.

### Намеренно не создаём

`users` / `favorites` — только Milestone 14. `car_stats` / `driver_stats` / `team_stats` /
`circuit_stats` — не создаём вообще (см. выше).

## Routes implemented

Все 13 MVP-роутов существуют и рендерятся (заглушки, без данных):
`/`, `/about`, `/cars`, `/cars/[slug]`, `/drivers`, `/drivers/[slug]`, `/teams`,
`/teams/[slug]`, `/circuits`, `/circuits/[slug]`, `/seasons`, `/seasons/[year]`, `/search`.

Плюс `app/not-found.tsx`, `app/error.tsx`, `app/loading.tsx` (корневые состояния).
Пер-секционные `loading/error` — Milestone 11.

## Components implemented

- `layout/site-header.tsx` — sticky-шапка, desktop-навигация с активным состоянием
  (`aria-current`), разделитель между группами.
- `layout/mobile-menu.tsx` — полноэкранное меню на Radix Dialog (focus trap, Esc,
  блокировка скролла, portal). Закрывается по клику на ссылку.
- `layout/site-footer.tsx` — editorial-футер с сеткой ссылок.
- `layout/theme-toggle.tsx` — переключатель темы без состояния монтирования.
- `ui/button.tsx` — shadcn.
- `ui/container.tsx` — `Container` (max-width + адаптивные отступы), `Section` (вертикальный ритм).
- `ui/typography.tsx` — `Display` (4 размера через cva), `Eyebrow`, `Lede`.
- `archive/placeholder-page.tsx` — временная оболочка страницы; удаляется по мере
  реализации реальных страниц.
- `theme-provider.tsx` — обёртка next-themes.

## Data implemented

- none. Реальные данные F1 не загружены, БД не подключена. Правило «не выдумывать
  статистику» — MASTERPROMPT раздел 6. На Milestone 2 — курируемый seed-набор
  (15–30 cars, 15–30 drivers, 8–10 teams, 10–15 circuits, несколько seasons) с обязательной
  пометкой `data_confidence` и источников в `DATA_SOURCES.md`.
- Заглушечные тексты на страницах — это описания разделов, а не выдуманная статистика.
  Ни одного числа (побед, поулов, титулов) в коде нет намеренно.

## Known bugs

- none блокирующих.

Наблюдения, не требующие действий сейчас:

- npm выдаёт deprecation warning на `eslint@9.39.5` — это транзитивно требуемая
  `eslint-config-next@16.3.4` версия. Линт работает, не менять без причины.
- npm сообщает, что postinstall-скрипт `unrs-resolver` не одобрен (`allow-scripts`).
  На линт/сборку не влияет. Если появятся ошибки резолва импортов в ESLint — это первый
  подозреваемый.
- Программный `window.scrollTo` при открытом мобильном меню всё ещё двигает страницу
  (react-remove-scroll перехватывает колесо/тач, но не программный скролл). На реальное
  поведение пользователя не влияет.

## Failed approaches

1. **`create-next-app` прямо в каталоге проекта** — CLI отказывается работать в непустой
   директории, а там уже лежали `MASTERPROMPT.md` и `PROJECT_STATE.md`. Попытка удалить их
   ради генерации была заблокирована. **Решение:** сгенерировать скелет в scratchpad
   (`--skip-install`), скопировать в проект, затем `npm install`. Ничего не удалялось.
   Так же поступать и в будущем, если понадобится ре-скаффолдинг.

2. **Кастомная утилита с именем `text-spec`** — `cn()` (tailwind-merge) считал её классом
   цвета текста и выбрасывал при слиянии с `text-muted-foreground`, из-за чего eyebrow
   терял mono/uppercase. Симптом был виден только в браузере: типографика «молча» ломалась.
   **Решение:** переименовать в `spec-label`. **Правило на будущее: не начинать имена
   кастомных утилит с префиксов Tailwind (`text-`, `bg-`, `border-` …).**

3. **Паттерн `useEffect(() => setMounted(true), [])` в переключателе темы** — правило
   `react-hooks/set-state-in-effect` из `eslint-config-next@16` считает это ошибкой.
   **Решение:** убрать состояние целиком — какая иконка видна, решает CSS (`dark:hidden` /
   `hidden dark:block`), `aria-label` статичный. Проще и без рассинхронизации гидрации.

4. **Закрытие мобильного меню через `useEffect` по смене `pathname`** — то же правило линта.
   **Решение:** `onClick={close}` на каждой ссылке (обработка события вместо синхронизации
   состояния). Побочный эффект: меню не закроется по кнопке «назад» в браузере — принято
   как допустимый компромисс.

5. **Radix `Dialog` без `Dialog.Overlay`** — фон продолжал скроллиться под открытым меню.
   Блокировка скролла в Radix живёт **в Overlay**, а не в Content. **Решение:** отрендерить
   `Dialog.Overlay`. Проверено: `body { overflow: hidden }` появляется.

## Why they failed

См. пояснения в каждом пункте выше — все пять диагностированы и закрыты, ни один не
остаётся открытой проблемой.

## Environment / configuration

- Git инициализирован, ветка `main`. Remote **не** настроен (GitHub-репозиторий ещё не
  подключён — сделать на Milestone 13 или раньше по команде пользователя).
- `.gitignore` покрывает `node_modules`, `.next`, `.env*` (с исключением `!.env.example`),
  `.vercel`, логи, `.claude`.
- `.env.example` создан, содержит только имена переменных с комментариями. Реальных
  значений нет нигде в репозитории. `.env.local` не создавался — приложению пока не нужны
  переменные.
- Node.js v24.14.0, npm 11.18.0, git 2.53.0 (Windows 11).
- Supabase project: https://supabase.com/dashboard/project/graglvzassyzsyedraex (не подключён)
- Vercel account: vercel.com/nikita-7472 (не подключён)
- GitHub owner: NikitaDmitrenco
- `.claude/launch.json` — локальный конфиг запуска dev-сервера для Claude Code, в gitignore.

## Deployment status

- Не задеплоено. Vercel-проект не подключён, remote у git отсутствует.

## Git status

- Ветка `main`, работа велась прямо в ней (правило «не работать в main» из раздела 8
  вступает в силу с появлением CI/деплоя, то есть после Milestone 13; до этого прямые
  коммиты в `main` допустимы).
- Коммиты Milestone 1: bootstrap-коммит + коммит foundation (см. `git log`).

## Next milestone

**Milestone 2 — Database & Data Layer.** Начинать только по команде пользователя.

- Установить `drizzle-orm`, `drizzle-kit`, `@supabase/supabase-js`, `zod`
  (проверить актуальные стабильные версии перед установкой).
- `lib/env.ts` — валидация обязательных переменных окружения при старте.
- `lib/db/schema.ts` по схеме из раздела "Database status" выше.
- `drizzle.config.ts`, генерация и применение миграций к Supabase.
- Курируемый seed-набор + `DATA_SOURCES.md` с источником по каждой группе данных.
- `lib/db/queries/*` — типизированный data access layer (list / getBySlug / getByFilters)
  для cars, drivers, teams, circuits, seasons.
- `tsvector`-колонки и GIN-индексы (задел под Milestone 9).

**Требуется от пользователя перед Milestone 2:** `DATABASE_URL` и ключи Supabase в
`.env.local`. Claude не запрашивает и не вводит реальные секреты — пользователь заполняет
`.env.local` сам по шаблону `.env.example`.

## Important notes for the next Claude session

- Прочитать MASTERPROMPT.md целиком, затем этот файл, затем `git log --oneline`.
- **`npm run typecheck` на свежем клоне упадёт**, пока не выполнен `npm run build` —
  `PageProps`/`LayoutProps` генерируются сборкой. Это не баг, не «чинить».
- **Не менять местами `--primary` и `--accent`** — см. "Именование токенов".
- **Не именовать кастомные CSS-утилиты с префиксов Tailwind** — см. "Failed approaches" п.2.
- Правило линта `react-hooks/set-state-in-effect` активно: `setState` внутри `useEffect`
  будет ошибкой. Обрабатывать события, а не синхронизировать состояние.
- `components/archive/placeholder-page.tsx` — временный. Удалять его использования по мере
  реализации настоящих страниц, а сам файл — когда не останется ни одного использования.
- Дизайн намеренно сдержанный: минимальное скругление, тонкие линии, много воздуха,
  без glassmorphism/neon/красного «F1-стиля». Не «оживлять» его декоративными эффектами.
- Ждать команду пользователя перед стартом Milestone 2.
