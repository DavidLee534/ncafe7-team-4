"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { apiSend } from "@/lib/apiClient";

// 로그인 여부는 백엔드 세션(JSESSIONID 쿠키)이 판단한다. 여기서는 로그인 응답을 화면 표시용으로만 기억해 둔다
export type Member = { id: number; email: string; nickname: string; role: "member" | "admin" };
type AuthContextValue = { member: Member | null; ready: boolean; signIn: (member: Member) => void; signOut: () => Promise<void> };

const storageKey = "nyan-cafe-member";
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<Member | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) setMember(JSON.parse(saved) as Member);
    } finally { setReady(true); }
  }, []);

  const value = useMemo(() => ({
    member, ready,
    signIn: (nextMember: Member) => { window.localStorage.setItem(storageKey, JSON.stringify(nextMember)); setMember(nextMember); },
    signOut: async () => {
      await apiSend("POST", "/api/v1/auth/logout");
      window.localStorage.removeItem(storageKey);
      setMember(null);
    },
  }), [member, ready]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
