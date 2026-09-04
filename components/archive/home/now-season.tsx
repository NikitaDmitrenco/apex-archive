import Link from "next/link";

import { Container, Section } from "@/components/ui/container";
import { Display, Eyebrow } from "@/components/ui/typography";
import type {
  ConstructorStandingRow,
  DriverStandingRow,
} from "@/lib/db/queries/seasons";
import { formatPoints, orDash } from "@/lib/format";

type NowSeasonProps = {
  year: number;
  summary: string | null;
  drivers: DriverStandingRow[];
  constructors: ConstructorStandingRow[];
};

export function NowSeason({
  year,
  summary,
  drivers,
  constructors,
}: NowSeasonProps) {
  const hasStandings = drivers.length > 0 || constructors.length > 0;

  return (
    <Section className="border-border border-b">
      <Container>
        <div className="border-border flex flex-wrap items-end justify-between gap-6 border-b pb-6">
          <div>
            <Eyebrow>Now</Eyebrow>
            <Display as="h2" size="md" className="mt-4">
              {year} Season
            </Display>
          </div>
          <Link
            href={`/seasons/${year}`}
            className="text-muted-foreground hover:text-foreground font-mono text-[0.7rem] tracking-[0.16em] uppercase transition-colors"
          >
            Season page
          </Link>
        </div>

        {summary ? (
          <p className="text-muted-foreground mt-8 max-w-2xl leading-relaxed">
            {summary}
          </p>
        ) : null}

        {hasStandings ? (
          <div className="mt-12 grid gap-12 lg:grid-cols-2">
            <div>
              <Eyebrow>Drivers</Eyebrow>
              <table className="mt-6 w-full text-left">
                <caption className="sr-only">
                  Drivers&apos; championship standings for {year}
                </caption>
                <thead>
                  <tr className="text-muted-foreground border-border border-b font-mono text-[0.65rem] tracking-[0.14em] uppercase">
                    <th scope="col" className="w-10 py-3 font-normal">
                      Pos
                    </th>
                    <th scope="col" className="py-3 font-normal">
                      Driver
                    </th>
                    <th scope="col" className="py-3 text-right font-normal">
                      Wins
                    </th>
                    <th scope="col" className="py-3 text-right font-normal">
                      Points
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.map((row) => (
                    <tr key={row.driverSlug} className="border-border border-b">
                      <td className="text-muted-foreground py-4 font-mono text-sm">
                        {row.position}
                      </td>
                      <td className="py-4">
                        <Link
                          href={`/drivers/${row.driverSlug}`}
                          className="hover:text-primary transition-colors"
                        >
                          {row.driverName}
                        </Link>
                        <span className="text-muted-foreground mt-1 block font-mono text-[0.65rem] tracking-[0.14em] uppercase">
                          {row.teamName}
                        </span>
                      </td>
                      <td className="py-4 text-right font-mono text-sm">
                        {orDash(row.wins)}
                      </td>
                      <td className="py-4 text-right font-mono text-sm">
                        {formatPoints(row.points)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <Eyebrow>Constructors</Eyebrow>
              <table className="mt-6 w-full text-left">
                <caption className="sr-only">
                  Constructors&apos; championship standings for {year}
                </caption>
                <thead>
                  <tr className="text-muted-foreground border-border border-b font-mono text-[0.65rem] tracking-[0.14em] uppercase">
                    <th scope="col" className="w-10 py-3 font-normal">
                      Pos
                    </th>
                    <th scope="col" className="py-3 font-normal">
                      Constructor
                    </th>
                    <th scope="col" className="py-3 text-right font-normal">
                      Wins
                    </th>
                    <th scope="col" className="py-3 text-right font-normal">
                      Points
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {constructors.map((row) => (
                    <tr key={row.teamSlug} className="border-border border-b">
                      <td className="text-muted-foreground py-4 font-mono text-sm">
                        {row.position}
                      </td>
                      <td className="py-4">
                        <Link
                          href={`/teams/${row.teamSlug}`}
                          className="hover:text-primary transition-colors"
                        >
                          {row.teamName}
                        </Link>
                      </td>
                      <td className="py-4 text-right font-mono text-sm">
                        {orDash(row.wins)}
                      </td>
                      <td className="py-4 text-right font-mono text-sm">
                        {formatPoints(row.points)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground mt-8 font-mono text-[0.7rem] tracking-[0.14em] uppercase">
            No standings recorded for this season yet
          </p>
        )}
      </Container>
    </Section>
  );
}
