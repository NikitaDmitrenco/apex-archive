# PROJECT STATE

> Оперативная память проекта Apex Archive между Claude-сессиями. Читать вместе с
> `MASTERPROMPT.md` и `README.md` в начале каждой новой сессии (см. раздел 0 мастер-промпта).
> Не доверять этому файлу слепо — при расхождении с фактическим кодом доверять коду и
> исправлять этот файл.

Last updated: 2026-09-04 (Milestones 0–14 completed locally; awaiting user push + Vercel deploy)

---

## Current milestone

MVP (Milestones 0–13) и Milestone 14 (Comparison + Eras + Stories + Auth/Favorites +
AI Assistant) — реализованы локально. Осталось: пуш в GitHub, накатить миграцию
`favorites`, подключить Vercel, ввести секреты — это делает пользователь.

## Overall progress

~100% кодовой части MVP + Milestone 14 кроме 3D viewer (нет ассетов).

## Completed

- **Milestone 0 — Project Audit & Architecture:** зафиксированы версии стека, схема БД,
  роуты, файловая структура, env-переменные, design tokens.
- **Milestone 1 — Project Foundation:** рабочее Next.js-приложение с дизайн-системой,
  навигацией, темами и заглушками всех MVP-роутов. Валидация (typecheck / lint / format /
  build / браузер) пройдена.
- **Milestone 2 — Database & Data Layer:** схема применена к Supabase, курируемый seed
  залит, DAL реально отрабатывает запросы (`npm run db:verify`), FTS-векторы заполнены.
- **Milestone 3 — Landing / Home:** главная страница на реальных данных из БД, включая
  блок текущего сезона 2026 с актуальными таблицами положения.
- **Milestone 4 — Cars:** каталог с шестью фильтрами + detail-страницы с техническим
  разбором и связями. Найдена и устранена причина «залипания на Loading» — см.
  "Failed approaches" п.12.
- **Milestone 5 — Drivers:** каталог с фильтрами + detail-страницы с карьерным таймлайном,
  таблицей финишей по сезонам и связями к cars / teams / seasons.
- **Milestone 6 — Teams:** каталог с фильтрами + detail-страницы. **Team evolution timeline
  реализован** (не перенесён в Milestone 14): выбор года меняет показанные машины, пилотов
  и итог сезона, всё на клиенте без дополнительных запросов.
- **Milestone 7 — Circuits:** каталог с фильтрами (country, hosted-in-year) + detail-страницы
  со спецификацией трассы, lap record, race history и related seasons. Данные трасс самые
  слабые в архиве — length/turns/laps в основном NULL (см. `DATA_SOURCES.md`); рендерится
  через `orDash` без вранья.
- **Milestone 8 — Seasons:** каталог с фильтром по декадам + detail-страницы с summary,
  чемпионами, календарём, обеими таблицами standings и списком машин сезона. Для
  in-progress сезона (2026) — нейтральный тон «Season in progress — champion not yet decided».
  `dynamicParams = false` на `[year]` числовом сегменте работает так же, как на slug'ах.
- **Milestone 9 — Global Search:** `/search` на PostgreSQL FTS через `websearch_to_tsquery`
  (защита от syntax errors на пользовательском вводе). Группировка по 5 типам сущностей,
  по 8 результатов на группу, сортировка по `ts_rank`. Числовой ввод 1950-2100 → OR по
  `seasons.year` (year сознательно не индексируется в tsvector, см. schema). Форма с
  250ms debounced `router.push` + клавиша × для очистки, без JS тоже работает.
- **Milestone 10 — Integration & Relationships:** пройдена проверочная таблица из брифа —
  все перекрёстные связи уже покрыты 1-клик навигацией. Три небольших усиления:
  season-card теперь рендерит чемпиона как Link, на `not-found.tsx` и `error.tsx` добавлена
  кнопка «Search the archive».
- **Milestone 11 — Polish (sub-scope):** SEO (новый `lib/seo.ts` + `buildMetadata` на каждой
  detail-странице, OG/Twitter/canonical в layout, `metadataBase`); a11y (skip-link, `<main id>`,
  `<caption>` у tables, sr-only labels); per-segment `error.tsx` для всех 6 основных
  роутов (НЕ loading.tsx — ломает гидратацию, см. failed approach #12); реальная страница
  About вместо заглушки. Анимации (Framer Motion / GSAP) — отложены как декоративные
  на текущем этапе.
- **Milestone 12 — QA:** checklist зафиксирован в этом файле ниже; все линии — PASS после
  одной правки (убраны `!` non-null assertions на nullable DB-полях в `app/seasons/[year]`).
- **Milestone 13 — Deployment:** `vercel.json` (region `fra1` под Supabase `aws-1-eu-west-1`,
  security headers), `app/sitemap.ts`, `app/robots.ts`, раздел Deployment в README.
  Подключение Vercel и ввод секретов — пользователь.
- **Milestone 14 — Optional features (без 3D):**
  - **Comparison** (`/compare?a=...&b=...`) — side-by-side или форма, HIGHER/LOWER бейджи.
  - **Interactive History Timeline** (`/eras`) — восемь эпох из `ERAS` с редакционными
    параграфами, линки на машины эпохи и сезоны диапазона.
  - **Stories editorial section** (`/stories`, `/stories/[slug]`) — индекс и просмотр
    статей из `articles`-таблицы; markdown рендерится через `marked` + `isomorphic-dompurify`;
    5 курированных эссе в `lib/db/seed/articles.ts`.
  - **User accounts (Supabase Auth)** — `/login`, `/signup`, `/account`, `/auth/confirm`,
    `/auth/signout`; email/password flow; `proxy.ts` (Next 16 заменил `middleware.ts`)
    рефрешит сессию через `@supabase/ssr`. `lib/env.ts` Supabase-переменные — optional.
  - **Favorites** — новая таблица `favorites` + DAL (`isFavorited`, `toggleFavorite`,
    `listFavorites`); кнопка `★ Save` на каждой detail-странице (cars/drivers/teams/
    circuits/seasons); список сохранённого на `/account`.
  - **AI Archive Assistant** (`/assistant`) — OpenAI function calling с 8 типизированными
    инструментами; запросы проходят через существующий DAL (никакого свободного SQL от
    LLM напрямую); degrade gracefully без `OPENAI_API_KEY` (503).
  - **Из M14 НЕ сделано:** 3D car viewer — требует 3D-ассеты (GLTF/USDZ), которых нет в
    проекте и которые нельзя сгенерировать без источника.

## In progress

- none (всё приостановлено до пуша пользователем, наката миграции и деплоя)

## Not completed

- Деплой на Vercel — действие пользователя.
- Миграция `favorites` накатывается на Supabase (`npm run db:generate && npm run db:migrate`).
- Настройка Supabase Auth (включить email/password в Dashboard, настроить redirect URL на
  `${NEXT_PUBLIC_SITE_URL}/auth/confirm`).
- Ввод `OPENAI_API_KEY` для активации AI Assistant (без него — 503).
- 3D car viewer — не реализован (нет 3D-ассетов).

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

Установлено на Milestone 2: `drizzle-orm` **0.45.2**, `drizzle-kit` **0.31.10**,
`postgres` **3.4.9` (драйвер postgres.js), `zod` **4.5.4**, `dotenv` **17.4.2** (dev),
`tsx` **(dev)** — для запуска seed/verify вне Next.

Установлено на Milestone 14: `@supabase/supabase-js` + `@supabase/ssr` (для Auth через
email/password), `openai` **7.10.0** (для AI Assistant function calling), `marked`
**18.x** + `isomorphic-dompurify` **4.x** (для рендера markdown в Stories).

Сознательно не установлено: `framer-motion` / `gsap` (анимации отложены — design намеренно
сдержанный, бриф прямо требует «meaningful, not for their own sake»); `recharts` (графики
не понадобились при текущем объёме данных); `@react-three/fiber` + 3D-ассеты (3D viewer
не реализован — нет моделей).

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

Схема **применена** к Supabase (`npm run db:migrate`, миграция
`lib/db/migrations/0000_init.sql`). 11 таблиц, 5 GIN-индексов по tsvector-колонкам.
Данные залиты, запросы проверены прогоном (`npm run db:verify`).

### ВАЖНО: исправление решения Milestone 0 о статистике

На Milestone 0 планировалось не хранить карьерные тоталы, а считать их агрегатами по
`results`. **Это решение отменено.** Причина: архив содержит лишь подмножество гонок, и
агрегат по нему выдал бы заниженное число побед, поданное как факт, — прямое нарушение
раздела 6 MASTERPROMPT.

Поэтому:

- `drivers.championships / wins / poles / podiums / race_starts / career_points` и
  `teams.championships / wins / poles` — **хранимые nullable-колонки** с опубликованными
  величинами. **NULL значит «неизвестно» и не должен рендериться как 0.**
- Агрегаты по `results` допустимы только для показателей, ограниченных сезоном/гонкой,
  где данные полны.

Отдельные `*_stats` таблицы по-прежнему не создаются — эти колонки живут прямо в сущностях.

Во всех сущностных таблицах — `data_confidence` (`'verified' | 'placeholder' | 'uncertain'`)
+ `created_at` / `updated_at`.

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

- **`/` — готова полностью** (Milestone 3), на реальных данных, ISR `revalidate = 3600`.
- **`/cars`, `/drivers`, `/teams` — готовы.** Динамические (`ƒ`), читают `searchParams`.
- **`/cars/[slug]`, `/drivers/[slug]`, `/teams/[slug]` — готовы.** 18 машин, 40 пилотов и
16 команд предгенерированы, `dynamicParams = false` → неизвестный slug даёт настоящий
  404 (проверено на каждом разделе).
- **Все 12 MVP-роутов реализованы на реальных данных** (Milestones 7–9 закрыли circuits,
  seasons, search; `/about` стал реальной страницей в Milestone 11).
- **Бонусные роуты Milestone 14:** `/compare` (выбор двух машин + side-by-side), `/eras`
  (8 эпох с редакционными параграфами и линками). Появляются только в мобильном меню —
  верхняя десктопная навигация остаётся неизменной согласно MASTERPROMPT §3.
- `app/error.tsx`, `app/not-found.tsx`, и **per-segment error.tsx** для cars/drivers/teams/
  circuits/seasons/search — есть. **`loading.tsx` намеренно отсутствует** — см.
  "Failed approaches" п.12.
- `app/sitemap.ts` и `app/robots.ts` (Milestone 13) — генерируются Next.js автоматически.

## Components implemented

- `layout/site-header.tsx` — sticky-шапка, desktop-навигация с активным состоянием
  (`aria-current`), разделитель между группами. Compare/Eras фильтруются из desktop-меню
  через `mobileOnly: true` (Milestone 14) — на десктопе не показываются.
- `layout/mobile-menu.tsx` — полноэкранное меню на Radix Dialog (focus trap, Esc,
  блокировка скролла, portal). Закрывается по клику на ссылку. Включает Compare и Eras.
- `layout/site-footer.tsx` — editorial-футер с сеткой ссылок.
- `layout/theme-toggle.tsx` — переключатель темы без состояния монтирования.
- `ui/button.tsx` — shadcn.
- `ui/container.tsx` — `Container` (max-width + адаптивные отступы), `Section` (вертикальный ритм).
- `ui/typography.tsx` — `Display` (4 размера через cva), `Eyebrow`, `Lede`.
- `archive/placeholder-page.tsx` — временная оболочка. После Milestone 11 **больше нигде
  не используется**; можно удалить, когда будет удобно.
- `theme-provider.tsx` — обёртка next-themes.
- `archive/section-header.tsx` — eyebrow + заголовок + ссылка «view all».
- `archive/home/*` (Milestone 3): `hero`, `editorial-statement`, `now-season`,
  `featured-cars`, `legendary-drivers`, `moments`, `teams-and-circuits`, `archive-stats`.
  Каждая секция оформлена по-своему (индекс, сетка, таблица, крупные цифры) — бриф прямо
  запрещает «dashboard из одинаковых карточек».
- `lib/format.ts` — `orDash` (NULL → «—»), `formatPoints`, `formatEngine`.
- **`archive/filter-bar.tsx` (Milestone 5) — общая панель фильтров** для всех каталогов:
  `FilterBar` (форма), `FilterSelect`, `FilterToggle`. Используется car/driver/team/
  circuit/season каталогами. Это `<form method="get">`, поэтому фильтры работают и без JS;
  при наличии JS `onSubmit` перехватывает отправку и выкидывает пустые параметры, чтобы
  URL был чистым (`?era=v8`, а не `?era=v8&decade=&teamSlug=...`), а `onChange` применяет
  фильтр без нажатия кнопки.
- `archive/car-filters.tsx`, `archive/driver-filters.tsx`, `archive/team-filters.tsx`,
  `archive/circuit-filters.tsx`, `archive/season-filters.tsx` — тонкие обёртки над
  `FilterBar`, задающие набор полей.
- `lib/search-params.ts` — `withoutBlanks()`, общий для всех каталогов.
- `archive/team-evolution.tsx` (Milestone 6) — интерактивный timeline команды. Все сезоны
  приходят пропсом, переключение года не делает запросов. Вкладки с `role="tab"` и
  `aria-selected`.
- `archive/team-card.tsx`, `archive/circuit-card.tsx`, `archive/season-card.tsx` —
  карточки каталогов. `season-card.tsx` обновлён в Milestone 10: чемпионы теперь Links.
- `archive/car-card.tsx` (Milestone 4) — рамка изображения рендерится всегда, с надписью
  «No image yet», когда `image_url` пуст.
- `archive/search-form.tsx` (Milestone 9) — клиентская форма с 250ms debounce, работает
  и без JS (`<form action="/search" method="get">`); sr-only `<label>`, `role="search"`,
  клавиша × для очистки.
- `archive/search-results.tsx` (Milestone 9) — серверный компонент, группировка по типу
  сущности с `<h2>` для скринридеров.
- `archive/comparison-form.tsx` (Milestone 14) — две `FilterSelect`, router.push при
  сабмите.
- `archive/eras-timeline.tsx` (Milestone 14) — восемь редакционных параграфов эпох,
  линки на `/cars?era=<slug>` и на сезоны диапазона.
- `lib/seo.ts` (Milestone 11) — `buildMetadata({title, description, path})`,
  `SITE_NAME`, `SITE_DESCRIPTION`, `SITE_URL`. Используется на всех detail-страницах.
- `lib/constants/eras.ts` (Milestone 4) — восемь эпох по формуле двигателя,
  **границы согласованы с пользователем**. Метки описывают регламент, а не дают
  редакционную характеристику периоду.

### Формулировка «в этом архиве» — важно для честности

У сущностей рядом стоят два разных числа: реальный карьерный тотал (например, у Ferrari
16 титулов) и то, что покрыто засеянными сезонами (у Ferrari это 2000 и 2004). Без
оговорки это читается как противоречие. Поэтому все списки, ограниченные содержимым
архива, подписаны явно: «Title seasons in this archive», «Career in this archive»,
«Seasons held in this archive, not the driver's full career», «Drivers held in this
archive». **Сохранять эту оговорку на новых страницах.**

## Data implemented

Залито: **16 команд, 40 пилотов, 12 сезонов, 12 трасс, 18 машин, 40 связей
driver↔team↔season, 23 строки личного зачёта и 11 — кубка конструкторов (сезон 2026)**.
Источники и методология — `lib/db/seed/DATA_SOURCES.md` (читать перед любым изменением
данных).

- **Данные сезона 2026 — датированный снимок**, актуальный после 12-го этапа (Гран-при
  Нидерландов, 23.08.2026), источник — официальный formula1.com. Они устаревают после
  каждой гонки. Обновлять перезапуском seed; дата зафиксирована в `summary` сезона и
  выводится на главной.
- Перекрёстные проверки перед принятием чисел: 12 победителей гонок суммируются в 12
  этапов, а по командам дают Mercedes 8 / Ferrari 2 / McLaren 2 — ровно как в таблице
  конструкторов.
- Нули побед у пилотов 2026 — это факт (не выиграли ни одной из 12), а не «неизвестно».
  Подиумы не заполнены вообще: в источнике их нет, а колонки nullable именно для этого.

- Счётчики титулов **выведены подсчётом по годовым таблицам чемпионов**, а не скопированы
  из сводки. Это принципиально: извлечение сводки дало Red Bull 4 титула конструкторов
  вместо 6 и Renault 0 вместо 2.
- Спорный чемпион-2024 сверен по трём независимым источникам (Formula1.com, CNN,
  Sky Sports) — Ферстаппен, 4-й титул. Конфликт задокументирован.
- Непроверенные величины (career wins/poles/podiums, даты рождения, мощность и вес машин,
  длины большинства трасс) оставлены **NULL** или помечены `uncertain`. Не заполнять их
  «правдоподобными» числами.
- Сезон 2026 без чемпионов — сезон идёт. Это фактическое состояние, а не пропуск данных.
- Гонки и результаты (`races`, `results`, `driver_standings`, `constructor_standings`)
  пока пусты — таблицы созданы, данных нет. Наполнение потребуется для standings на
  Milestone 8.

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
- Данные сезона 2026 — снимок на 12-й этап. Устареют после ближайшей гонки. Это не баг
  кода, а свойство seed-подхода; обновляется перезапуском `npm run db:seed` со свежими
  числами из formula1.com.
- Изображений нет ни у одной сущности (`image_url`, `photo_url`, `logo_url`,
  `layout_image_url` — везде NULL). Вёрстка построена типографически и переживает это.
  Медиа появится, когда будет подключён Supabase Storage.

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

6. **Прямое подключение Supabase `db.<ref>.supabase.co`** — `getaddrinfo ENOTFOUND`.
   Хост имеет только AAAA-запись: прямые подключения Supabase работают по IPv6, а сеть
   IPv4-only. `nslookup` подтвердил: пул резолвится в IPv4, прямой — только в IPv6.
   **Решение:** `DIRECT_URL` указывает на **session pooler** (тот же хост, что у
   транзакционного, порт 5432). Не «чинить» обратно на прямое подключение.

7. **Агрегация карьерной статистики по `results`** (решение Milestone 0) — отменено до
   реализации. Seed покрывает подмножество гонок, агрегат выдал бы заниженные числа как
   факт. **Решение:** хранимые nullable-колонки тоталов. См. "Database status".

8. **Извлечение сводных таблиц Wikipedia через WebFetch** — вернуло неверные агрегаты
   (Red Bull 4 титула, Renault 0, чемпион-2024 Норрис, у Норриса 2 титула вместо 1).
   **Решение:** запрашивать сырые годовые таблицы и считать самому; спорные значения
   сверять отдельным поиском по независимым источникам. Применять этот же подход при
   расширении данных.

9. **Транзакционный пул Supabase (порт 6543) для приложения** — САМАЯ ДОРОГАЯ ошибка этого
   этапа, диагностика заняла много времени. Симптом: страница висит ~через раз, сборка
   падает с `canceling statement due to statement timeout`, при этом `db:verify` и seed
   работают идеально.

   **Причина:** `postgres.js` конвейеризует параллельные запросы в одном соединении.
   Транзакционный режим пула привязывает серверное соединение к транзакции и не может их
   чередовать. В `pg_stat_activity` было видно `wait_event = ClientRead` и запросы,
   «активные» по 4 минуты: Postgres работу выполнил, а драйвер ответ не читал.
   Скрипты выживали, потому что делают запросы последовательно; страница шлёт шесть через
   `Promise.all` — и виснет.

   **Решение:** `DATABASE_URL` указывает на **session pooler (порт 5432)**, тот же, что и
   `DIRECT_URL`. После этого — стабильные 0.6 с на запрос.

   **Тупиковые попытки перед этим (не повторять):** `max: 5`, затем `max: 1` — второе
   ухудшило ситуацию, что как раз и подтвердило версию про конвейеризацию; перезапуск
   dev-сервера; подозрение на HMR и кеш клиента на globalThis.

10. **Диагностика по зависшему процессу вместо логов** — я долго проверял браузером и curl,
    хотя ответ был в `pg_stat_activity` (`wait_event`, `pg_blocking_pids`). **Правило:**
    при зависании запросов сначала смотреть состояние сессий в БД, а не гадать по клиенту.

11. **Тестирование не того процесса** — старый сервер оставался на порту, новый молча падал
    с `EADDRINUSE` либо уходил на другой порт, и я «проверял» исправление на старом коде.
    Это случилось **дважды** и дало два ложных вывода. **Правило: после каждого
    перезапуска сервера убеждаться по логу, что он реально стартовал** (`Ready in ...`), и
    убивать предыдущий по PID из `netstat -ano | grep LISTENING | grep :ПОРТ`.
    `pkill -f "next start"` в Git Bash на Windows не работает.

12. **`loading.tsx` ломает гидратацию страницы (Next 16.3.4)** — КРИТИЧНО.
    Симптом: содержимое страницы навсегда остаётся скелетом «Loading», клиентские
    компоненты внутри неинтерактивны. При этом сервер отдаёт полный корректный HTML
    (проверено curl: 60 КБ, все 18 карточек), а layout (header/footer) гидратируется
    нормально.

    Диагностика: у `<main>` остаются `<template>` и маркер React `$~` (отложенная
    граница), у элементов внутри нет `__reactFiber$`, в консоли ошибок нет.
    Проверено, что дело именно в `loading.tsx`: и корневой, и сегментный
    (`app/cars/loading.tsx`) воспроизводят баг; не зависит от `revalidate` и от чтения
    `searchParams`. Без файла — гидратация мгновенно работает.

    **Решение: файлов `loading.tsx` в проекте нет.** Ответ сервера 0.15–0.6 с, скелет не
    даёт заметной пользы, а цена — неработающая интерактивность.
    **Это отменяет требование раздела 7.8 MASTERPROMPT про `loading.tsx`** — вернуть можно
    только после того, как найдётся обходной путь или Next это починит. Не добавлять
    `loading.tsx` «за компанию» на следующих milestone'ах.

    Побочный вывод: ранние эпизоды «страница висит на Loading» на Milestone 3 я списал на
    пул соединений. Пул был отдельной реальной проблемой (п.9), но часть симптомов давал
    именно этот баг.

13. **Мягкий 404 на detail-странице** — `notFound()` рендерил правильную страницу, но со
    статусом **200**. Причина: ответ стримится (async `generateMetadata`), заголовок 200
    уходит с оболочкой раньше, чем страница дойдёт до `notFound()`; в теле при этом видны
    `NEXT_HTTP_ERROR_FALLBACK;404` и `robots: noindex`.
    **Решение:** `generateStaticParams()` со всеми slug'ами + `export const dynamicParams
    = false`. Роутер отказывает неизвестному slug'у до рендера и отдаёт настоящий 404.
    **Применять этот же приём на всех detail-страницах (Milestones 5–8).**
    Цена: новая сущность в БД появляется на сайте только после пересборки.

## Why they failed

См. пояснения в каждом пункте выше — все пять диагностированы и закрыты, ни один не
остаётся открытой проблемой.

## Environment / configuration

- Git инициализирован, ветка `main`, **remote подключён пользователем вручную:**
  `origin` → https://github.com/NikitaDmitrenco/apex-archive. `main` отслеживает
  `origin/main`, всё синхронизировано.
- `.gitignore` покрывает `node_modules`, `.next`, `.env*` (с исключением `!.env.example`),
  `.vercel`, логи, `.claude`.
- `.env.example` содержит только имена переменных с комментариями. Реальных значений в
  репозитории нет.
- `.env.local` создан и заполнен. **Обе строки подключения — session pooler порт 5432**
  (регион `aws-1-eu-west-1`): `DATABASE_URL` для приложения, `DIRECT_URL` для
  drizzle-kit и seed. Транзакционный пул :6543 не использовать — см. "Failed approaches"
  п.9. Файл в `.gitignore`, проверено через `git check-ignore`.
- Node.js v24.14.0, npm 11.18.0, git 2.53.0 (Windows 11).
- Supabase project: https://supabase.com/dashboard/project/graglvzassyzsyedraex (не подключён)
- Vercel account: vercel.com/nikita-7472 (не подключён)
- GitHub owner: NikitaDmitrenco
- `.claude/launch.json` — локальный конфиг запуска dev-сервера для Claude Code, в gitignore.

## Deployment status

См. раздел "Deployment status (Milestone 13)" в конце файла — там финальный статус после
подготовки Milestone 13.

## Git status

- Ветка `main`, remote `origin` = `NikitaDmitrenco/apex-archive`. Работа велась прямо в
  `main` (правило «не работать в main» из раздела 8 вступает в силу с появлением
  CI/деплоя, то есть после Milestone 13).
- Коммиты Milestone 1: bootstrap + tooling + design + layout + routes + docs (6).
- Коммиты Milestone 2: deps/env, schema+migration, DAL, seed, verify+docs (5).
- **Milestone 3 закоммичен пользователем вручную одним коммитом `f828ff9`, и у него
  испорченное сообщение** (`t#  modified: lib/db/seed/data.ts` плюс управляющие символы) —
  видимо, редактор коммита захватил текст статуса. Содержимое коммита корректное и полное
  (24 файла, весь Milestone 3). Коммит уже запушен.
  Исправление сообщения потребует `git commit --amend` + `git push --force`, то есть
  перезаписи общей истории, — **делать только по явной команде пользователя**. Пока
  оставлено как есть.
- **Пуш выполняет пользователь.** Claude коммитит локально и не пушит без явной команды.

## Next milestone

MVP (Milestones 0–13) и начало Milestone 14 (Comparison + History Timeline) — реализованы
локально, typecheck/lint/format чистые, build не запускался (требует live DB). Дальше:

1. **Пользователь:** `git push` и подключение Vercel (инструкции в README → Deployment).
2. **Пользователь:** smoke-тест на production URL после первого деплоя.
3. После подтверждения — расширение Milestone 14 (Favorites / Auth / 3D / AI) по
   отдельной команде, не автоматически.

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
- **NULL в статистике значит «неизвестно», не ноль.** Рендерить как «—» или скрывать поле.
  Показать 0 побед у Фанхио — это выдуманная статистика.
- **ОБЕ переменные подключения указывают на session pooler (порт 5432).** `DATABASE_URL` —
  НЕ транзакционный пул (6543): страницы с параллельными запросами на нём виснут, см.
  "Failed approaches" п.9. Прямое подключение (`db.<ref>.supabase.co`) недоступно — только
  IPv6, п.6. Не «оптимизировать» это обратно.
- При деплое на Vercel перепроверить это решение: для serverless обычно рекомендуют
  транзакционный пул, но тогда нужен `max: 1` и последовательные запросы. Сейчас выбран
  session pooler как рабочий вариант.
- Данные редактировать только сверяясь с `lib/db/seed/DATA_SOURCES.md`. Там же список того,
  что предстоит верифицировать.
- `npm run db:verify` — быстрый способ убедиться, что DAL и БД живы после изменений схемы.
- Пользователь подтвердил: «Archive» в меню — не отдельная страница; системную тему не
  поддерживаем, только dark/light.
- Репозиторий на GitHub: `NikitaDmitrenco/apex-archive`. **Пушит пользователь**, Claude
  только коммитит локально. `git push --force` не выполнять никогда без явной команды.
- Перед правкой главной страницы прочитать `components/archive/home/` — каждая секция
  оформлена по-своему намеренно, приводить их к единому виду карточек нельзя.
- **Не создавать `loading.tsx`.** Он ломает гидратацию, страница остаётся неинтерактивной.
  Подробности и доказательства — "Failed approaches" п.12.
- **Detail-страницы делать через `generateStaticParams` + `dynamicParams = false`**, иначе
  несуществующий slug отдаёт 200 вместо 404 — п.13.
- **Проверяя что-либо через curl/браузер, сначала убедиться, что сервер перезапустился.**
  Дважды делал ложные выводы из-за старого процесса на порту — п.11.
- Панель браузера в этой среде часто схлопнута (`clientWidth === 0`) и не перерисовывается.
  Для замеров вёрстки задавать вьюпорт через `resize_window`, а содержимое надёжнее
  проверять curl'ом. Учитывать, что React разбивает текст комментариями `<!-- -->`, поэтому
  grep по фразе целиком может не найти совпадение.
- Ждать команду пользователя перед стартом следующих фаз Milestone 14 (Favorites / Auth /
  3D / AI). Локально реализованы только Comparison и Eras — расширение по отдельной
  команде.

---

## Deployment status (Milestone 13)

**Status: prepared, awaiting user.**

- `vercel.json` added at project root with `fra1` region (Supabase is in `aws-1-eu-west-1`), security headers.
- `app/sitemap.ts` and `app/robots.ts` added — Next.js generates them automatically.
- README updated with deployment instructions.
- Production build **NOT verified locally** in this environment — `npm run build` requires live DB access (it runs `generateStaticParams` for every detail page, which queries Supabase). The user runs the build on Vercel with real credentials.
- Vercel account connection is NOT performed by Claude — owner does it manually.

### What's required from the user

1. Connect `NikitaDmitrenco/apex-archive` to vercel.com/nikita-7472.
2. Set the env vars listed in README → Deployment → One-time setup.
3. Trigger a first build (push to main or click "Deploy").
4. Run the smoke test on the production URL.

### Known deployment constraints

- DATABASE_URL must be **session pooler port 5432**, not transaction pooler (6543). See PROJECT_STATE "Failed approaches" #9 for the full explanation.
- Next 16 `loading.tsx` files are NOT used (breaks hydration). Don't add them to fix perceived UX gaps.
- `dynamicParams = false` on every detail page means new entities appear only after rebuild.
- `.env.local` is in `.gitignore`. Secrets never go in the repository.

---

## QA Checklist (Milestone 12)

Completed by: 2026-09-04 (QA pass on the working tree, which already contains
Milestones 7–11 and the Milestone-13 deployment scaffolding — they had not yet been
committed and so the "Completed" section above still lists only Milestones 0–6 and 13.
The QA pass below applies to **all** implemented routes, not just those the document
previously listed as complete.)

### Type safety

- [PASS] `tsc --noEmit` runs with zero errors.
- [PASS] `eslint` runs clean (no warnings, no errors).
- [PASS] `prettier --check .` reports all files formatted.
- [PASS] No risky `!` non-null assertions on nullable DB columns in production
  paths **after this pass**. Found four such assertions in
  `app/seasons/[year]/page.tsx` (`season.worldChampionDriver!.slug` and the parallel
  `constructorsChampionTeam!.…`), each guarded by a `Boolean(...)` ternary that
  TypeScript cannot narrow through. Replaced the `Boolean(x)` narrowing pattern with
  local `const`s (`const worldChampion = season.worldChampionDriver;` plus a
  `worldChampion &&` check inside the ternary) so TS narrows without the `!`.
- [PASS] The remaining `!` non-null assertion in `lib/db/queries/comparison.ts:48`
  (`link.driver!.id` after `.filter((link) => link.driver)`) is safe: the filter
  callback is a plain predicate, not a typed guard, so TS keeps `driver` nullable;
  the runtime behaviour is identical (the falsy entries have been removed). Left as-is
  because `lib/` is outside the allowed scope.
- [PASS] All DTOs returned by DAL functions declare nullable columns as
  `T | null` (drivers.wins, teams.championships, circuits.lengthKm, etc.), and all
  call sites either pass them through `orDash(...)` or guard with a `?:` ternary.
- [PASS] Date columns from Postgres are typed `string | Date | null`; the one place
  that prints them (`app/seasons/[year]/page.tsx: formatRaceDate`) defensively parses
  the value rather than assuming the wire format.

### Accessibility

- [PASS] Skip-to-content link present in `app/layout.tsx:69-74`; targets `<main id="main">`.
  Visible only on focus, exits the sticky header, lives at the top of the body.
- [PASS] Every page has exactly one `<h1>`. Verified across `app/layout.tsx` (none),
  the home `<Hero>` (one), `/about`, `/cars`, `/cars/[slug]`, `/compare` (one per
  render branch, never both), `/circuits`, `/circuits/[slug]`, `/drivers`,
  `/drivers/[slug]`, `/eras`, `/search`, `/seasons`, `/seasons/[year]`, `/teams`,
  `/teams/[slug]`, every `error.tsx`, and `not-found.tsx`.
- [PASS] Every form has associated labels. `FilterSelect` pairs an explicit
  `<label htmlFor="filter-{name}">` with its `<select id="filter-{name}">`;
  `FilterToggle` wraps the checkbox in an implicit `<label>`; the search input has
  `<label htmlFor="archive-search" className="sr-only">`; the compare form uses
  `FilterSelect` and so inherits the same pairing.
- [PASS] Tables have proper `<thead>` with `<th scope="col">` in every standings
  table (drivers, both seasons tables, both home standings tables).
- [PASS] `<caption className="sr-only">` describes the standings tables on
  `app/seasons/[year]/page.tsx` and `components/archive/home/now-season.tsx`.
  Minor note (not a fail): `app/drivers/[slug]/page.tsx:207` (season-finishes table)
  omits a `<caption>`. Acceptable because the surrounding `<Eyebrow>Season finishes</Eyebrow>`
  already names the table; screen readers will announce the heading context.
- [PASS] Lists are `<ul>` / `<ol>`, not styled `<div>`s. Search-results rows are
  `<ul><li><Link>…</Link></li></ul>`; season/team race histories use `<ol>`; era
  rows are `<article>`, which is appropriate for independent editorial entries.
- [PASS] Interactive elements are `<button>` (filter apply, theme toggle, mobile
  menu trigger/close, team-evolution tabs, search clear, retry buttons in error
  boundaries) or `<Link>` (navigation, entity cards). No styled `<div>`s pretending
  to be clickable.
- [PASS] `<nav aria-label="Primary">` and `<nav aria-label="Footer">` distinguish
  the two nav landmarks. `aria-current="page"` on the active nav link in
  `components/layout/site-header.tsx:20`.
- [PASS] `aria-label` set on icon-only buttons (Open menu, Close menu, Toggle theme,
  Clear search).
- [PASS] Team-evolution tabs expose `role="tablist"` + `role="tab"` +
  `aria-selected` + `aria-label`. Search form uses `role="search"`. Decorative
  separators carry `aria-hidden="true"`.
- [PASS] Mobile menu is a Radix `Dialog` with `Dialog.Overlay` rendered (so the
  built-in body-scroll lock actually fires) and `Dialog.Title` provided as an
  `sr-only` element (Radix requires a Title for screen-reader announcement).

### Secrets & env

- [PASS] `.gitignore` line 34 (`/.env*` with `!.env.example` exception) covers all
  env files; `.env.local` is ignored (verified via repo state — `.env.local` exists
  on disk but is not tracked).
- [PASS] `.env.example` contains only variable names + comments; no real values
  are committed.
- [PASS] All required server env reads go through `lib/env.ts → serverEnv()`:
  `lib/db/index.ts:28` calls `serverEnv().DATABASE_URL` once and caches the
  connection. `lib/env.ts` validates the URL prefix (`postgres://` or
  `postgresql://`) at first access with a clear error message.
- [PASS] The remaining direct `process.env` reads are intentional and benign:
  `lib/seo.ts:13` reads `NEXT_PUBLIC_SITE_URL` with a localhost fallback (public
  var, optional); `lib/db/index.ts:39` reads `NODE_ENV` (framework convention);
  `drizzle.config.ts` and `lib/db/seed/{seed,verify}.ts` read `DIRECT_URL` or
  `DATABASE_URL` for scripts outside the Next runtime (these run with `tsx`).
- [PASS] No hardcoded URLs to internal services in `app/` or `components/`.
  Only `lib/seo.ts` and `vercel.json` (deployment) mention non-localhost URLs, and
  both pull from env or are config-only.

### Validation

- [PASS] Catalog pages parse `searchParams` through Zod and treat a malformed
  query string as the unfiltered case (verified in `app/cars/page.tsx`,
  `app/drivers/page.tsx`, `app/teams/page.tsx`, `app/circuits/page.tsx`,
  `app/seasons/page.tsx`): `safeParse(withoutBlanks(...))` then fall back to
  `parse({})` on failure. `withoutBlanks()` drops empty strings and `undefined`.
- [PASS] `/search` reads `params.q` safely. The line `const rawQuery =
  typeof params.q === "string" ? params.q : "";` covers `string | string[] |
  undefined` from the URL — a duplicated key like `?q=a&q=b` collapses to the
  first string, an array collapses to the empty default.
- [PASS] `/compare` reads `params.a` / `params.b` via a `firstParam` helper that
  returns `value[0]` for arrays and the bare string otherwise. Both `generateMetadata`
  and the page handler call it.
- [PASS] No Server Actions or Route Handlers exist yet (search, compare, all DAL
  reads are direct page reads). The validation surface is therefore limited to
  catalog `searchParams` + the two compare params, all of which are covered.
- [PASS] Filter zod schemas clamp years to `[1950, 2100]`, decade to multiples of
  ten, pagination to `1 ≤ limit ≤ 200` and `offset ≥ 0`. Strings require
  `min(1)` so empty selections don't sneak into the WHERE clause.

### Data integrity

- [PASS] Nullable columns render through `orDash(...)`. Spot-checked across all
  detail pages: cars spec rows (`chassisName`, `engineManufacturer`,
  `engineConfig`, `capacityLiters`, `powerHp`, `weightKg`), drivers career stats
  (`championships`, `wins`, `poles`, `podiums`, `raceStarts`, `careerPoints`),
  teams career stats (`championships`, `wins`, `poles`), circuits spec
  (`lengthKm`, `turns`, `lapsStandard`, `firstGpYear`). Where the rendering
  shape differs (cars spec rows build the value inline), the `null`-branch
  is an explicit `"—"`.
- [PASS] No fabricated placeholder numbers in components. The legenday-drivers and
  team-cards blocks are only fed by queries with `championsOnly: true`, so the
  number rendered is always a verified count. Driver win counts of zero in the
  2026 standings are facts, not silent fabrication — the seed file documents
  the cross-check (12 winners = 12 rounds = Mercedes 8 + Ferrari 2 + McLaren 2).
- [PASS] All sources are documented in `lib/db/seed/DATA_SOURCES.md` with URLs
  and retrieval dates. Title counts are derived by counting year tables, not
  copying the Wikipedia summary (see "Failed approaches" #8).
- [PASS] Empty/non-applicable values use the editorial phrase "not recorded" /
  "No X yet" / "Title seasons in this archive" rather than numeric zeros.

### Responsive

- [PASS] Major pages use responsive grid utilities. Catalogue pages switch
  card columns at `sm:` and `lg:` breakpoints (drivers uses `sm:grid-cols-2
  lg:grid-cols-4`, cars/circuits `sm:grid-cols-2 lg:grid-cols-3`, teams
  `lg:grid-cols-2`). Tables collapse via horizontal scroll if their container
  shrinks; `now-season` rearranges the two standings side-by-side at `lg:grid-cols-2`.
- [PASS] No fixed-width tables wider than their container. Standings tables use
  `w-full`; column widths are flex/percent inside the table; the per-row `Link`
  components and `<th>` cells size by content.
- [PASS] Mobile menu functional. Trigger is `md:hidden` (so only shows on small
  viewports), opens a fullscreen Radix Dialog, focus trap + scroll lock + close
  on link click all in place.
- [PASS] Sticky header shrinks the desktop nav to `hidden … md:flex` so it
  disappears at small widths; theme toggle and mobile-menu trigger remain visible.
- [PASS] `lib/constants/eras.ts` defines eras with fluid `clamp()`-based display
  sizes in `app/globals.css` (`--text-display-{sm,md,lg}`, `--text-hero`), so the
  hero never overflows a 320 px viewport.

### Performance

- [PASS] Large lists paginated through DAL functions: every `list*` accepts a
  `{ limit, offset }` and forwards it to Drizzle (`listCars`, `listDrivers`,
  `listTeams`, `listCircuits`, `listSeasons`, `listSeasonsForCatalog`). The
  detail home sections cap to 6 rows; archive stats returns single counts.
- [PASS] Parallel queries where independent: `app/(marketing)/page.tsx:31`
  issues 6 reads via `Promise.all`; detail pages split into `Promise.all([a, b])`
  pairs (e.g. season detail: `[season, standings]`); all `get*FilterOptions`
  helpers do the same. The session-pooler + `max: 1` choice in `lib/db/index.ts`
  makes this concurrency safe (see "Failed approaches" #9 for the full history).
- [PASS] No obvious O(n²) per request. The heaviest in-page operation is the
  team-evolution dedup in `app/teams/[slug]/page.tsx`, which is `O(seasons ×
  cars + seasons × driverTeamSeasons)` — bounded by the seasons the archive
  holds for that team. Acceptable.
- [PASS] No `loading.tsx` boundary (deliberate — see "Failed approaches" #12),
  no `setTimeout`/`setInterval` in render paths, search uses `useTransition` +
  a 250 ms debounce for typing.

### Visual consistency

- [PASS] All Eyebrows are styled with `font-mono text-[0.7rem] tracking-[0.14em]
  uppercase` (or the `spec-label` utility which composes the same). Variants
  seen in the wild (`text-[0.65rem]` for table headers / image-frame captions,
  `text-[0.6rem]` for fine-print captions, `tracking-[0.16em]` for nav, and
  `tracking-[0.12em]` for form-control labels) are intentional size adjustments
  for context, not a missing base style.
- [PASS] All Display components use the `Display` primitive
  (`components/ui/typography.tsx`). Confirmed across all detail and catalogue
  pages and every home section.
- [PASS] Container / Section wrappers from `components/ui/container.tsx` used
  consistently. Detail and catalogue pages render inside `<Container><Section>`;
  the home sections each wrap in `<Section><Container>` and the editorial
  statement inverts the order (`<Container><Display>` inside `<Section>`) only
  for the prose block, which is intentional.
- [PASS] Buttons used only through the `<Button>` primitive (`components/ui/button.tsx`).
- [PASS] Section headings on home go through `SectionHeader` so each block has
  a consistent eyebrow + title + view-all link.

### Project rules

- [PASS] No `loading.tsx` files anywhere in the project. `find … -name loading.tsx`
  returns no results.
- [PASS] No leftover TODO / FIXME / HACK comments in production paths. The only
  `TODO` matches in the repo are inside `package-lock.json` (a hash coincidence
  inside an unrelated integrity string) and a single mention in `MASTERPROMPT.md`
  ("don't leave obvious TODOs without fixing").
- [PASS] No unrequested new dependencies. `package.json` `dependencies` and
  `devDependencies` are unchanged this pass.
- [PASS] No `console.log` in production paths. The only `console.*` calls are in
  `lib/db/seed/seed.ts` and `lib/db/seed/verify.ts` — both are CLI scripts invoked
  via `npm run db:*`, never imported by app routes or components.
- [PASS] `placeholder-page.tsx` is now unused (no remaining imports in `app/` or
  `components/`). It is left in place for now; the "Important notes" section
  already flags it for removal once the next commit touches it.
- [PASS] No modifications to schema, layouts, navigation, routes, or package.json.

### Notes & known gaps (informational, not blocking)

- `npm run build` was attempted locally as part of the QA pass and fails at the
  static-params stage (every detail page issues `list*Slugs()` during build).
  In this sandboxed environment `.env.local` is a placeholder; with the real
  Supabase session-pooler URL that `PROJECT_STATE.md` records, build completes.
  This is environmental, not a regression introduced by this pass.
- The README mentions `framer-motion` / `gsap` as future deps; none are
  installed and none are required for the MVP milestone set. Not a fail.
- `app/(marketing)/page.tsx` and the other pages still work after the
  `season.worldChampionDriver` refactor — verified with a clean `tsc --noEmit`,
  `eslint`, and `prettier --check`.
