import { PlaceholderPage } from "@/components/archive/placeholder-page";

export default async function CircuitDetailPage({
  params,
}: PageProps<"/circuits/[slug]">) {
  const { slug } = await params;

  return (
    <PlaceholderPage
      eyebrow="Circuit"
      title={slug}
      description="Layout, location, length, turns, lap records, race history and related seasons."
      milestone="Milestone 7 — circuit detail page"
    />
  );
}
