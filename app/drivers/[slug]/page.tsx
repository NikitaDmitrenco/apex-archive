import { PlaceholderPage } from "@/components/archive/placeholder-page";

export default async function DriverDetailPage({
  params,
}: PageProps<"/drivers/[slug]">) {
  const { slug } = await params;

  return (
    <PlaceholderPage
      eyebrow="Driver"
      title={slug}
      description="Career statistics, championships, timeline, and the teams, cars and seasons behind them."
      milestone="Milestone 5 — driver detail page"
    />
  );
}
