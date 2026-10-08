import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import MagicWorkshopShell from "./_components/MagicWorkshopShell";

export const metadata: Metadata = {
  title: { default: "NCafe", template: "%s - NCafe" },
  description: "개발자를 위한 공유 카페 NCafe — 메뉴 조회와 온라인 주문",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // data-theme="light": 시스템이 다크 모드여도 밝은 테마로 고정한다 (@newtil/design-tokens 의 수동 지정)
    <html lang="ko" data-theme="light">
      <head>
        {/* Material Symbols 아이콘 폰트 — @newtil/materials 가 CSS @import 로 불러오지만 Turbopack 은 외부 @import 를 버리므로 link 로 직접 싣는다 */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body><MagicWorkshopShell>{children}</MagicWorkshopShell></body>
    </html>
  );
}
