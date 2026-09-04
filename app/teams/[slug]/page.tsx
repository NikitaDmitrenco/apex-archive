import { PlaceholderPage } from "@/components/archive/placeholder-page";

export default async function TeamDetailPage({
  params,
}: PageProps<"/teams/[slug]">) {
  const { slug } = await params;

  return (
    <PlaceholderPage
      eyebrow="Team"
      title={slug}
      description="Championships, wins, drivers, cars and seasons across the team's history."
      milestone="Milestone 6 — team detail page"
    />
  );
}
