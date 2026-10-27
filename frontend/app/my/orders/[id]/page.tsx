import OrderDetailView from "./_components/OrderDetailView";

export default async function MyOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrderDetailView id={Number(id)} />;
}
