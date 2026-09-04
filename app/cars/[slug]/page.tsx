import { PlaceholderPage } from "@/components/archive/placeholder-page";

export default async function CarDetailPage({
  params,
}: PageProps<"/cars/[slug]">) {
  const { slug } = await params;

  return (
    <PlaceholderPage
      eyebrow="Car"
      title={slug}
      description="Technical specifications, season, team, drivers and championship record for this car."
      milestone="Milestone 4 — car detail page"
    />
  );
}
