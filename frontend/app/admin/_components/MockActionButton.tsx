"use client";
// 아직 백엔드에 연결하지 않은 동작(삭제 등)의 버튼. 누르면 확인 후 "목업" 안내만 띄운다.
import type { ReactNode } from "react";

export default function MockActionButton({
  confirmMessage,
  className,
  disabled,
  title,
  children,
}: {
  confirmMessage: string;
  className: string;
  disabled?: boolean;
  title?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={className}
      disabled={disabled}
      title={title}
      onClick={() => {
        if (window.confirm(confirmMessage)) {
          window.alert("목업 화면이라 실제로 반영되지 않습니다.");
        }
      }}
    >
      {children}
    </button>
  );
}
