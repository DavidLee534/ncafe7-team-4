// 주문 상세 — 밤하늘 헤더(주문번호·상태·상태 변경) · 주문 정보 · 주문 항목 · 결제 정보. 없는 id면 404.
// 페이지는 데이터를 준비해서 배치만 하고, 각 칸은 받은 값을 보여주기만 한다.
import Link from "next/link";
import { notFound } from "next/navigation";
import AdminPageHeader, { headerOverlap } from "../../_components/AdminPageHeader";
import OrderStatusActions from "../../_components/OrderStatusActions";
import OrderStatusBadge from "../../_components/OrderStatusBadge";
import OrderDetailInfo from "./_components/OrderDetailInfo";
import OrderDetailItems from "./_components/OrderDetailItems";
import OrderDetailPayment from "./_components/OrderDetailPayment";
import { getOrder } from "@/lib/adminApi";

export default async function AdminOrderDetailPage(props: PageProps<"/admin/orders/[id]">) {
  const { id } = await props.params;
  const order = await getOrder(Number(id));
  if (!order) notFound();

  return (
    <>
      <AdminPageHeader
        crumb={`ORDERS / ${order.orderNumber}`}
        title={
          <>
            {order.orderNumber} <OrderStatusBadge status={order.status} className="vertical-align:middle" />
          </>
        }
        description={`주문 번호 #${order.id} · ${order.createdAt} 주문 · ${order.updatedAt} 상태 변경`}
        actions={
          <>
            <Link href="/admin/orders" className="m3-btn btn:outlined">
              목록으로
            </Link>
            <OrderStatusActions order={order} size="md" />
          </>
        }
      />

      <div
        className={`display:grid grid-template-columns:1 gap:5 md:grid-template-columns:ex align-items:start ${headerOverlap}`}
        style={{ "--grid-template-columns-ex": "minmax(0, 2fr) minmax(0, 1fr)" }}
      >
        <div className="display:flex flex-direction:column gap:5">
          <OrderDetailInfo order={order} />
          <OrderDetailItems order={order} />
        </div>
        <OrderDetailPayment payment={order.payment} />
      </div>
    </>
  );
}
