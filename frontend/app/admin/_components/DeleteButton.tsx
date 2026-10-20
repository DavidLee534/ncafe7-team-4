"use client";
// 백엔드에 DELETE 를 보내는 삭제 버튼. 확인 창 → 삭제 → redirectHref 로 이동(없으면 지금 화면 새로고침).
// 백엔드가 거절하면(예: 메뉴가 있는 카테고리) 받은 메시지를 알림으로 띄운다.
import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { apiSend } from "@/lib/apiClient";

export default function DeleteButton({
  path,
  confirmMessage,
  redirectHref,
  className,
  disabled,
  title,
  children,
}: {
  path: string; // 예: /api/v1/admin/menus/3
  confirmMessage: string;
  redirectHref?: string;
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
      await apiSend("DELETE", path);
      if (redirectHref) router.push(redirectHref);
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
