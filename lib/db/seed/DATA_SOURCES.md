# Data sources

Provenance for everything in the seed set. MASTERPROMPT section 6 forbids inventing
statistics; this file records where each group of numbers came from and what is still
unverified.

**The seed is a curated starter set, not a complete archive.** It exists so the interface
can be built against real records. Expanding and verifying it is separate work.

## The rule applied here

A value is written only when a source supports it. Where a figure could not be confirmed,
the column is left **NULL** rather than filled with a plausible number. Null means
"unknown", and the UI must render it as unknown — never as zero.

Every row carries `data_confidence`:

| Value         | Meaning                                                                       |
| ------------- | ----------------------------------------------------------------------------- |
| `verified`    | Checked against the source named below during this seed's preparation.        |
| `placeholder` | Identity is correct; some attributes are absent and await a verification pass. |
| `uncertain`   | Sources disagreed or the figure is layout/era dependent. Treat with suspicion. |

## Sources

### Championship titles — drivers and constructors

**Source:** Wikipedia, [List of Formula One World Drivers' Champions](https://en.wikipedia.org/wiki/List_of_Formula_One_World_Drivers%27_Champions)
and [List of Formula One World Constructors' Champions](https://en.wikipedia.org/wiki/List_of_Formula_One_World_Constructors%27_Champions),
retrieved 2026-09-04.

Title counts were **derived by counting the year-by-year champion tables**, not copied from
a summary. This matters: a first extraction of the aggregate summary returned Red Bull with
4 constructors' titles and Renault with 0, both wrong. Counting the year table gives Red
Bull 6 (2010–2013, 2022–2023) and Renault 2 (2005–2006), and reproduces the article's own
stated records for Ferrari (16), McLaren (10), Williams (9) and Mercedes (8).

Derived counts used in the seed are self-consistent with the season rows: any season in the
seed names the same champion the table does.

**Conflict resolved — the 2024 drivers' title.** A table extraction reported Lando Norris as
2024 champion. That contradicted the same extraction's own title tallies, which had collapsed
the four-time and three-time champion groups together. Checked against
[Formula1.com](https://www.formula1.com/en/latest/article/a-very-special-and-beautiful-season-verstappen-proud-after-joining-elites-as.4Q2zWcWyFVwbFgxdKJlOk8),
[CNN](https://edition.cnn.com/2024/11/24/sport/max-verstappen-wins-world-championship-las-vegas-spt-intl/index.html)
and [Sky Sports](https://www.skysports.com/f1/news/12433/13256251/max-verstappen-wins-2024-f1-world-title-as-red-bull-driver-closes-out-drivers-championship-at-las-vegas-gp):
**2024 went to Max Verstappen (Red Bull), his fourth title**, with Norris runner-up. The
first extraction was wrong and was discarded.

### The 2026 season — standings, grid and results

**Source:** [Formula1.com official results](https://www.formula1.com/en/results/2026/drivers) —
drivers' standings, constructors' standings and the race-by-race results — retrieved
2026-09-04.

**This is a dated snapshot, not a live feed.** The figures are current **after round 12, the
Dutch Grand Prix of 23 August 2026**. They are wrong the moment the next race finishes.
The season row's summary states the round the standings belong to, and the landing page
prints it. Re-run the seed with fresh figures after each race, or replace this snapshot with
a live source.

Cross-checks that passed before the numbers were accepted:

- The twelve listed race winners are Antonelli 6, Russell 2, Norris 2, Hamilton 1,
  Leclerc 1 — which sums to twelve, matching the twelve completed rounds.
- Those per-driver win counts aggregate to Mercedes 8, Ferrari 2, McLaren 2, which is what
  the constructors' table shows.

Driver win counts of zero here are facts, not unknowns: those drivers won none of the twelve
races. **Podium counts are omitted entirely** — the source table does not carry them, and the
standings columns are nullable precisely so an unknown tally is not recorded as zero.

**Conflict resolved — the 2025 drivers' title.** The same unreliable table extraction that
misreported 2024 also implied Norris held two titles. Checked against
[Formula1.com's race report](https://www.formula1.com/en/latest/article/norris-secures-maiden-f1-title-in-abu-dhabi-with-podium-finish-behind.EMJtmvRA0uzmzUC4MZgmw):
Norris won the 2025 championship by two points over Verstappen, and it was his **maiden**
title. So Norris has one, and Verstappen four.

Team lineage is recorded conservatively. Alpine shows zero constructors' titles even though
the Enstone entry's history includes Renault's 2005 and 2006 championships, because those
were won under a different constructor name; the row's bio says so rather than the number
implying it.

### Not seeded, deliberately

- **Career wins, poles, podiums, points and race starts.** These are published figures, but
  they were not verified row by row for this pass, so they are NULL. They are stored as
  columns rather than computed from `results`, because the archive seeds only a subset of
  races and aggregating that subset would understate a career while presenting the shortfall
  as fact.
- **Driver dates of birth** — not verified individually; NULL.
- **Car power, weight and technical breakdown** — manufacturers rarely publish exact figures
  and secondary sources disagree. Mostly NULL, marked `placeholder`.
- **The 2026 champions.** The season is in progress, so `world_champion_driver_id` and
  `constructors_champion_team_id` are NULL. That is the factual state, not missing data.
- **Renault as a constructor** — its works entries span several separate stints
  (1977–1985, 2002–2011, 2016–2020), which the current schema's single
  founded/dissolved pair cannot express honestly. Excluded from the seed rather than
  misrepresented.

### Team founding and closing years

Given only where the lineage is uncontested. Left NULL where a team's identity changed hands
or paused — Mercedes in particular has a works history split between the 1950s and 2010
onward, which a single `founded_year` would misstate. Marked `placeholder` where partial.

### Circuits

Circuit length and turn counts are layout dependent and change between revisions, so figures
here are marked `uncertain` unless taken from the project brief itself. Monza's
5.793 km / 53 laps comes from the specification in `MASTERPROMPT.md` section 4.5.

A dedicated verification pass against official circuit data should precede Milestone 7.

## Verification backlog

Before the archive is presented as authoritative:

1. Career totals for every driver, from a single consistent authoritative source.
2. Circuit lengths, turn counts and lap records, from official sources.
3. Car specifications, or a decision to present them only where a manufacturer published them.
4. Race-by-race results for the seeded seasons, which would let historical season standings
   be shown. Only 2026 currently has standings.
5. **Refreshing the 2026 standings after every race.** They are a snapshot, dated above.
