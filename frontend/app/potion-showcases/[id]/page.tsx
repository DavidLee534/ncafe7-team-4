import ShowcaseDetailView from "../_components/ShowcaseDetailView";

export default async function ShowcaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ShowcaseDetailView id={Number(id)} />;
}
