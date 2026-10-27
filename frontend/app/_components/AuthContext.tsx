"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { memberApi, type Account } from "@/lib/memberApi";

type Member = { name: string; email: string; role?: "member" | "admin" };
type SessionAccount = Account & { role: "member" | "admin" };
type AuthContextValue = { member: Member | null; ready: boolean; signIn: (member: Member) => void; signOut: () => Promise<void> };

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<Member | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    window.localStorage.removeItem("nyan-cafe-member");
    memberApi<SessionAccount>("/auth/me")
      .then(account => setMember({ name: account.nickname, email: account.email, role: account.role }))
      .catch(() => setMember(null))
      .finally(() => setReady(true));
  }, []);

  const value = useMemo(() => ({
    member, ready,
    signIn: (nextMember: Member) => setMember(previous => ({ ...previous, ...nextMember })),
    signOut: async () => {
      try { await memberApi<void>("/auth/logout", { method: "POST" }); }
      catch { /* The local view still signs out if the server is unavailable. */ }
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
