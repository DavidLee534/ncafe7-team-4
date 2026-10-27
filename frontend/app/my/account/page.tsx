"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import UserHeader from "@/app/_components/UserHeader";
import MemberGate from "@/app/potion-showcases/_components/MemberGate";
import { useAuth } from "@/app/_components/AuthContext";
import { memberApi, dateText, type Account } from "@/lib/memberApi";
import styles from "../My.module.css";

export default function AccountPage() {
  const router = useRouter();
  const { signIn, signOut } = useAuth();
  const [account, setAccount] = useState<Account | null>(null);
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => { memberApi<Account>("/my/account").then(data => { setAccount(data); setNickname(data.nickname); setEmail(data.email); }).catch(e => setError(e.message)); }, []);
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setMessage("");
    if (newPassword !== confirmPassword) { setError("새 비밀번호가 일치하지 않습니다."); return; }
    if ((email.trim().toLowerCase() !== account?.email.toLowerCase() || newPassword) && !currentPassword) {
      setError("이메일 또는 비밀번호를 바꾸려면 현재 비밀번호를 입력해 주세요."); return;
    }
    setBusy(true);
    try {
      const data = await memberApi<Account>("/my/account", { method: "PUT", body: JSON.stringify({ nickname, email, currentPassword, newPassword: newPassword || null }) });
      setAccount(data); setEmail(data.email); setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      signIn({ name: data.nickname, email: data.email }); setMessage("회원 정보를 저장했어요.");
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }
  async function withdraw() {
    if (!confirm("정말 탈퇴할까요? 계정은 비활성화됩니다.")) return;
    try { await memberApi<void>("/my/account", { method: "DELETE" }); await signOut(); router.replace("/"); }
    catch (e) { setError((e as Error).message); }
  }
  return <><UserHeader /><MemberGate><main className={styles.page}><div className={styles.inner}><Link href="/my" className={styles.back}>← 마이페이지</Link><header className={styles.hero}><span className={styles.eyebrow}>MY ACCOUNT</span><h1>회원 정보</h1></header>
    {error && <p role="alert" className={styles.error}>{error}</p>}{message && <p role="status" className={styles.success}>{message}</p>}
    {account && <section className={styles.panel}><h2>기본 정보</h2><p className={styles.muted}>가입일: {dateText(account.createdAt).slice(0, 10)}</p><form onSubmit={save}>
      <label className={styles.field}>닉네임<input value={nickname} onChange={e => setNickname(e.target.value)} maxLength={20} required autoComplete="nickname" /></label>
      <label className={styles.field}>이메일<input value={email} onChange={e => setEmail(e.target.value)} type="email" maxLength={254} required autoComplete="email" /></label>
      <h2>비밀번호 변경</h2><p className={styles.muted}>비밀번호를 유지하려면 아래 새 비밀번호 칸을 비워 두세요. 이메일 또는 비밀번호를 변경할 때는 현재 비밀번호가 필요합니다.</p>
      <label className={styles.field}>현재 비밀번호<input value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} type="password" autoComplete="current-password" /></label>
      <label className={styles.field}>새 비밀번호<input value={newPassword} onChange={e => setNewPassword(e.target.value)} type="password" minLength={8} maxLength={72} autoComplete="new-password" /></label>
      <label className={styles.field}>새 비밀번호 확인<input value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} type="password" minLength={8} maxLength={72} autoComplete="new-password" /></label>
      <button className={styles.button} type="submit" disabled={busy}>{busy ? "저장 중…" : "변경 저장"}</button>
    </form></section>}
    <section className={styles.panel}><h2>회원 탈퇴</h2><p className={styles.muted}>탈퇴하면 계정을 비활성화합니다. 기존 주문과 게시글 기록은 유지됩니다.</p><button type="button" className={styles.secondary} onClick={withdraw}>탈퇴하기</button></section>
  </div></main></MemberGate></>;
}
