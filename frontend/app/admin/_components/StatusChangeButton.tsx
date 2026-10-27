"use client";
// 백엔드에 PATCH {"status": ...} 를 보내는 상태 변경 버튼. 확인 창 → 변경 → 지금 화면 새로고침.
// 백엔드가 거절하면(예: 순서에 맞지 않는 주문 상태, 관리자 계정 정지) 받은 메시지를 알림으로 띄운다.
import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { apiSend } from "@/lib/apiClient";

export default function StatusChangeButton({
  path,
  status,
  confirmMessage,
  className,
  disabled,
  title,
  children,
}: {
  path: string; // 예: /api/v1/admin/orders/3/status
  status: string; // 바꿀 상태 (예: brewing)
  confirmMessage: string;
  className: string;
  disabled?: boolean;
  title?: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleClick() {
    if (!window.confirm(confirmMessage)) return;
    setPending(true);
    try {
      await apiSend("PATCH", path, { status });
      router.refresh();
    } catch (error) {
      window.alert((error as Error).message);
    } finally {
      setPending(false);
    }
  }

  return (
    <button type="button" className={className} disabled={disabled || pending} title={title} onClick={handleClick}>
      {children}
    </button>
  );
}
