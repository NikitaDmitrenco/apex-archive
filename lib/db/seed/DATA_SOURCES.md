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

### Not seeded, deliberately

- **Career wins, poles, podiums, points and race starts.** These are published figures, but
  they were not verified row by row for this pass, so they are NULL. They are stored as
  columns rather than computed from `results`, because the archive seeds only a subset of
  races and aggregating that subset would understate a career while presenting the shortfall
  as fact.
- **Driver dates of birth** — not verified individually; NULL.
- **Car power, weight and technical breakdown** — manufacturers rarely publish exact figures
  and secondary sources disagree. Mostly NULL, marked `placeholder`.
- **The 2026 season result.** The season is in progress as of this seed, so
  `world_champion_driver_id` and `constructors_champion_team_id` are NULL. That is the
  factual state, not missing data. The landing page's "NOW — 2026 SEASON" block
  (Milestone 3) needs current standings from a live source; do not guess them.
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
4. Race-by-race results for the seeded seasons, which would let season standings be shown.
5. Current 2026 season data for the landing page.
