import Link from "next/link";

import { Container } from "@/components/ui/container";
import { ERAS, type Era, formatEraRange } from "@/lib/constants/eras";

/**
 * Editorial copy for each era. Boundaries and labels are in lib/constants/eras; the
 * paragraph fills the human context — what the cars looked like, who drove them, why the
 * rule change mattered. Kept brief on purpose; the timeline reads at a glance rather than
 * as long-form.
 */
const ERA_PARAGRAPHS: Record<string, string> = {
  "front-engine":
    "The championship opened in 1950 with front-engine layouts descended from the pre-war voiturette class. Alfa Romeo's 158/159 dominated the first two seasons, carrying Juan Manuel Fangio to the first of his five titles in 1951. Mercedes-Benz arrived in 1954 with the W196 — run in both open-wheel and streamlined form — and won everything it entered before withdrawing at the end of 1955. By the end of the decade, rear-engined chassis from Cooper had begun to win, foreshadowing the layout that would dominate the sport for the next forty years.",
  "1-5-litre":
    "The FIA dropped the engine formula to 1.5 litres for 1961, a restriction introduced alongside the international ban on the sport's larger engines after the 1955 Le Mans disaster. The smaller power units made monocoque chassis viable, and the Lotus 25 — designed by Colin Chapman with an aluminium bathtub tub — was the era's defining car. Jim Clark won the 1963 championship in it. Ferrari's front-engined 156 won the 1961 constructors' equivalent before the works team withdrew from the championship at the end of 1964. The formula was widely considered too restrictive by 1965, and the FIA announced a return to multi-litre engines.",
  "3-litre-turbo":
    "The 3-litre formula arrived in 1966 and quickly produced some of the most powerful engines in the sport's history. Ford's DFV V8, Ferrari's flat-12 and the Alfa Romeo flat-12 defined the early years; Lotus's introduction of ground effect in 1977 with the 78 and 79 reshaped chassis design. The turbocharger arms race from the late 1970s saw qualifying engines producing well over 1,000 hp before the FIA restricted boost pressures. Brabham–BMW's Nelson Piquet won the 1981 and 1983 titles with the first turbo cars to take the championship. The formula ended with the turbo ban in 1988.",
  "3-5-litre":
    "Turbos were banned from the end of 1988 and replaced by 3.5-litre naturally aspirated engines, most commonly V8s and V10s. McLaren–Honda dominated the constructors' championship in 1989 and 1990, with the Senna–Prost rivalry as the era's emotional centre. Williams's active-suspension FW14B carried Nigel Mansell to the 1992 title and Alain Prost to his fourth championship in 1993. The 1994 season was marred by the deaths of Ayrton Senna at Imola and Roland Ratzenberger at the same meeting; the FIA responded by banning electronic driver aids and raising the front wing edge.",
  v10: "Naturally aspirated V10s became the grid's defining configuration, with Renault, Ferrari, Mercedes-Benz and Honda all producing competitive units. Michael Schumacher and Ferrari won five consecutive drivers' titles from 2000 to 2004 and six constructors' championships in a row from 1999 to 2004. Refuelling was permitted from 1994 and turned race strategy into a discipline of its own, with cars running light in qualifying and full at the start. The era ended with Renault and Fernando Alonso winning the 2005 championship — Alonso, at 24, the youngest champion in the sport's history at the time.",
  v8: "The 2.4-litre V8 formula arrived in 2006, tightening the grid's competitive range and forcing manufacturers to optimise smaller, revvier engines. Renault and Ferrari traded titles at the start of the period before Red Bull Racing's Adrian Newey–led design team won four consecutive constructors' and drivers' doubles from 2010 to 2013 with Sebastian Vettel. KERS, the kinetic energy recovery system, was introduced in 2009 as a precursor to the hybrid era. Lewis Hamilton joined Mercedes from McLaren at the end of 2012, setting up the dominance that would define the next period.",
  hybrid:
    "The 1.6-litre V6 turbo hybrid power unit — combining an internal combustion engine with two motor-generator units recovering heat and kinetic energy — brought the sport its most efficient and complex engines yet. Mercedes won eight consecutive constructors' championships from 2014 to 2021, with Lewis Hamilton taking six of his seven career drivers' titles in this period. Red Bull Racing and Max Verstappen ended that streak with four consecutive drivers' titles from 2021 to 2024. The era closed with multiple teams competitive at the front: Ferrari and McLaren both won races in the final seasons.",
  "2026-regulations":
    "A new chassis, aerodynamics and power unit package takes effect in 2026, with simplified aerodynamics, an even split between internal combustion and electric power, and 100% sustainable fuels mandated. Audi joins the grid as a factory entrant, and Cadillac enters as the eleventh team with General Motors support. The technical reset is the most significant since the introduction of the hybrid era, with the goal of closer racing and power units that are more relevant to road-car development.",
};

function seasonsInEra(era: Era, years: number[]): number[] {
  return years.filter(
    (year) => year >= era.from && (era.to === undefined || year <= era.to),
  );
}

function EraRow({
  era,
  paragraph,
  seasonYears,
}: {
  era: Era;
  paragraph: string;
  seasonYears: number[];
}) {
  return (
    <article className="border-border py-section-md grid grid-cols-1 gap-x-10 gap-y-6 border-b md:grid-cols-[14rem_1fr]">
      <div>
        <p className="font-display text-3xl font-light tracking-[-0.01em] md:text-5xl">
          {formatEraRange(era)}
        </p>
      </div>

      <div>
        <h2 className="font-display text-2xl font-light tracking-[-0.01em] md:text-3xl">
          {era.label}
        </h2>
        <p className="text-muted-foreground mt-4 max-w-2xl leading-relaxed">
          {paragraph}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
          <Link
            href={`/cars?era=${era.slug}`}
            className="text-muted-foreground hover:text-foreground font-mono text-[0.7rem] tracking-[0.14em] uppercase transition-colors"
          >
            Cars from this era →
          </Link>

          {seasonYears.length > 0 ? (
            <span className="text-muted-foreground font-mono text-[0.7rem] tracking-[0.14em] uppercase">
              <span aria-hidden="true">Seasons · </span>
              {seasonYears.map((year, index) => (
                <span key={year}>
                  {index > 0 ? " · " : ""}
                  <Link
                    href={`/seasons/${year}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {year}
                  </Link>
                </span>
              ))}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}

/**
 * Vertical timeline of Formula 1's regulation eras. Server component: the ERAS list is
 * small enough that no client interactivity is needed. Each era carries its editorial
 * paragraph and the seasons in the archive that fall within its [from, to] range.
 */
export function ErasTimeline({ seasonYears }: { seasonYears: number[] }) {
  return (
    <Container>
      <div>
        {ERAS.map((era) => (
          <EraRow
            key={era.slug}
            era={era}
            paragraph={
              ERA_PARAGRAPHS[era.slug] ??
              "The archive has no editorial entry for this era yet."
            }
            seasonYears={seasonsInEra(era, seasonYears)}
          />
        ))}
      </div>
    </Container>
  );
}
