import Link from "next/link";

import { Container, Section } from "@/components/ui/container";
import { Display } from "@/components/ui/typography";
import type { SearchResults } from "@/lib/db/queries/search";
import { orDash } from "@/lib/format";

function padCount(count: number): string {
  return String(count).padStart(2, "0");
}

function ResultRow({
  href,
  primary,
  secondary,
}: {
  href: string;
  primary: string;
  secondary: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className="group border-border hover:bg-accent -mx-2 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-b px-2 py-5 transition-colors sm:mx-0 sm:px-4"
      >
        <span className="font-display group-hover:text-primary flex-1 text-2xl font-light tracking-[-0.01em] transition-colors md:text-3xl">
          {primary}
        </span>
        <span className="text-muted-foreground w-full font-mono text-[0.7rem] tracking-[0.14em] uppercase sm:w-auto">
          {secondary}
        </span>
      </Link>
    </li>
  );
}

function GroupHeader({ label, count }: { label: string; count: number }) {
  return (
    <div className="border-border border-b py-6">
      <h2 className="spec-label text-muted-foreground">
        {label} · {padCount(count)}
      </h2>
    </div>
  );
}

/**
 * Server-rendered grouped results for `/search`. Renders each entity type that has at
 * least one hit, in a fixed order (Drivers, Teams, Seasons, Circuits, Cars). When the
 * query was non-empty but produced no hits, renders the editorial empty state in place of
 * the groups.
 */
export function SearchResults({ results }: { results: SearchResults }) {
  const hasAny =
    results.drivers.length > 0 ||
    results.teams.length > 0 ||
    results.seasons.length > 0 ||
    results.circuits.length > 0 ||
    results.cars.length > 0;

  if (!hasAny) {
    return (
      <Container>
        <Section className="border-border mt-14 border-t">
          <Display as="p" size="sm">
            Nothing in the archive matches that query yet.
          </Display>
          <p className="text-muted-foreground mt-6 max-w-md leading-relaxed">
            The archive is a curated set rather than a complete record, so a
            driver, team, circuit or season that raced in the sport may still
            have no entry here, or the wording may not match how it is
            catalogued. Try a shorter phrase, a name, or a year.
          </p>
        </Section>
      </Container>
    );
  }

  return (
    <Container>
      <div className="mt-14">
        {results.drivers.length > 0 ? (
          <section className="border-border border-b">
            <GroupHeader label="Drivers" count={results.drivers.length} />
            <ul>
              {results.drivers.map((driver) => (
                <ResultRow
                  key={driver.slug}
                  href={`/drivers/${driver.slug}`}
                  primary={driver.fullName}
                  secondary={driver.nationality}
                />
              ))}
            </ul>
          </section>
        ) : null}

        {results.teams.length > 0 ? (
          <section className="border-border border-b">
            <GroupHeader label="Teams" count={results.teams.length} />
            <ul>
              {results.teams.map((team) => (
                <ResultRow
                  key={team.slug}
                  href={`/teams/${team.slug}`}
                  primary={team.name}
                  secondary={team.nationality}
                />
              ))}
            </ul>
          </section>
        ) : null}

        {results.seasons.length > 0 ? (
          <section className="border-border border-b">
            <GroupHeader label="Seasons" count={results.seasons.length} />
            <ul>
              {results.seasons.map((season) => (
                <ResultRow
                  key={season.year}
                  href={`/seasons/${season.year}`}
                  primary={String(season.year)}
                  secondary={orDash(season.summary)}
                />
              ))}
            </ul>
          </section>
        ) : null}

        {results.circuits.length > 0 ? (
          <section className="border-border border-b">
            <GroupHeader label="Circuits" count={results.circuits.length} />
            <ul>
              {results.circuits.map((circuit) => (
                <ResultRow
                  key={circuit.slug}
                  href={`/circuits/${circuit.slug}`}
                  primary={circuit.name}
                  secondary={circuit.country}
                />
              ))}
            </ul>
          </section>
        ) : null}

        {results.cars.length > 0 ? (
          <section>
            <GroupHeader label="Cars" count={results.cars.length} />
            <ul>
              {results.cars.map((car) => (
                <ResultRow
                  key={car.slug}
                  href={`/cars/${car.slug}`}
                  primary={car.name}
                  secondary={`${car.teamName} · ${car.year}`}
                />
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </Container>
  );
}
