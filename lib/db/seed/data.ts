/**
 * Curated starter data for the Apex Archive.
 *
 * Read lib/db/seed/DATA_SOURCES.md before changing anything here. The governing rule is
 * that an unverified figure is left undefined rather than guessed: null renders as unknown,
 * a wrong number renders as a fact.
 *
 * Championship counts are derived by counting the year-by-year champion tables cited in
 * DATA_SOURCES.md, and agree with the season rows below.
 */

export type SeedTeam = {
  slug: string;
  name: string;
  nationality: string;
  foundedYear?: number;
  dissolvedYear?: number;
  baseLocation?: string;
  bio?: string;
  /** Constructors' championships. The title did not exist before 1958. */
  championships: number;
  dataConfidence: "verified" | "placeholder" | "uncertain";
};

export const seedTeams: SeedTeam[] = [
  {
    slug: "ferrari",
    name: "Ferrari",
    nationality: "Italian",
    foundedYear: 1950,
    baseLocation: "Maranello, Italy",
    bio: "The only constructor to have contested every season of the World Championship. Founded as Scuderia Ferrari in 1929; the year given here is its first championship season.",
    championships: 16,
    dataConfidence: "placeholder",
  },
  {
    slug: "mclaren",
    name: "McLaren",
    nationality: "British",
    foundedYear: 1963,
    baseLocation: "Woking, United Kingdom",
    championships: 10,
    dataConfidence: "placeholder",
  },
  {
    slug: "williams",
    name: "Williams",
    nationality: "British",
    foundedYear: 1977,
    baseLocation: "Grove, United Kingdom",
    bio: "Williams Grand Prix Engineering, the team's continuous identity, dates from 1977.",
    championships: 9,
    dataConfidence: "placeholder",
  },
  {
    slug: "mercedes",
    name: "Mercedes",
    nationality: "German",
    baseLocation: "Brackley, United Kingdom",
    bio: "Mercedes has two separate works histories in Formula One, the 1950s and the modern era from 2010. A single founding year would misstate either, so none is recorded.",
    championships: 8,
    dataConfidence: "placeholder",
  },
  {
    slug: "team-lotus",
    name: "Team Lotus",
    nationality: "British",
    foundedYear: 1954,
    dissolvedYear: 1994,
    championships: 7,
    dataConfidence: "placeholder",
  },
  {
    slug: "red-bull-racing",
    name: "Red Bull Racing",
    nationality: "Austrian",
    foundedYear: 2005,
    baseLocation: "Milton Keynes, United Kingdom",
    championships: 6,
    dataConfidence: "placeholder",
  },
  {
    slug: "brabham",
    name: "Brabham",
    nationality: "British",
    foundedYear: 1962,
    dissolvedYear: 1992,
    championships: 2,
    dataConfidence: "placeholder",
  },
  {
    slug: "benetton",
    name: "Benetton",
    nationality: "Italian",
    foundedYear: 1986,
    dissolvedYear: 2001,
    championships: 1,
    dataConfidence: "placeholder",
  },
  {
    slug: "tyrrell",
    name: "Tyrrell",
    nationality: "British",
    foundedYear: 1970,
    dissolvedYear: 1998,
    championships: 1,
    dataConfidence: "placeholder",
  },
  {
    slug: "alfa-romeo",
    name: "Alfa Romeo",
    nationality: "Italian",
    bio: "Won the first two drivers' titles, in 1950 and 1951. The constructors' championship was not introduced until 1958, so the team holds none.",
    championships: 0,
    dataConfidence: "placeholder",
  },
  // The rest of the 2026 grid. None has won a constructors' title under its current name,
  // which is why each shows zero rather than an unknown.
  {
    slug: "aston-martin",
    name: "Aston Martin",
    nationality: "British",
    championships: 0,
    dataConfidence: "placeholder",
  },
  {
    slug: "alpine",
    name: "Alpine",
    nationality: "French",
    bio: "The Enstone entry's lineage includes Renault's 2005 and 2006 constructors' titles, which were won under a different constructor name and are not counted here.",
    championships: 0,
    dataConfidence: "placeholder",
  },
  {
    slug: "racing-bulls",
    name: "Racing Bulls",
    nationality: "Italian",
    championships: 0,
    dataConfidence: "placeholder",
  },
  {
    slug: "haas",
    name: "Haas F1 Team",
    nationality: "American",
    championships: 0,
    dataConfidence: "placeholder",
  },
  {
    slug: "audi",
    name: "Audi",
    nationality: "German",
    bio: "Took over the Sauber entry for 2026.",
    championships: 0,
    dataConfidence: "placeholder",
  },
  {
    slug: "cadillac",
    name: "Cadillac",
    nationality: "American",
    bio: "Joined the championship for 2026.",
    championships: 0,
    dataConfidence: "placeholder",
  },
];

export type SeedDriver = {
  slug: string;
  fullName: string;
  nationality: string;
  careerStartYear?: number;
  /** Undefined means still racing. */
  careerEndYear?: number;
  championships: number;
  dataConfidence: "verified" | "placeholder" | "uncertain";
};

export const seedDrivers: SeedDriver[] = [
  {
    slug: "giuseppe-farina",
    fullName: "Giuseppe Farina",
    nationality: "Italian",
    careerStartYear: 1950,
    careerEndYear: 1955,
    championships: 1,
    dataConfidence: "placeholder",
  },
  {
    slug: "juan-manuel-fangio",
    fullName: "Juan Manuel Fangio",
    nationality: "Argentine",
    careerStartYear: 1950,
    careerEndYear: 1958,
    championships: 5,
    dataConfidence: "placeholder",
  },
  {
    slug: "alberto-ascari",
    fullName: "Alberto Ascari",
    nationality: "Italian",
    careerStartYear: 1950,
    careerEndYear: 1955,
    championships: 2,
    dataConfidence: "placeholder",
  },
  {
    slug: "jack-brabham",
    fullName: "Jack Brabham",
    nationality: "Australian",
    careerStartYear: 1955,
    careerEndYear: 1970,
    championships: 3,
    dataConfidence: "placeholder",
  },
  {
    slug: "graham-hill",
    fullName: "Graham Hill",
    nationality: "British",
    careerStartYear: 1958,
    careerEndYear: 1975,
    championships: 2,
    dataConfidence: "placeholder",
  },
  {
    slug: "jim-clark",
    fullName: "Jim Clark",
    nationality: "British",
    careerStartYear: 1960,
    careerEndYear: 1968,
    championships: 2,
    dataConfidence: "placeholder",
  },
  {
    slug: "jackie-stewart",
    fullName: "Jackie Stewart",
    nationality: "British",
    careerStartYear: 1965,
    careerEndYear: 1973,
    championships: 3,
    dataConfidence: "placeholder",
  },
  {
    slug: "emerson-fittipaldi",
    fullName: "Emerson Fittipaldi",
    nationality: "Brazilian",
    careerStartYear: 1970,
    careerEndYear: 1980,
    championships: 2,
    dataConfidence: "placeholder",
  },
  {
    slug: "niki-lauda",
    fullName: "Niki Lauda",
    nationality: "Austrian",
    careerStartYear: 1971,
    careerEndYear: 1985,
    championships: 3,
    dataConfidence: "placeholder",
  },
  {
    slug: "nelson-piquet",
    fullName: "Nelson Piquet",
    nationality: "Brazilian",
    careerStartYear: 1978,
    careerEndYear: 1991,
    championships: 3,
    dataConfidence: "placeholder",
  },
  {
    slug: "alain-prost",
    fullName: "Alain Prost",
    nationality: "French",
    careerStartYear: 1980,
    careerEndYear: 1993,
    championships: 4,
    dataConfidence: "placeholder",
  },
  {
    slug: "nigel-mansell",
    fullName: "Nigel Mansell",
    nationality: "British",
    careerStartYear: 1980,
    careerEndYear: 1995,
    championships: 1,
    dataConfidence: "placeholder",
  },
  {
    slug: "ayrton-senna",
    fullName: "Ayrton Senna",
    nationality: "Brazilian",
    careerStartYear: 1984,
    careerEndYear: 1994,
    championships: 3,
    dataConfidence: "placeholder",
  },
  {
    slug: "michael-schumacher",
    fullName: "Michael Schumacher",
    nationality: "German",
    careerStartYear: 1991,
    careerEndYear: 2012,
    championships: 7,
    dataConfidence: "placeholder",
  },
  {
    slug: "mika-hakkinen",
    fullName: "Mika Häkkinen",
    nationality: "Finnish",
    careerStartYear: 1991,
    careerEndYear: 2001,
    championships: 2,
    dataConfidence: "placeholder",
  },
  {
    slug: "fernando-alonso",
    fullName: "Fernando Alonso",
    nationality: "Spanish",
    careerStartYear: 2001,
    championships: 2,
    dataConfidence: "placeholder",
  },
  {
    slug: "kimi-raikkonen",
    fullName: "Kimi Räikkönen",
    nationality: "Finnish",
    careerStartYear: 2001,
    careerEndYear: 2021,
    championships: 1,
    dataConfidence: "placeholder",
  },
  {
    slug: "lewis-hamilton",
    fullName: "Lewis Hamilton",
    nationality: "British",
    careerStartYear: 2007,
    championships: 7,
    dataConfidence: "placeholder",
  },
  {
    slug: "sebastian-vettel",
    fullName: "Sebastian Vettel",
    nationality: "German",
    careerStartYear: 2007,
    careerEndYear: 2022,
    championships: 4,
    dataConfidence: "placeholder",
  },
  {
    slug: "max-verstappen",
    fullName: "Max Verstappen",
    nationality: "Dutch",
    careerStartYear: 2015,
    championships: 4,
    dataConfidence: "placeholder",
  },
  // The rest of the 2026 grid. Career start years are omitted because they were not
  // verified; a zero title count, by contrast, is a fact taken from the champions list.
  {
    slug: "lando-norris",
    fullName: "Lando Norris",
    nationality: "British",
    championships: 1,
    dataConfidence: "placeholder",
  },
  {
    slug: "kimi-antonelli",
    fullName: "Kimi Antonelli",
    nationality: "Italian",
    championships: 0,
    dataConfidence: "placeholder",
  },
  {
    slug: "george-russell",
    fullName: "George Russell",
    nationality: "British",
    championships: 0,
    dataConfidence: "placeholder",
  },
  {
    slug: "charles-leclerc",
    fullName: "Charles Leclerc",
    nationality: "Monégasque",
    championships: 0,
    dataConfidence: "placeholder",
  },
  {
    slug: "oscar-piastri",
    fullName: "Oscar Piastri",
    nationality: "Australian",
    championships: 0,
    dataConfidence: "placeholder",
  },
  {
    slug: "isack-hadjar",
    fullName: "Isack Hadjar",
    nationality: "French",
    championships: 0,
    dataConfidence: "placeholder",
  },
  {
    slug: "liam-lawson",
    fullName: "Liam Lawson",
    nationality: "New Zealander",
    championships: 0,
    dataConfidence: "placeholder",
  },
  {
    slug: "pierre-gasly",
    fullName: "Pierre Gasly",
    nationality: "French",
    championships: 0,
    dataConfidence: "placeholder",
  },
  {
    slug: "arvid-lindblad",
    fullName: "Arvid Lindblad",
    nationality: "British",
    championships: 0,
    dataConfidence: "placeholder",
  },
  {
    slug: "franco-colapinto",
    fullName: "Franco Colapinto",
    nationality: "Argentine",
    championships: 0,
    dataConfidence: "placeholder",
  },
  {
    slug: "oliver-bearman",
    fullName: "Oliver Bearman",
    nationality: "British",
    championships: 0,
    dataConfidence: "placeholder",
  },
  {
    slug: "gabriel-bortoleto",
    fullName: "Gabriel Bortoleto",
    nationality: "Brazilian",
    championships: 0,
    dataConfidence: "placeholder",
  },
  {
    slug: "nico-hulkenberg",
    fullName: "Nico Hülkenberg",
    nationality: "German",
    championships: 0,
    dataConfidence: "placeholder",
  },
  {
    slug: "carlos-sainz",
    fullName: "Carlos Sainz",
    nationality: "Spanish",
    championships: 0,
    dataConfidence: "placeholder",
  },
  {
    slug: "alexander-albon",
    fullName: "Alexander Albon",
    nationality: "Thai",
    championships: 0,
    dataConfidence: "placeholder",
  },
  {
    slug: "esteban-ocon",
    fullName: "Esteban Ocon",
    nationality: "French",
    championships: 0,
    dataConfidence: "placeholder",
  },
  {
    slug: "yuki-tsunoda",
    fullName: "Yuki Tsunoda",
    nationality: "Japanese",
    championships: 0,
    dataConfidence: "placeholder",
  },
  {
    slug: "lance-stroll",
    fullName: "Lance Stroll",
    nationality: "Canadian",
    championships: 0,
    dataConfidence: "placeholder",
  },
  {
    slug: "valtteri-bottas",
    fullName: "Valtteri Bottas",
    nationality: "Finnish",
    championships: 0,
    dataConfidence: "placeholder",
  },
  {
    slug: "sergio-perez",
    fullName: "Sergio Pérez",
    nationality: "Mexican",
    championships: 0,
    dataConfidence: "placeholder",
  },
];

export type SeedSeason = {
  year: number;
  /** Driver slug, or undefined when the season has no champion yet. */
  worldChampionDriver?: string;
  /** Team slug. Undefined before 1958, when the constructors' title did not exist. */
  constructorsChampionTeam?: string;
  summary?: string;
  dataConfidence: "verified" | "placeholder" | "uncertain";
};

export const seedSeasons: SeedSeason[] = [
  {
    year: 1950,
    worldChampionDriver: "giuseppe-farina",
    summary:
      "The first World Championship season. No constructors' title was awarded; that championship began in 1958.",
    dataConfidence: "verified",
  },
  {
    year: 1988,
    worldChampionDriver: "ayrton-senna",
    constructorsChampionTeam: "mclaren",
    summary:
      "McLaren won fifteen of the sixteen rounds, Senna taking the title from his team mate Prost.",
    dataConfidence: "verified",
  },
  {
    year: 1992,
    worldChampionDriver: "nigel-mansell",
    constructorsChampionTeam: "williams",
    dataConfidence: "verified",
  },
  {
    year: 1994,
    worldChampionDriver: "michael-schumacher",
    constructorsChampionTeam: "williams",
    summary:
      "The drivers' and constructors' titles went to different camps: Schumacher for Benetton, the constructors' championship to Williams.",
    dataConfidence: "verified",
  },
  {
    year: 1998,
    worldChampionDriver: "mika-hakkinen",
    constructorsChampionTeam: "mclaren",
    dataConfidence: "verified",
  },
  {
    year: 2000,
    worldChampionDriver: "michael-schumacher",
    constructorsChampionTeam: "ferrari",
    summary: "Ferrari's first drivers' title since 1979.",
    dataConfidence: "verified",
  },
  {
    year: 2004,
    worldChampionDriver: "michael-schumacher",
    constructorsChampionTeam: "ferrari",
    summary: "The last of Schumacher's five consecutive titles with Ferrari.",
    dataConfidence: "verified",
  },
  {
    year: 2011,
    worldChampionDriver: "sebastian-vettel",
    constructorsChampionTeam: "red-bull-racing",
    dataConfidence: "verified",
  },
  {
    year: 2013,
    worldChampionDriver: "sebastian-vettel",
    constructorsChampionTeam: "red-bull-racing",
    summary: "The fourth and final title of Red Bull's first championship run.",
    dataConfidence: "verified",
  },
  {
    year: 2021,
    worldChampionDriver: "max-verstappen",
    constructorsChampionTeam: "mercedes",
    summary:
      "The titles split again: Verstappen took the drivers' championship, Mercedes the constructors'.",
    dataConfidence: "verified",
  },
  {
    year: 2025,
    worldChampionDriver: "lando-norris",
    constructorsChampionTeam: "mclaren",
    summary:
      "Norris took his first title by two points, and McLaren's first drivers' championship since 2008.",
    dataConfidence: "verified",
  },
  {
    year: 2026,
    summary:
      "Season in progress. Standings are current after round 12, the Dutch Grand Prix of 23 August 2026. No champion is recorded because none has been decided.",
    dataConfidence: "verified",
  },
];

export type SeedStanding = {
  year: number;
  position: number;
  points: number;
  /** Undefined means unknown, which is not the same as zero. */
  wins?: number;
};

export type SeedDriverStanding = SeedStanding & {
  driver: string;
  team: string;
};

/**
 * A dated snapshot, not a live feed: these are the standings after round 12 of 2026.
 * Podium counts are omitted because the source table does not carry them.
 * Refresh with each race — see DATA_SOURCES.md.
 */
export const seedDriverStandings: SeedDriverStanding[] = [
  {
    year: 2026,
    position: 1,
    driver: "kimi-antonelli",
    team: "mercedes",
    points: 242,
    wins: 6,
  },
  {
    year: 2026,
    position: 2,
    driver: "george-russell",
    team: "mercedes",
    points: 183,
    wins: 2,
  },
  {
    year: 2026,
    position: 3,
    driver: "lewis-hamilton",
    team: "ferrari",
    points: 183,
    wins: 1,
  },
  {
    year: 2026,
    position: 4,
    driver: "lando-norris",
    team: "mclaren",
    points: 159,
    wins: 2,
  },
  {
    year: 2026,
    position: 5,
    driver: "charles-leclerc",
    team: "ferrari",
    points: 155,
    wins: 1,
  },
  {
    year: 2026,
    position: 6,
    driver: "max-verstappen",
    team: "red-bull-racing",
    points: 112,
    wins: 0,
  },
  {
    year: 2026,
    position: 7,
    driver: "oscar-piastri",
    team: "mclaren",
    points: 104,
    wins: 0,
  },
  {
    year: 2026,
    position: 8,
    driver: "isack-hadjar",
    team: "red-bull-racing",
    points: 68,
    wins: 0,
  },
  {
    year: 2026,
    position: 9,
    driver: "liam-lawson",
    team: "racing-bulls",
    points: 49,
    wins: 0,
  },
  {
    year: 2026,
    position: 10,
    driver: "pierre-gasly",
    team: "alpine",
    points: 44,
    wins: 0,
  },
  {
    year: 2026,
    position: 11,
    driver: "arvid-lindblad",
    team: "racing-bulls",
    points: 23,
    wins: 0,
  },
  {
    year: 2026,
    position: 12,
    driver: "franco-colapinto",
    team: "alpine",
    points: 19,
    wins: 0,
  },
  {
    year: 2026,
    position: 13,
    driver: "oliver-bearman",
    team: "haas",
    points: 18,
    wins: 0,
  },
  {
    year: 2026,
    position: 14,
    driver: "gabriel-bortoleto",
    team: "audi",
    points: 10,
    wins: 0,
  },
  {
    year: 2026,
    position: 15,
    driver: "nico-hulkenberg",
    team: "audi",
    points: 6,
    wins: 0,
  },
  {
    year: 2026,
    position: 16,
    driver: "carlos-sainz",
    team: "williams",
    points: 6,
    wins: 0,
  },
  {
    year: 2026,
    position: 17,
    driver: "alexander-albon",
    team: "williams",
    points: 5,
    wins: 0,
  },
  {
    year: 2026,
    position: 18,
    driver: "esteban-ocon",
    team: "haas",
    points: 3,
    wins: 0,
  },
  {
    year: 2026,
    position: 19,
    driver: "fernando-alonso",
    team: "aston-martin",
    points: 3,
    wins: 0,
  },
  {
    year: 2026,
    position: 20,
    driver: "yuki-tsunoda",
    team: "racing-bulls",
    points: 0,
    wins: 0,
  },
  {
    year: 2026,
    position: 21,
    driver: "lance-stroll",
    team: "aston-martin",
    points: 0,
    wins: 0,
  },
  {
    year: 2026,
    position: 22,
    driver: "valtteri-bottas",
    team: "cadillac",
    points: 0,
    wins: 0,
  },
  {
    year: 2026,
    position: 23,
    driver: "sergio-perez",
    team: "cadillac",
    points: 0,
    wins: 0,
  },
];

export type SeedConstructorStanding = SeedStanding & { team: string };

/** Team win counts are derived from the twelve race winners, and sum to twelve. */
export const seedConstructorStandings: SeedConstructorStanding[] = [
  { year: 2026, position: 1, team: "mercedes", points: 425, wins: 8 },
  { year: 2026, position: 2, team: "ferrari", points: 338, wins: 2 },
  { year: 2026, position: 3, team: "mclaren", points: 263, wins: 2 },
  { year: 2026, position: 4, team: "red-bull-racing", points: 186, wins: 0 },
  { year: 2026, position: 5, team: "racing-bulls", points: 66, wins: 0 },
  { year: 2026, position: 6, team: "alpine", points: 63, wins: 0 },
  { year: 2026, position: 7, team: "haas", points: 21, wins: 0 },
  { year: 2026, position: 8, team: "audi", points: 16, wins: 0 },
  { year: 2026, position: 9, team: "williams", points: 11, wins: 0 },
  { year: 2026, position: 10, team: "aston-martin", points: 3, wins: 0 },
  { year: 2026, position: 11, team: "cadillac", points: 0, wins: 0 },
];

export type SeedCar = {
  slug: string;
  name: string;
  team: string;
  year: number;
  chassisName?: string;
  engineManufacturer?: string;
  engineConfig?: string;
  capacityLiters?: number;
  dataConfidence: "verified" | "placeholder" | "uncertain";
};

/**
 * Engine configurations and capacities follow the technical regulations of their season,
 * which are a matter of record. Power and weight are omitted: manufacturers rarely published
 * them and secondary sources disagree.
 */
export const seedCars: SeedCar[] = [
  {
    slug: "alfa-romeo-158",
    name: "Alfa Romeo 158",
    team: "alfa-romeo",
    year: 1950,
    chassisName: "158 Alfetta",
    engineManufacturer: "Alfa Romeo",
    engineConfig: "Straight-8 supercharged",
    capacityLiters: 1.5,
    dataConfidence: "placeholder",
  },
  {
    slug: "mclaren-mp4-4",
    name: "McLaren MP4/4",
    team: "mclaren",
    year: 1988,
    chassisName: "MP4/4",
    engineManufacturer: "Honda",
    engineConfig: "V6 turbo",
    capacityLiters: 1.5,
    dataConfidence: "placeholder",
  },
  {
    slug: "ferrari-f1-87-88c",
    name: "Ferrari F1/87/88C",
    team: "ferrari",
    year: 1988,
    chassisName: "F1/87/88C",
    engineManufacturer: "Ferrari",
    engineConfig: "V6 turbo",
    capacityLiters: 1.5,
    dataConfidence: "placeholder",
  },
  {
    slug: "williams-fw14b",
    name: "Williams FW14B",
    team: "williams",
    year: 1992,
    chassisName: "FW14B",
    engineManufacturer: "Renault",
    engineConfig: "V10",
    capacityLiters: 3.5,
    dataConfidence: "placeholder",
  },
  {
    slug: "benetton-b194",
    name: "Benetton B194",
    team: "benetton",
    year: 1994,
    chassisName: "B194",
    engineManufacturer: "Ford",
    engineConfig: "V8",
    capacityLiters: 3.5,
    dataConfidence: "placeholder",
  },
  {
    slug: "williams-fw16",
    name: "Williams FW16",
    team: "williams",
    year: 1994,
    chassisName: "FW16",
    engineManufacturer: "Renault",
    engineConfig: "V10",
    capacityLiters: 3.5,
    dataConfidence: "placeholder",
  },
  {
    slug: "mclaren-mp4-13",
    name: "McLaren MP4-13",
    team: "mclaren",
    year: 1998,
    chassisName: "MP4-13",
    engineManufacturer: "Mercedes",
    engineConfig: "V10",
    capacityLiters: 3.0,
    dataConfidence: "placeholder",
  },
  {
    slug: "ferrari-f300",
    name: "Ferrari F300",
    team: "ferrari",
    year: 1998,
    chassisName: "F300",
    engineManufacturer: "Ferrari",
    engineConfig: "V10",
    capacityLiters: 3.0,
    dataConfidence: "placeholder",
  },
  {
    slug: "ferrari-f1-2000",
    name: "Ferrari F1-2000",
    team: "ferrari",
    year: 2000,
    chassisName: "F1-2000",
    engineManufacturer: "Ferrari",
    engineConfig: "V10",
    capacityLiters: 3.0,
    dataConfidence: "placeholder",
  },
  {
    slug: "ferrari-f2004",
    name: "Ferrari F2004",
    team: "ferrari",
    year: 2004,
    chassisName: "F2004",
    engineManufacturer: "Ferrari",
    engineConfig: "V10",
    capacityLiters: 3.0,
    dataConfidence: "placeholder",
  },
  {
    slug: "williams-fw26",
    name: "Williams FW26",
    team: "williams",
    year: 2004,
    chassisName: "FW26",
    engineManufacturer: "BMW",
    engineConfig: "V10",
    capacityLiters: 3.0,
    dataConfidence: "placeholder",
  },
  {
    slug: "mclaren-mp4-19",
    name: "McLaren MP4-19",
    team: "mclaren",
    year: 2004,
    chassisName: "MP4-19",
    engineManufacturer: "Mercedes",
    engineConfig: "V10",
    capacityLiters: 3.0,
    dataConfidence: "placeholder",
  },
  {
    slug: "red-bull-rb7",
    name: "Red Bull RB7",
    team: "red-bull-racing",
    year: 2011,
    chassisName: "RB7",
    engineManufacturer: "Renault",
    engineConfig: "V8",
    capacityLiters: 2.4,
    dataConfidence: "placeholder",
  },
  {
    slug: "ferrari-150-italia",
    name: "Ferrari 150° Italia",
    team: "ferrari",
    year: 2011,
    chassisName: "150° Italia",
    engineManufacturer: "Ferrari",
    engineConfig: "V8",
    capacityLiters: 2.4,
    dataConfidence: "placeholder",
  },
  {
    slug: "red-bull-rb9",
    name: "Red Bull RB9",
    team: "red-bull-racing",
    year: 2013,
    chassisName: "RB9",
    engineManufacturer: "Renault",
    engineConfig: "V8",
    capacityLiters: 2.4,
    dataConfidence: "placeholder",
  },
  {
    slug: "mercedes-f1-w04",
    name: "Mercedes F1 W04",
    team: "mercedes",
    year: 2013,
    chassisName: "F1 W04",
    engineManufacturer: "Mercedes",
    engineConfig: "V8",
    capacityLiters: 2.4,
    dataConfidence: "placeholder",
  },
  {
    slug: "mercedes-w12",
    name: "Mercedes-AMG F1 W12",
    team: "mercedes",
    year: 2021,
    chassisName: "F1 W12",
    engineManufacturer: "Mercedes",
    engineConfig: "V6 turbo hybrid",
    capacityLiters: 1.6,
    dataConfidence: "placeholder",
  },
  {
    slug: "red-bull-rb16b",
    name: "Red Bull RB16B",
    team: "red-bull-racing",
    year: 2021,
    chassisName: "RB16B",
    engineManufacturer: "Honda",
    engineConfig: "V6 turbo hybrid",
    capacityLiters: 1.6,
    dataConfidence: "placeholder",
  },
];


export type SeedDriverTeamSeason = {
  driver: string;
  team: string;
  year: number;
  car?: string;
};

/** Championship-winning pairings from the seeded seasons, plus their title rivals. */
export const seedDriverTeamSeasons: SeedDriverTeamSeason[] = [
  {
    driver: "giuseppe-farina",
    team: "alfa-romeo",
    year: 1950,
    car: "alfa-romeo-158",
  },
  {
    driver: "juan-manuel-fangio",
    team: "alfa-romeo",
    year: 1950,
    car: "alfa-romeo-158",
  },
  { driver: "ayrton-senna", team: "mclaren", year: 1988, car: "mclaren-mp4-4" },
  { driver: "alain-prost", team: "mclaren", year: 1988, car: "mclaren-mp4-4" },
  {
    driver: "nigel-mansell",
    team: "williams",
    year: 1992,
    car: "williams-fw14b",
  },
  {
    driver: "michael-schumacher",
    team: "benetton",
    year: 1994,
    car: "benetton-b194",
  },
  {
    driver: "mika-hakkinen",
    team: "mclaren",
    year: 1998,
    car: "mclaren-mp4-13",
  },
  {
    driver: "michael-schumacher",
    team: "ferrari",
    year: 1998,
    car: "ferrari-f300",
  },
  {
    driver: "michael-schumacher",
    team: "ferrari",
    year: 2000,
    car: "ferrari-f1-2000",
  },
  {
    driver: "michael-schumacher",
    team: "ferrari",
    year: 2004,
    car: "ferrari-f2004",
  },
  {
    driver: "kimi-raikkonen",
    team: "mclaren",
    year: 2004,
    car: "mclaren-mp4-19",
  },
  {
    driver: "sebastian-vettel",
    team: "red-bull-racing",
    year: 2011,
    car: "red-bull-rb7",
  },
  {
    driver: "fernando-alonso",
    team: "ferrari",
    year: 2011,
    car: "ferrari-150-italia",
  },
  {
    driver: "sebastian-vettel",
    team: "red-bull-racing",
    year: 2013,
    car: "red-bull-rb9",
  },
  {
    driver: "lewis-hamilton",
    team: "mercedes",
    year: 2013,
    car: "mercedes-f1-w04",
  },
  {
    driver: "lewis-hamilton",
    team: "mercedes",
    year: 2021,
    car: "mercedes-w12",
  },
  {
    driver: "max-verstappen",
    team: "red-bull-racing",
    year: 2021,
    car: "red-bull-rb16b",
  },
];
