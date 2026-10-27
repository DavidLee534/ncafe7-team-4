"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_components/AuthContext";

export default function MemberGate({ children }: { children: ReactNode }) {
  const { member, ready } = useAuth();
  const router = useRouter();
  useEffect(() => { if (ready && !member) router.replace("/login"); }, [ready, member, router]);
  return ready && member ? children : <p style={{ padding: "3rem", color: "white" }}>회원 정보를 확인하고 있어요…</p>;
}
