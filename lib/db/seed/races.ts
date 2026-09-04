export type SeedRace = {
  year: number;
  round: number;
  name: string;
  /** Circuit slug from circuits.ts. */
  circuit: string;
  /** Race day, ISO. The calendar publishes a weekend range; this is its final day. */
  date: string;
  /** Absent where the race has not been run yet. */
  winnerDriver?: string;
  winnerTeam?: string;
};

/**
 * The full 2026 calendar, taken from the official season page (see DATA_SOURCES.md).
 *
 * Rounds 1–12 have been run and carry their winners; rounds 13–23 are scheduled and carry
 * none, which is the factual state rather than missing data. Laps, pole and fastest lap are
 * left unset: the calendar does not publish them, and the circuit's standard lap count is
 * not the same claim as how many laps a given race actually ran.
 *
 * The winners reconcile with the standings seeded in data.ts: Antonelli 6, Russell 2,
 * Norris 2, Hamilton 1, Leclerc 1, which sums to the twelve completed rounds and to the
 * constructors' tallies of Mercedes 8, Ferrari 2, McLaren 2.
 */
export const seedRaces: SeedRace[] = [
  {
    year: 2026,
    round: 1,
    name: "Australian Grand Prix",
    circuit: "albert-park",
    date: "2026-03-08",
    winnerDriver: "george-russell",
    winnerTeam: "mercedes",
  },
  {
    year: 2026,
    round: 2,
    name: "Chinese Grand Prix",
    circuit: "shanghai",
    date: "2026-03-15",
    winnerDriver: "kimi-antonelli",
    winnerTeam: "mercedes",
  },
  {
    year: 2026,
    round: 3,
    name: "Japanese Grand Prix",
    circuit: "suzuka",
    date: "2026-03-29",
    winnerDriver: "kimi-antonelli",
    winnerTeam: "mercedes",
  },
  {
    year: 2026,
    round: 4,
    name: "Miami Grand Prix",
    circuit: "miami",
    date: "2026-05-03",
    winnerDriver: "kimi-antonelli",
    winnerTeam: "mercedes",
  },
  {
    year: 2026,
    round: 5,
    name: "Canadian Grand Prix",
    circuit: "gilles-villeneuve",
    date: "2026-05-24",
    winnerDriver: "kimi-antonelli",
    winnerTeam: "mercedes",
  },
  {
    year: 2026,
    round: 6,
    name: "Monaco Grand Prix",
    circuit: "monaco",
    date: "2026-06-07",
    winnerDriver: "kimi-antonelli",
    winnerTeam: "mercedes",
  },
  {
    year: 2026,
    round: 7,
    name: "Barcelona-Catalunya Grand Prix",
    circuit: "barcelona-catalunya",
    date: "2026-06-14",
    winnerDriver: "lewis-hamilton",
    winnerTeam: "ferrari",
  },
  {
    year: 2026,
    round: 8,
    name: "Austrian Grand Prix",
    circuit: "red-bull-ring",
    date: "2026-06-28",
    winnerDriver: "george-russell",
    winnerTeam: "mercedes",
  },
  {
    year: 2026,
    round: 9,
    name: "British Grand Prix",
    circuit: "silverstone",
    date: "2026-07-05",
    winnerDriver: "charles-leclerc",
    winnerTeam: "ferrari",
  },
  {
    year: 2026,
    round: 10,
    name: "Belgian Grand Prix",
    circuit: "spa-francorchamps",
    date: "2026-07-19",
    winnerDriver: "kimi-antonelli",
    winnerTeam: "mercedes",
  },
  {
    year: 2026,
    round: 11,
    name: "Hungarian Grand Prix",
    circuit: "hungaroring",
    date: "2026-07-26",
    winnerDriver: "lando-norris",
    winnerTeam: "mclaren",
  },
  {
    year: 2026,
    round: 12,
    name: "Dutch Grand Prix",
    circuit: "zandvoort",
    date: "2026-08-23",
    winnerDriver: "lando-norris",
    winnerTeam: "mclaren",
  },
  {
    year: 2026,
    round: 13,
    name: "Italian Grand Prix",
    circuit: "monza",
    date: "2026-09-06",
  },
  {
    year: 2026,
    round: 14,
    name: "Spanish Grand Prix",
    circuit: "madring",
    date: "2026-09-13",
  },
  {
    year: 2026,
    round: 15,
    name: "Azerbaijan Grand Prix",
    circuit: "baku",
    date: "2026-09-26",
  },
  {
    year: 2026,
    round: 16,
    name: "Bahrain Grand Prix",
    circuit: "bahrain",
    date: "2026-10-04",
  },
  {
    year: 2026,
    round: 17,
    name: "Singapore Grand Prix",
    circuit: "marina-bay",
    date: "2026-10-11",
  },
  {
    year: 2026,
    round: 18,
    name: "United States Grand Prix",
    circuit: "circuit-of-the-americas",
    date: "2026-10-25",
  },
  {
    year: 2026,
    round: 19,
    name: "Mexico City Grand Prix",
    circuit: "hermanos-rodriguez",
    date: "2026-11-01",
  },
  {
    year: 2026,
    round: 20,
    name: "São Paulo Grand Prix",
    circuit: "interlagos",
    date: "2026-11-08",
  },
  {
    year: 2026,
    round: 21,
    name: "Las Vegas Grand Prix",
    circuit: "las-vegas",
    date: "2026-11-21",
  },
  {
    year: 2026,
    round: 22,
    name: "Qatar Grand Prix",
    circuit: "lusail",
    date: "2026-11-29",
  },
  {
    year: 2026,
    round: 23,
    name: "Abu Dhabi Grand Prix",
    circuit: "yas-marina",
    date: "2026-12-06",
  },
];
