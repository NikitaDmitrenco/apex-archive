import { PlaceholderPage } from "@/components/archive/placeholder-page";

export default async function SeasonDetailPage({
  params,
}: PageProps<"/seasons/[year]">) {
  const { year } = await params;

  return (
    <PlaceholderPage
      eyebrow="Season"
      title={year}
      description="World champion, constructors champion, calendar, races, standings and notable events."
      milestone="Milestone 8 — season detail page"
    />
  );
}
