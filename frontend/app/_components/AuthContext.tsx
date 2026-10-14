"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

type Member = { name: string; email: string };
type AuthContextValue = { member: Member | null; ready: boolean; signIn: (member: Member) => void; signOut: () => void };

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
    signOut: () => { window.localStorage.removeItem(storageKey); setMember(null); },
  }), [member, ready]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
