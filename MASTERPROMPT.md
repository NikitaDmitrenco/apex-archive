# MASTERPROMPT.md — Apex Archive

> Это самодостаточный мастер-промпт для Claude Code, разрабатывающего проект **Apex Archive**.
> Прочитай этот файл целиком перед тем, как писать любой код. Если ты — новая Claude-сессия,
> подключённая к этому репозиторию, начни с раздела **"0. Старт новой сессии"**.

---

## 0. Старт новой сессии — ОБЯЗАТЕЛЬНЫЙ ПРОТОКОЛ

При каждом новом чате, прежде чем писать код:

1. Прочитай `MASTERPROMPT.md` (этот файл) целиком.
2. Прочитай `PROJECT_STATE.md`.
3. Прочитай `README.md`, если он существует.
4. Выполни `git log --oneline -20` и `git status`.
5. Просмотри фактическую структуру репозитория (`ls`, `tree`, содержимое `src/` или `app/`).
6. Сопоставь то, что написано в `PROJECT_STATE.md`, с тем, что реально есть в коде.
7. **Не доверяй `PROJECT_STATE.md` слепо.** Если файл утверждает, что milestone завершён, а
   код этого не подтверждает (нет нужных файлов, build падает, функциональность не работает) —
   доверяй факту, а не документу. Исправь `PROJECT_STATE.md`, отметь расхождение в отчёте.
8. Определи последний **фактически завершённый** milestone.
9. Продолжай **только следующий** milestone по порядку — если пользователь явно не указал иное.
10. Если пользователь просто написал "продолжать" (или эквивалент) — это команда перейти
    к следующему невыполненному milestone, и только к нему одному.

Если репозиторий пуст (только что создан) — начинай с Milestone 0.

---

## 1. Проект: суть и цель

**Название:** Apex Archive
**Слоган:** The machines. The drivers. The circuits. The stories.

Apex Archive — это премиальный интерактивный **digital archive / visual encyclopedia** о
Formula 1. Это не фан-сайт, не копия IMDb, не dashboard со статистикой. Это цифровой музей,
где пользователь исследует историю F1 через **связанные сущности**: автомобили, пилоты,
команды, трассы, сезоны, гонки, чемпионаты, технические детали, исторические события,
editorial-статьи.

Ключевая ценность продукта — **связность архива** (навигация между сущностями) и
**визуальное качество представления истории**.

Пример пользовательского пути: Mercedes 2026 → пилот → автомобиль → тех. характеристики →
сезон → трассы сезона → историческая эпоха → более старые машины и чемпионаты.

### Визуальная концепция

Swiss editorial design + automotive design + digital museum. Характеристики: premium,
minimal, editorial, cinematic, technical, много whitespace, крупная типографика, крупные
изображения, тонкие линии, точные технические подписи, сдержанные анимации, качественный
dark mode, полная адаптивность.

**Явно избегать:** типичный "красный F1-сайт", избыточный glassmorphism, neon UI, dashboard
из одинаковых карточек, чрезмерное скругление углов, визуальный шум.

Ориентир по духу (не копировать буквально): сайты премиальных автомобильных брендов,
дизайн-музеев, серьёзных editorial-изданий (Zeit Online, Pentagram, Bloomberg Graphics).

---

## 2. Технологический стек (зафиксирован, не менять без согласования с пользователем)

| Слой | Технология |
|---|---|
| Frontend framework | Next.js 15 (App Router) — см. примечание ниже |
| UI runtime | React 19 |
| Язык | TypeScript (strict mode) |
| Стили | Tailwind CSS 4 |
| UI-компоненты | shadcn/ui |
| Анимации (сложные, timeline) | GSAP |
| Анимации (UI, переходы, layout) | Framer Motion |
| 3D (optional, Milestone 14) | Three.js + React Three Fiber |
| Backend | Next.js Route Handlers / Server Actions (без отдельного Express/NestJS) |
| База данных | PostgreSQL через Supabase |
| ORM | Drizzle ORM |
| Аутентификация (nice-to-have) | Supabase Auth |
| Файлы/медиа | Supabase Storage |
| Графики | Recharts |
| Поиск (MVP) | PostgreSQL Full-Text Search (`tsvector`/`tsquery`) |
| AI (optional, Milestone 14) | OpenAI API |
| Деплой | Vercel |
| VCS | GitHub (owner: `NikitaDmitrenco`) |

### Важное исправление относительно исходного брифа

Бриф указывал "Next.js 16". На момент написания этого документа стабильная и широко
поддерживаемая версия — **Next.js 15.x** (App Router, React 19 совместим). Если на момент
начала работы в npm registry уже доступен стабильный (не canary/RC) Next.js 16 —
использовать его. Если нет — использовать последнюю стабильную 15.x и зафиксировать точную
версию в `PROJECT_STATE.md`. **Не устанавливать canary/beta/RC-версии фреймворка в проект,
предназначенный для production MVP.** Проверить фактически доступную стабильную версию
командой `npm view next versions --json` перед `create-next-app` на Milestone 1.

Аналогично: если на момент работы Tailwind CSS 4 ещё не стабилен или ломает совместимость
с shadcn/ui генератором компонентов — зафиксировать в `PROJECT_STATE.md` причину и либо
подождать стабильности, либо временно использовать последнюю стабильную Tailwind 3.x с
явным планом апгрейда. Приоритет — рабочий стек, а не номер версии ради номера версии.

### Почему стек оставлен как есть (без Express/отдельного backend, без сложного search-движка)

- Next.js Server Actions + Route Handlers полностью достаточны для MVP CRUD/read операций
  над архивом. Отдельный backend добавил бы инфраструктурную сложность без необходимости.
- PostgreSQL FTS достаточен для MVP-поиска по сущностям архива (десятки-сотни записей).
  Данные и API спроектированы так, чтобы **search-слой можно было заменить** (например, на
  Meilisearch/Algolia/pgvector) без изменения контрактов данных — см. раздел 7.9.
- Drizzle ORM выбран за типобезопасность и совместимость с Supabase Postgres без лишней
  магии (в отличие от Prisma, не требует отдельного бинарника/generate-шага, блокирующего
  edge-совместимость).

---

## 3. Структура сайта и навигация

Верхний уровень навигации (неизменен на протяжении MVP):

```
APEX

Archive
Cars
Drivers
Teams
Circuits
Seasons

Search
About
```

На мобильных — полноэкранное меню (fullscreen overlay), не выпадающий dropdown.

---

## 4. Функциональные разделы (полное описание)

Ниже — сохранённое из исходного брифа полное функциональное описание. Оно не сокращено —
Claude, разрабатывающий проект, должен ссылаться на этот раздел на протяжении всех
milestone'ов, а не додумывать функциональность.

### 4.1 Landing / Home
Полноэкранный hero. Пример контента:
```
APEX
ARCHIVE

FORMULA 1 · 1950 — 2026
```
Крупное визуальное представление автомобиля. При скролле — переходный editorial-блок:
```
THE FASTEST
SPORT IN THE WORLD
HAS A LONG MEMORY.
```
Далее блоки: featured cars, legendary drivers, historical moments, important teams,
circuits, current season, archive statistics. Отдельный блок "NOW — 2026 SEASON" с текущими
standings.

### 4.2 Cars
Каталог с фильтрами: era, decade, team, year, engine, championship-winning, driver.
Карточка: изображение, название, год, команда, ключевые характеристики (пример: "FERRARI
F2004 · 2004 · V10 · 3.0L · ~900 HP"). Detail page: крупное изображение, technical
specifications, season, team, drivers, wins, poles, championship info, technical breakdown
(front wing, suspension, engine, rear wing, tyres, chassis — визуально), связанные сущности.

### 4.3 Drivers
Каталог. Detail page: portrait, имя, nationality, current/historical team, championships,
wins, poles, podiums, career statistics, career timeline, seasons, cars, teams. Пример:
"LEWIS HAMILTON · 7× WORLD CHAMPION · 105 WINS · 104 POLES...".

### 4.4 Teams
Каталог. Detail page: "FERRARI · 1950 — PRESENT", championships, wins, poles, drivers, cars,
seasons, timeline. Желательно (не MVP-блокер): team evolution — интерактивный timeline,
где выбор года меняет отображаемые связанные автомобили/материалы.

### 4.5 Circuits
Каталог. Detail page: "AUTODROMO NAZIONALE MONZA · 5.793 KM · 53 LAPS...", circuit layout,
location, length, turns, laps, race history, lap records, notable races, related seasons.
Nice-to-have: animated circuit visualization (точка/машина проходит трассу по SVG-пути).

### 4.6 Seasons
Архив по годам (2026 → 1950). Страница сезона: world champion, constructors champion,
calendar, races, standings, teams, drivers, statistics, notable events.

### 4.7 Comparison (Nice-to-have, Milestone 14)
Сравнение двух сущностей (например, Ferrari F2004 vs Mercedes W11) по общим атрибутам:
year, engine, power, weight, wins, poles, championships, driver, team. Желательно —
визуальное сравнение, не только таблица.

### 4.8 History (Nice-to-have, Milestone 14)
Интерактивный timeline эпох F1 (1950 The Beginning → 2026 A New Technical Era, и другие
ключевые точки из брифа).

### 4.9 Stories (Nice-to-have, Milestone 14)
Editorial-раздел: The Rivalries, The Machines, The Moments. Long-form контент с крупными
изображениями, типографикой, scroll-анимациями.

### 4.10 Search (MVP)
Глобальный поиск по архиву, результаты сгруппированы по типу сущности (CARS / DRIVERS /
TEAMS / SEASONS / CIRCUITS). Поддержка релевантных связанных сущностей в выдаче.

### 4.11 AI Archive Assistant (Nice-to-have, Milestone 14, последний)
НЕ чатбот ради чатбота. Структурированные запросы к данным архива на естественном языке
("Show me Ferrari cars that won the championship between 1990 and 2010", "Compare
Schumacher's 2004 season with Hamilton's 2020 season"). Реализуется поверх готовой БД и
data access layer — только после того, как эти данные существуют и корректны.

---

## 5. MVP: обязательный scope

### MUST HAVE (Milestones 1–13)
Landing, Cars (каталог + detail), Drivers (каталог + detail), Teams (каталог + detail),
Circuits (каталог + detail), Seasons (архив + detail), Global Search, фильтры в каталогах,
базовая статистика на detail-страницах, полностью responsive design, осмысленные анимации,
production deployment.

### NICE TO HAVE (только Milestone 14, после полного MVP)
Comparison, Interactive History Timeline, 3D car viewer, AI Archive Assistant, Favorites,
User accounts (Supabase Auth).

**Жёсткое правило:** ни один Nice-to-have пункт не начинается, пока весь MUST HAVE scope
(Milestones 0–13) не завершён и не подтверждён пользователем.

---

## 6. Данные: источники и достоверность

**Запрещено выдумывать статистику.** Особенно: wins, poles, championships, lap records,
технические характеристики, результаты гонок, статистику пилотов.

Правило при работе с реальными данными:
1. Использовать авторитетные источники (официальные архивы F1, устоявшиеся статистические
   базы данных вроде общепризнанных F1-статистических сайтов, Wikipedia как вторичная сверка).
2. Если источник неизвестен или данные конфликтуют между источниками — **не угадывать**.
3. Зафиксировать проблему в `PROJECT_STATE.md` (раздел "Known issues" / "Data uncertainty").
4. Явно пометить неопределённость в самих данных (например, поле `data_confidence` или
   комментарий в seed-файле), а не молча вставлять правдоподобное число.
5. Выбрать наиболее авторитетный из доступных источников и **задокументировать это решение**
   (какой источник, почему).
6. Для MVP разработки/вёрстки допустимо использовать явно помеченные placeholder/seed-данные
   (небольшой курируемый набор — 15–30 автомобилей, 15–30 пилотов, 8–10 команд, 10–15 трасс,
   несколько сезонов) с пометкой в схеме/seed-скрипте, что это placeholder-набор для
   разработки, который предстоит верифицировать/расширить отдельно. Это не равно "выдумать
   статистику" — это осознанно ограниченный, помеченный starter-набор реальных данных.

---

## 7. Архитектура

### 7.1 Принцип
Простота предпочтительнее сложности. Не overengineer. Архитектура должна позволять
продолжить разработку в новом чате без потери контекста — см. `PROJECT_STATE.md`.

### 7.2 Разделение данных
- **Static content** (UI copy, навигация, дизайн-константы) — в коде (TS-константы/JSON),
  версионируется в Git.
- **Structured data** (drivers, teams, cars, circuits, seasons, races, results, связи) —
  в PostgreSQL через Drizzle.
- **Media** (изображения, портреты, схемы трасс) — Supabase Storage, ссылки хранятся в БД.

Архитектура должна допускать обновление данных без переписывания frontend-компонентов
(компоненты получают данные через типизированный data access layer, а не хардкод).

### 7.3 Предполагаемая структура БД (уточняется на Milestone 0/2)
Базовые таблицы: `drivers`, `teams`, `cars`, `circuits`, `seasons`, `races`, `results`,
`championships`, `articles`.
Дополнительно при необходимости (не создавать заранее без явной надобности):
`users`, `favorites`, `driver_team_seasons` (many-to-many связь пилот↔команда↔сезон),
`car_stats`, `driver_stats`, `team_stats`, `circuit_stats`.

Схема должна быть нормализована (3NF для реляционных данных, с явными junction-таблицами
для many-to-many связей типа driver↔team↔season), но не избыточна. Итоговую ER-схему
зафиксировать в `PROJECT_STATE.md` на Milestone 0/2 и обновлять при изменениях.

### 7.4 Примерная файловая структура (Next.js App Router)
```
apex-archive/
  app/
    (marketing)/            # landing, about
    cars/
      page.tsx              # каталог
      [slug]/page.tsx        # detail
    drivers/
      page.tsx
      [slug]/page.tsx
    teams/
      page.tsx
      [slug]/page.tsx
    circuits/
      page.tsx
      [slug]/page.tsx
    seasons/
      page.tsx
      [year]/page.tsx
    search/
      page.tsx
    api/                     # route handlers (если нужны, помимо server actions)
  components/
    ui/                      # shadcn-компоненты
    archive/                 # доменные компоненты (CarCard, DriverHero, ...)
    layout/                  # Nav, Footer, MobileMenu
  lib/
    db/
      schema.ts              # Drizzle schema
      queries/                # data access layer, по сущностям
      migrations/
    validation/               # zod-схемы
    utils/
  types/
  content/                    # static/editorial content, если нужно
  public/
  drizzle.config.ts
  .env.example
  MASTERPROMPT.md
  PROJECT_STATE.md
  README.md
```
Это отправная точка, а не догма — окончательную структуру закрепить на Milestone 0/1 и
задокументировать в `PROJECT_STATE.md`.

### 7.5 Роуты (MVP)
`/`, `/cars`, `/cars/[slug]`, `/drivers`, `/drivers/[slug]`, `/teams`, `/teams/[slug]`,
`/circuits`, `/circuits/[slug]`, `/seasons`, `/seasons/[year]`, `/search`, `/about`.

### 7.6 Data access layer
Все запросы к БД инкапсулированы в `lib/db/queries/*` с типизированными функциями
(например, `getCarBySlug`, `listCarsByFilters`), возвращающими типизированные DTO. Компоненты
и Server Actions/Route Handlers не пишут "сырые" Drizzle-запросы напрямую — они вызывают
data access layer. Это даёт возможность заменить источник данных позже без переписывания UI.

### 7.7 Валидация
Входные данные (query-параметры фильтров, формы, если появятся) валидируются через Zod на
границе (Server Action / Route Handler), до похода в БД.

### 7.8 Error/loading/empty states
Для каждой роут-группы — `loading.tsx`, `error.tsx`, явные empty-state UI при пустой
выдаче фильтра/поиска. Не оставлять "белый экран" или необработанное исключение.

### 7.9 Search-слой
MVP: PostgreSQL FTS (`tsvector` колонка + GIN-индекс) по ключевым сущностям, объединённая
через `UNION`-запрос или отдельные запросы по типам с последующей группировкой на уровне
приложения. Data access layer для поиска (`lib/db/queries/search.ts`) должен быть
единственной точкой входа, чтобы замена движка (Meilisearch/Algolia/pgvector) в будущем не
требовала изменений в UI-компонентах.

### 7.10 Accessibility & SEO
Semantic HTML, корректные landmark-роли, alt-тексты для изображений (особенно важно —
архив состоит из фото машин/пилотов), контраст текста в dark mode проверяется вручную,
keyboard-навигация по каталогам и меню. SEO: метаданные через Next.js Metadata API на
каждой detail-странице (title/description на основе сущности), Open Graph изображения —
как минимум статичный fallback для MVP.

---

## 8. Git workflow

- Owner репозитория: `NikitaDmitrenco`. Два разработчика могут работать параллельно —
  структура веток должна это учитывать.
- Ветки: `main` — стабильная, деплоится. Feature-ветки: `feat/cars-catalog`,
  `feat/search`, `fix/circuit-data-mapping` и т.п. Не работать напрямую в `main` после
  Milestone 1 (как только появляется CI/деплой на Vercel).
- Коммиты — атомарные, по одной логической единице. Формат commit message —
  Conventional Commits:
  ```
  feat(cars): add car archive listing
  feat(cars): add car detail page
  feat(search): add global archive search
  fix(circuits): correct circuit data mapping
  chore(db): add drizzle migration for teams table
  ```
  Не делать коммиты вида "update project", "fix stuff", "wip".
- Pull Request — при работе с двумя разработчиками, либо при завершении milestone, если
  пользователь просит формальный PR-flow. Если разработка идёт от одного лица через Claude
  Code в одной ветке — допустимы прямые коммиты в feature-ветку с последующим merge в
  `main` по команде пользователя, но **не push в `main` напрямую без явного разрешения**.
- `.gitignore` обязателен с первого коммита (Milestone 1): `node_modules`, `.next`, `.env`,
  `.env.local`, `.vercel`, `*.log`, `.DS_Store` и т.д.
- `.env.example` — обязателен, содержит **имена** переменных без значений/с плейсхолдерами.
- **Никогда не коммитить:** API keys, Supabase service role key, OpenAI API key, Vercel
  tokens, пароли, любые секреты. Перед каждым коммитом, затрагивающим конфиг/env-файлы —
  визуально проверить diff (`git diff --staged`) на предмет случайных секретов.
- README.md поддерживается в актуальном состоянии: как запустить проект локально, какие
  env-переменные нужны, как накатить миграции, как задеплоить.

---

## 9. Supabase / Vercel — конфигурация

- Supabase project: `https://supabase.com/dashboard/project/graglvzassyzsyedraex`.
  Использовать этот проект для PostgreSQL БД, Storage, (опционально) Auth.
- Vercel account: `vercel.com/nikita-7472`. Проект готовится к деплою на Vercel, но
  **фактический connect репозитория к Vercel-проекту и ввод production-секретов выполняет
  пользователь вручную** (создание аккаунтов/подключение интеграций — вне полномочий Claude
  согласно политике безопасности; Claude готовит конфигурацию, инструкции и
  `.env.example`, не запрашивает и не вводит реальные ключи).
- Env-переменные не хардкодятся нигде в коде. Все — через `process.env`, с валидацией
  наличия обязательных переменных при старте (например, через небольшой `lib/env.ts`
  с явной проверкой).
- Обязательные переменные в `.env.example` (уточнить и дополнить на Milestone 0/2, минимум):
  ```
  DATABASE_URL=
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_ANON_KEY=
  SUPABASE_SERVICE_ROLE_KEY=
  OPENAI_API_KEY=
  ```
- Production-секреты хранятся исключительно в Vercel Environment Variables и локальном
  `.env.local` (в `.gitignore`), никогда — в репозитории.

---

## 10. Milestones

Каждый milestone имеет фиксированную структуру: Goal, Tasks, Expected result, Acceptance
criteria, Validation, Potential risks, Definition of Done.

### КРИТИЧЕСКОЕ ПРАВИЛО
**Claude не проходит несколько milestone подряд самостоятельно.** После завершения
milestone: (1) остановиться, (2) проверить результат по Definition of Done,
(3) обновить `PROJECT_STATE.md`, (4) выдать отчёт в формате из раздела 12,
(5) ждать команды пользователя. Следующий milestone начинается только по команде
`продолжать` (или явному эквиваленту, включая явное указание номера milestone).

---

### Milestone 0 — Project Audit & Architecture

**Goal:** Убедиться в исходном состоянии репозитория и зафиксировать архитектурные решения
до написания кода приложения.

**Tasks:**
- Проверить фактическое состояние репозитория (пустой/частично начат).
- Проверить доступные версии ключевых зависимостей (Next.js, React, Tailwind) —
  зафиксировать точные версии, которые будут использоваться.
- Подтвердить/скорректировать структуру БД (раздел 7.3) и роуты (раздел 7.5).
- Зафиксировать финальную файловую структуру проекта (раздел 7.4) в `PROJECT_STATE.md`.
- Подготовить список env-переменных под `.env.example`.
- Определить design tokens на верхнем уровне: цветовая палитра (dark mode как основной или
  паритетный режим — уточнить у пользователя, если не очевидно), шрифтовые пары (crisp
  sans для UI + возможен serif/display для editorial-заголовков), базовая типографическая
  шкала, spacing-шкала.
- Не писать код приложения на этом этапе, кроме служебных конфигурационных файлов, если
  они нужны для фиксации решений (например, черновик `drizzle.config.ts` без применения).

**Expected result:** Документированное архитектурное решение в `PROJECT_STATE.md`,
готовность приступить к Milestone 1 без дальнейших открытых вопросов по архитектуре.

**Acceptance criteria:** Все пункты Tasks отражены в `PROJECT_STATE.md` разделами
"Architecture decisions" и "Database status" (схема, пусть ещё не применённая).

**Validation:** Review документа пользователем.

**Potential risks:** Недостаточно исходных данных о реальных F1-данных — решается
использованием курируемого placeholder-набора (раздел 6, пункт 6).

**Definition of Done:** `PROJECT_STATE.md` обновлён, архитектурные решения зафиксированы,
пользователь проинформирован отчётом, ожидание команды `продолжать`.

---

### Milestone 1 — Project Foundation

**Goal:** Рабочий скелет Next.js-приложения с дизайн-системой и навигацией, без реальных
данных.

**Tasks:**
- Инициализировать Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui.
- Настроить `.gitignore`, `.env.example`, инициализировать git-репозиторий, первый коммит.
- Базовый layout: `app/layout.tsx`, шрифты, dark mode (via `next-themes` или эквивалент),
  root providers.
- Navigation: десктоп-версия верхнего меню (раздел 3) + fullscreen mobile menu.
- Footer (минимальный, editorial-стиль).
- Базовые reusable UI-примитивы поверх shadcn (Button, Container/Section wrapper,
  Typography-компоненты для крупных заголовков в стиле бренда).
- Пустые placeholder-страницы для всех MVP-роутов (раздел 7.5), чтобы навигация была
  кликабельна целиком, даже без данных.
- ESLint + Prettier (или эквивалент) настроены и проходят.

**Expected result:** `npm run dev` поднимает приложение, навигация работает между всеми
заглушками, тема (dark/light) переключается, дизайн уже отражает editorial/premium
направление (не default shadcn-вид).

**Acceptance criteria:** Все MVP-роуты существуют и рендерятся без ошибок; mobile menu
работает на узких вьюпортах; TypeScript strict проходит без ошибок.

**Validation:** `tsc --noEmit`, `next lint`, `next build`, ручная проверка в браузере
(desktop + mobile viewport).

**Potential risks:** Несовместимость конкретных версий Tailwind 4 / shadcn CLI — если
возникнет, зафиксировать проблему и решение в `PROJECT_STATE.md` (раздел "Failed
approaches" при необходимости отката на Tailwind 3.x).

**Definition of Done:** См. раздел 11 (общий Definition of Done) — выполнен полностью,
`PROJECT_STATE.md` обновлён, отчёт выдан, ожидание команды.

---

### Milestone 2 — Database & Data Layer

**Goal:** Рабочая PostgreSQL-схема в Supabase, миграции, seed-данные, типизированный data
access layer.

**Tasks:**
- Подключить Drizzle ORM к Supabase Postgres (`DATABASE_URL`).
- Реализовать схему из раздела 7.3 (финализированную на Milestone 0) в `lib/db/schema.ts`.
- Сгенерировать и применить миграции.
- Подготовить курируемый seed-набор реальных данных (раздел 6, пункт 6) — с явной пометкой
  источника для каждой группы данных (комментарий в seed-скрипте или отдельный
  `DATA_SOURCES.md`).
- Реализовать data access layer (`lib/db/queries/*`) для всех базовых сущностей: cars,
  drivers, teams, circuits, seasons — минимум list/getBySlug/getByFilters.
- Настроить `tsvector`-колонки и индексы для будущего FTS-поиска (Milestone 9), даже если
  UI поиска ещё не реализован.
- Типы (TS types/Zod schemas) для всех сущностей, синхронизированные со схемой БД.

**Expected result:** База наполнена курируемыми seed-данными, `lib/db/queries` покрывает
базовые сущности и покрыт минимальной проверкой (ручной вызов/скрипт печатает результат).

**Acceptance criteria:** Миграции применяются идемпотентно; seed-скрипт воспроизводим;
запрос к каждой сущности через data access layer возвращает корректно типизированные данные.

**Validation:** `tsc --noEmit`, ручной прогон seed + выборочных queries, проверка данных
на отсутствие "выдуманной" статистики (см. раздел 6).

**Potential risks:** Конфликт данных между источниками — фиксировать по протоколу раздела 6.

**Definition of Done:** Общий (раздел 11) + БД доступна из приложения, схема
задокументирована в `PROJECT_STATE.md`.

---

### Milestone 3 — Landing / Home
Полностью законченная главная страница (раздел 4.1) на реальных seed-данных: hero,
editorial-переход при скролле, featured-блоки, блок "NOW — 2026 SEASON".

**Definition of Done:** Общий (раздел 11) + страница полностью соответствует разделу 4.1,
адаптивна, использует реальные (не заглушечные) данные из БД.

---

### Milestone 4 — Cars
Каталог (раздел 4.2) с фильтрами (era/decade/team/year/engine/championship-winning/driver)
+ detail pages с technical breakdown и связанными сущностями.

**Definition of Done:** Общий (раздел 11) + фильтры реально фильтруют данные из БД,
detail page отражает все поля из раздела 4.2, связанные сущности кликабельны.

---

### Milestone 5 — Drivers
Каталог + detail pages (раздел 4.3) со статистикой карьеры, career timeline, связями с
cars/teams/seasons.

**Definition of Done:** Общий (раздел 11) + все поля раздела 4.3 отражены, навигация к
связанным cars/teams/seasons работает.

---

### Milestone 6 — Teams
Каталог + detail pages (раздел 4.4). Team evolution timeline — best effort в рамках MVP,
если не укладывается по времени — зафиксировать как перенесённое в Milestone 14 с явным
объяснением в отчёте (это не блокирует MVP, так как явно обозначено как "очень желательно",
не "must have" в исходном разделе 7 брифа).

**Definition of Done:** Общий (раздел 11) + все обязательные поля раздела 4.4 отражены.

---

### Milestone 7 — Circuits
Каталог + detail pages (раздел 4.5). Animated circuit visualization — nice-to-have внутри
milestone; если не укладывается, зафиксировать перенос в Milestone 14 аналогично Teams.

**Definition of Done:** Общий (раздел 11) + все обязательные поля раздела 4.5 отражены.

---

### Milestone 8 — Seasons
Архив сезонов + detail page (раздел 4.6): world champion, constructors champion, calendar,
races, standings, statistics, notable events.

**Definition of Done:** Общий (раздел 11) + все поля раздела 4.6 отражены, навигация
сезон↔гонки↔трассы↔пилоты↔команды работает.

---

### Milestone 9 — Global Search
Реализация поиска (раздел 4.10) поверх PostgreSQL FTS, сгруппированная выдача по типам
сущностей, переход из результатов на detail-страницы.

**Definition of Done:** Общий (раздел 11) + поиск возвращает релевантные результаты по
всем сущностям, empty-state для пустой выдачи, debounce/производительность приемлема.

---

### Milestone 10 — Integration & Relationships
Явная проверка и укрепление связей: Drivers↔Teams, Drivers↔Cars, Cars↔Teams, Cars↔Seasons,
Seasons↔Races, Races↔Circuits, Teams↔Seasons. Убедиться, что из любой detail-страницы можно
дойти до любой связанной сущности за 1 клик, где это осмысленно.

**Definition of Done:** Общий (раздел 11) + пройден ручной "обход архива" по сценарию из
раздела 1 (Mercedes 2026 → пилот → автомобиль → тех.характеристики → сезон → трассы →
эпоха → старые машины) без разрывов навигации.

---

### Milestone 11 — Polish
Анимации (осмысленные, не ради анимаций — GSAP для крупных scroll/timeline-эффектов,
Framer Motion для UI-переходов), полная responsive-проверка всех страниц, accessibility
(keyboard nav, alt-тексты, контраст, landmark-роли), loading/empty/error states везде,
SEO-метаданные, базовая performance-проверка (Lighthouse/`next build` bundle size).

**Definition of Done:** Общий (раздел 11) + Lighthouse-прогон зафиксирован в
`PROJECT_STATE.md` (числа, не обязательно идеальные, но известные), все страницы имеют
loading/error/empty states.

---

### Milestone 12 — QA
Функциональное, визуальное, responsive-тестирование всех MVP-разделов; accessibility-
проверка; performance-проверка; проверка данных на корректность (нет "выдуманной"
статистики, все источники задокументированы); security review (secrets не в репозитории,
env корректно настроены, нет очевидных уязвимостей в Server Actions — валидация входа).

**Definition of Done:** Общий (раздел 11) + чеклист QA зафиксирован в `PROJECT_STATE.md`
с результатами по каждому пункту.

---

### Milestone 13 — Deployment
Финализация GitHub-репозитория, подключение к Vercel (пользователь выполняет
подключение/ввод секретов сам — см. раздел 9), настройка production env variables,
production build проверен локально (`next build` + `next start`), smoke-тесты на
задеплоенном URL (после того как пользователь подтвердит деплой).

**Definition of Done:** Общий (раздел 11) + приложение доступно на production URL,
smoke-тест пройден (главные роуты открываются, данные отображаются), `PROJECT_STATE.md`
содержит финальный deployment status.

**Важно:** Claude не должен пытаться самостоятельно вводить реальные production-секреты
или создавать Vercel/Supabase аккаунты/интеграции — это подпадает под действия, требующие
явного разрешения пользователя и работы с учётными данными (см. общую политику
безопасности). Claude готовит всё необходимое (конфигурацию, инструкции, checklist) и
инструктирует пользователя, что сделать вручную.

---

### Milestone 14 — Optional Features
Только после подтверждённого пользователем завершения MVP (Milestones 0–13). В порядке
приоритета (обсуждается с пользователем перед стартом, порядок не жёсткий):
Comparison → Interactive History Timeline → Favorites → User accounts → 3D car viewer →
AI Archive Assistant.

AI Archive Assistant реализуется поверх готового data access layer (раздел 7.6) —
структурирует запрос через OpenAI function calling/structured output в параметры, которые
подаются в существующие типизированные query-функции, а не в свободный SQL от LLM
напрямую (соображение безопасности и предсказуемости).

Каждый под-пункт Milestone 14 при желании пользователя дробится на собственные
под-milestones с тем же протоколом (Goal/Tasks/.../DoD, остановка после каждого, отчёт,
ожидание команды).

---

## 11. Общий Definition of Done (применяется к каждому milestone)

Milestone считается завершённым, только если **все** пункты выполнены:

- [ ] Код реализован согласно Tasks и функциональному описанию (раздел 4/раздел milestone'а).
- [ ] Приложение запускается (`npm run dev`) без ошибок.
- [ ] Нет блокирующих runtime-ошибок на реализованных страницах.
- [ ] `tsc --noEmit` проходит без ошибок.
- [ ] Линтер проходит без ошибок (warnings — по возможности minimize, не обязаны быть 0).
- [ ] `next build` (production build) проходит успешно.
- [ ] Функциональность реально работает (проверено запуском/просмотром, не только
      "код написан и выглядит правильно").
- [ ] Responsive-поведение проверено минимум на desktop + mobile viewport.
- [ ] Релевантные edge cases проверены (пустая выдача, отсутствующий slug → 404, и т.п.).
- [ ] `PROJECT_STATE.md` обновлён согласно разделу 13.
- [ ] Git-состояние понятно: изменения закоммичены атомарными коммитами с осмысленными
      сообщениями (раздел 8).
- [ ] Результат описан пользователю в формате отчёта (раздел 12).

Milestone **не** считается завершённым только потому, что код написан — обязательна
фактическая проверка запуском.

---

## 12. Формат отчёта после каждого milestone

После завершения (или блокировки) milestone Claude обязан выдать отчёт строго в этом
формате, а затем остановиться и ждать пользователя:

```
MILESTONE X — <Название>

Status: Completed / Partially completed / Blocked

What was done:
- ...

How it was implemented:
- ...

Files changed:
- ...

Database changes:
- ...

Routes added:
- ...

Validation:
- TypeScript: PASS/FAIL
- Lint: PASS/FAIL
- Build: PASS/FAIL
- Runtime: PASS/FAIL

What did not work:
- ...

Why:
- ...

Known issues:
- ...

Git:
- branch: ...
- commits: ...

Next milestone:
- ...

PROJECT_STATE.md updated: YES/NO
```

---

## 13. Обновление PROJECT_STATE.md

После **каждого** milestone (успешного, частичного или заблокированного) — обновить
`PROJECT_STATE.md`, включая не только успехи, но и проблемы:

- Что сделано — конкретные файлы, компоненты, роуты, таблицы, функции.
- Как сделано — краткое архитектурное решение.
- Что не получилось и почему.
- Какие подходы были испробованы и отклонены (чтобы не повторять их в новой сессии).
- Как решена проблема (если решена).
- Что осталось незавершённым.
- Что важно знать следующей Claude-сессии (любой контекст, который иначе будет потерян).

---

## 14. Что запрещено делать в рамках этого проекта

- Переписывать работающий код без явной причины/задачи.
- Менять зафиксированный стек (раздел 2) без согласования с пользователем.
- Создавать лишнюю инфраструктуру (отдельный backend-сервис, лишние БД, лишние очереди)
  без явной технической необходимости.
- Выдумывать статистику/данные F1 (раздел 6).
- Добавлять зависимости без необходимости — каждая новая зависимость должна быть оправдана
  задачей текущего milestone.
- Коммитить секреты любого рода.
- Пропускать валидацию входных данных в Server Actions/Route Handlers.
- Переходить к следующему milestone без явной команды пользователя.
- Считать milestone завершённым только на основании того, что код написан (без проверки
  запуском/build).
- Игнорировать ошибки `build`/`lint`/`typecheck` — они должны быть исправлены до отчёта о
  завершении milestone, либо явно задокументированы как известная блокирующая проблема со
  статусом "Blocked".
- Оставлять очевидные TODO без фиксации в `PROJECT_STATE.md`.
- Делать mock/заглушечную реализацию там, где функциональность заявлена как часть MVP —
  MVP-функциональность должна быть настоящей (реальные запросы к БД, реальная фильтрация,
  реальный поиск), а не имитацией.
- Ломать существующую работающую функциональность при добавлении новой (проверять регресс
  перед отчётом о завершении).

---

## 15. Порядок работы верхнего уровня

```
architecture → foundation → data → core pages → relationships → polish → QA → deployment
```
И только затем — optional features (AI, 3D, Comparison, Timeline, Favorites, Accounts).
Не начинать с визуальных эффектов до создания устойчивой архитектуры и данных.

---

*Конец MASTERPROMPT.md. Следующий шаг для любой новой сессии — раздел 0.*
