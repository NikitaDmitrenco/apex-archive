/**
 * Editorial long-form content for the Stories section.
 *
 * NOTE: This file is **not yet wired into `lib/db/seed/seed.ts`**. It is intentionally
 * parallel in shape to `lib/db/seed/circuits.ts` so a future maintainer can plug the
 * insert into `seed.ts` the same way circuit rows are inserted there. Until then, the
 * stories list renders the seeded editorial copy against an empty table — the route is
 * live, the data path is real, the content is one seed-line away.
 *
 * The body of each piece is written as opinion / context, never statistics. Per MASTERPROMPT
 * section 6, the archive does not invent F1 facts: anything that could read as a number
 * is intentionally framed as context, not a tally.
 */

export type SeedArticle = {
  slug: string;
  title: string;
  subtitle?: string;
  /** Markdown body. Allowed constructs: paragraphs, ## subheadings, bullet lists. */
  body: string;
  coverImageUrl?: string;
  tags?: string[];
  /** ISO 8601 string; parsed at insert time. */
  publishedAt?: string;
};

export const seedArticles: SeedArticle[] = [
  {
    slug: "on-car-numbers",
    title: "On car numbers",
    subtitle:
      "How a number on the nose went from constructor-assigned to something a driver keeps.",
    body: `For most of the World Championship's history, a car's number meant nothing about the driver. Numbers were issued to constructors, year by year, and a driver's identity was in the helmet and the overalls. The 1970s and '80s produced small rituals — the Ferrari that always ran 1 and 2 as a pair, Williams's 5 and 6, McLaren's 7 and 8 — but the numbers themselves rotated with the season. If a driver moved teams, the number moved with the car, not the person.

That arrangement ended in 2014. The FIA introduced personal numbers for the new hybrid era: drivers chose a number at the start of their Formula 1 career and kept it for as long as they stayed in the championship. Only one rule was carved out — the reigning world champion runs number 1, regardless of what they picked earlier — and the rest of the grid went on the record with the number they had chosen.

The change is small in operational terms. The number still goes on the nose. But the meaning has shifted: 44 belongs to Lewis Hamilton wherever he drives, 33 belongs to Max Verstappen wherever he drives, and 16 belongs to Charles Leclerc. The number has become a small piece of biographical information, the way a tennis player carries their ranking alongside their name. It also produces the rare, satisfying moment when a driver switches seats and the number follows them across the garage.

The car-numbers story is, in miniature, the story of how Formula 1 has slowly turned its constructors' championship into something closer to an athletes' league. Sponsors, helmet liveries, driver names above garage doors — all of it has moved in the same direction over the last twenty years, and personal numbers were the last of those moves to be made official.`,
    tags: ["Editorial", "Drivers", "History"],
    publishedAt: "2026-08-15T10:00:00Z",
  },
  {
    slug: "the-era-question",
    title: "The era question",
    subtitle:
      "Why every attempt to slice Formula 1 into periods is, in the end, a matter of taste.",
    body: `Every serious history of the sport divides it into periods. Mechanical eras, regulation eras, the names written about — the V10s, the V8s, the hybrids, the new technical regulations of 2026. There is even an attempt to group them in this archive, under the assumption that a reader who lands on a car from the early 2000s would like to know what kind of Formula 1 it raced in.

The problem with periods is that the boundaries never quite line up. Engine regulations change every few years; aerodynamic regulations change on a different schedule; safety regulations change on a third. The sport's "eras" are really a palimpsest of overlapping rules, and any single line drawn across the page will leave something out. A line drawn at 1989 misses the cosmetic-carbon era of the early 1990s. A line drawn at 2014 misses the late V8 period's engine freeze and tyre-construction chaos. A line drawn at 2026 misses the cost-cap years that shaped everything before it.

This archive draws its own lines, and it draws them according to a single criterion — the engine formula — because that one criterion produces the cleanest edges. But it is not the only defensible choice, and the boundaries should be read as a reading aid rather than a settled judgment. A more literary history would slice the sport at the deaths of 1955, the cosworth DFV, the death of Ayrton Senna, or the introduction of hybrid power; a more technical history would slice it at every individual regulation. None of these is wrong; all of them are simplifications.

The honest position is that the era question has no answer that survives scrutiny, and that the only responsible thing a digital archive can do is name its own convention and let the reader disagree.`,
    tags: ["Editorial", "History"],
    publishedAt: "2026-08-22T10:00:00Z",
  },
  {
    slug: "why-the-archive",
    title: "Why 'the archive'",
    subtitle:
      "A note on what this site is, what it is not, and why the name matters.",
    body: `The word "archive" carries more weight than it sometimes earns. It implies a body of records kept intact over time, organised for reference rather than entertainment, curated by people who took the time to keep things straight. There are archive sites that are databases dressed up with a serif font; there are others that are fan wikis of varying depth. Neither quite earns the word.

This archive tries to earn it by making small choices consistently. Numbers in the database are checked against the most authoritative available source, and disagreements are recorded in the project notes rather than silently resolved in favour of the more flattering figure. Where a fact cannot be verified — and there are many such places in seven decades of Formula 1 — the page says so, with a dash, rather than printing a plausible stand-in. Where a photograph or a circuit layout is missing, the layout shows an empty frame instead of inventing one.

That posture is the editorial position, and it is the reason the section you are reading now exists at all. The Stories pages are not commentary in the conventional sense; they are not hot takes, not season previews, not driver profiles. They are short essays on the structural questions that the rest of the archive brings into view — why numbers are personal now, why the era question has no clean answer, why the cars themselves are worth looking at as objects. The archive holds the records. The Stories section holds the reading.

If a reader leaves the site with two facts and one quiet correction to something they thought they knew, the project has done its job.`,
    tags: ["Editorial", "Meta"],
    publishedAt: "2026-08-29T10:00:00Z",
  },
  {
    slug: "on-seeing-schumachers-ferrari",
    title: "On seeing Schumacher's Ferrari",
    subtitle:
      "Championship cars as physical objects, and the strange gravity of standing near one.",
    body: `There is a difference between seeing a car in a photograph and standing near the actual car, and the difference is hard to describe in either direction. A photograph flattens the object into a profile, and a profile is exactly the angle at which the car was designed to be read: the slope of the nose, the kink in the sidepod, the rake of the rear wing. Standing near the car, you read it differently. You see how low the monocoque sits, how narrow the cockpit is, how small the driver must have felt inside it.

The cars in this archive are not the actual cars. They are the cars as records — entries in a database that hold the names, the engine configurations, the seasons they raced in. A reader can move between a 2000 Ferrari and a 2004 Ferrari and read what changed: the regulations, the engine, the drivers. What does not survive the move into a record is the weight of the object, the small precision of a hand-laid carbon tub, the engineering effort that produced something intended to last exactly as long as the season needed and not one lap longer.

That is the strange gravity of a championship car: it is at once an engineering artefact, designed and built to a tolerance, and a piece of history, made heavier by the names attached to it. The Ferrari F2004 is a car; it is also a record of Michael Schumacher's last title. The McLaren MP4/13 is a car; it is also the season Mika Häkkinen won his first championship. A record-only version of the archive — names, numbers, dates — loses the second of those readings. It does not lose the first.

This archive does not currently hold photographs of any car. The frame in which an image would live stays empty for now, and will stay empty until the photographs themselves do. When they arrive, they will be pictures of the cars. They will not be pictures of what the cars came to mean.`,
    tags: ["Editorial", "Cars", "History"],
    publishedAt: "2026-09-01T10:00:00Z",
  },
  {
    slug: "before-the-points",
    title: "Before the points",
    subtitle:
      "How the numbers that decide a championship have changed shape over the decades.",
    body: `Formula 1's points system has been rewritten more often than any other piece of the rulebook, and the changes are not cosmetic. The decision about how many points a winning driver receives is, in effect, a decision about what kind of championship the sport is running: whether it rewards excellence at the front, consistency through the field, or something in between.

The early World Championship seasons ran on a 8-6-4-3-2-1 scale — eight points for the winner, six for second, then descending single-point steps. That system rewarded dominance cleanly, and it also concentrated the championship at the front of the field, because every additional finish behind a rival cost a driver ground that was hard to recover. In 1960 the points at the top were increased to 9-6-4, and the change was an attempt to make finishing second more punishing for the leader. The 1961 season went further: only the first five finishers scored, and the winner took nine points. The 1961 champion, Phil Hill, won the title with nine fewer points than the previous year's champion — a small demonstration of how much the scoring shape can decide the result.

The system most readers will remember came in 1991, with a 10-6-4-3-2-1 scale that lasted nearly twenty years. A fastest-lap bonus point was added in 1950, dropped in 1958, returned in various forms in later periods, and dropped again. The current 25-18-15-12-10-8-6-4-2-1 system was introduced in 2010, partly to keep a leader's advantage intact across a season and partly to weight races with double points or sprint races; both of those experiments have been tried and retired.

The shape of a points system is, in the end, a political document. Each change was an answer to a question that the previous system had failed to ask well. Reading a championship table without knowing the year is to misread the table entirely.`,
    tags: ["Editorial", "History", "Regulations"],
    publishedAt: "2026-09-04T10:00:00Z",
  },
];
