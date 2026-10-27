import ShowcaseForm from "../../_components/ShowcaseForm";

export default async function EditShowcasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ShowcaseForm id={Number(id)} />;
}
