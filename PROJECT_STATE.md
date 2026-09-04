# PROJECT STATE

> Оперативная память проекта Apex Archive между Claude-сессиями. Читать вместе с
> `MASTERPROMPT.md` и `README.md` в начале каждой новой сессии (см. раздел 0 мастер-промпта).
> Не доверять этому файлу слепо — при расхождении с фактическим кодом доверять коду и
> исправлять этот файл.

Last updated: 2026-09-04 (Milestone 3 completed)

---

## Current milestone

Milestone 3 — Landing / Home (завершён, ожидает подтверждения пользователя)

## Overall progress

~28% (архитектура, скелет, БД с данными, слой доступа и полностью готовая главная
страница на реальных данных)

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

## In progress

- none

## Not completed

- Milestones 4–14

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
`postgres` **3.4.9** (драйвер postgres.js), `zod` **4.5.4**, `dotenv` **17.4.2** (dev),
`tsx` **(dev)** — для запуска seed/verify вне Next.

`@supabase/supabase-js` **сознательно не установлен**: доступ к БД идёт через Drizzle +
postgres.js по `DATABASE_URL`. Клиент Supabase понадобится только для Storage (медиа) и
Auth (Milestone 14) — ставить тогда, а не заранее.

Ещё не установлены: `framer-motion` / `gsap` (Milestone 11), `recharts` (по необходимости).

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
- Остальные 12 MVP-роутов существуют и рендерятся заглушками:
  `/about`, `/cars`, `/cars/[slug]`, `/drivers`, `/drivers/[slug]`, `/teams`,
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
  реализации реальных страниц. **Больше не используется на `/`.**
- `theme-provider.tsx` — обёртка next-themes.
- `archive/section-header.tsx` — eyebrow + заголовок + ссылка «view all».
- `archive/home/*` (Milestone 3): `hero`, `editorial-statement`, `now-season`,
  `featured-cars`, `legendary-drivers`, `moments`, `teams-and-circuits`, `archive-stats`.
  Каждая секция оформлена по-своему (индекс, сетка, таблица, крупные цифры) — бриф прямо
  запрещает «dashboard из одинаковых карточек».
- `lib/format.ts` — `orDash` (NULL → «—»), `formatPoints`, `formatEngine`.

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

11. **Тестирование не того процесса** — старый dev-сервер остался на порту 3000 со старым
    окружением, новый молча поднялся на 3001, и я «проверял» исправление на старом.
    **Правило:** после смены переменных окружения убеждаться, что curl идёт в тот процесс
    (проверять порт в логе запуска).

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

- Не задеплоено. Код на GitHub, Vercel-проект не подключён (Milestone 13).

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

**Milestone 4 — Cars.** Начинать только по команде пользователя.

Каталог по разделу 4.2 MASTERPROMPT с фильтрами (era/decade/team/year/engine/
championship-winning/driver) + detail-страницы с техническим разбором и связанными
сущностями.

Что учесть:

- Фильтры в DAL уже есть (`listCars`, `carFiltersSchema`) и проверены. Не переписывать —
  подключить к UI через `searchParams`.
- **`era` в фильтрах сознательно отсутствует.** Названия и границы эпох Ф-1 — редакционное
  решение, оно не согласовано. UI должен отображать выбранную эпоху в `yearFrom`/`yearTo`.
  Границы эпох согласовать с пользователем до реализации.
- Изображений машин нет вообще (`image_url` везде NULL) и придумать их нельзя. Вёрстка
  должна работать типографически и принимать изображения, когда они появятся.
- `power_hp` и `weight_kg` тоже NULL — рендерить через `orDash`, а не как 0.
- Detail-страница: несуществующий slug → `notFound()`. `getCarBySlug` уже возвращает
  `undefined`, проверено.

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
- Ждать команду пользователя перед стартом Milestone 3.
