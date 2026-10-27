"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { apiSend } from "@/lib/apiClient";
import { type Member, useAuth } from "./AuthContext";
import styles from "./AuthPage.module.css";

type AuthMode = "login" | "signup";

export default function AuthPage({ mode }: { mode: AuthMode }) {
  const isLogin = mode === "login";
  const router = useRouter();
  const { signIn } = useAuth();
  const title = isLogin ? "다시 만났네요, 손님냥" : "모카의 공방에 어서 와요";

  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    const nickname = String(form.get("nickname") ?? "").trim();
    setError("");
    setPending(true);
    try {
      if (isLogin) {
        const member = await apiSend<Member>("POST", "/api/v1/auth/login", { email, password });
        signIn(member);
        router.push(member.role === "admin" ? "/admin" : "/mypage");
      } else {
        await apiSend("POST", "/api/v1/auth/signup", { email, password, nickname });
        router.push("/login?signup=complete");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "요청을 처리하지 못했어요.");
    } finally {
      setPending(false);
    }
  };

  return <main className={styles.page}>
    <Link href="/" className={styles.brand}><span>🐱</span><b>nyan cafe</b></Link>
    <section className={styles.layout}>
      <aside className={styles.story}>
        <span>MOONLIGHT MEMBERSHIP</span>
        <h1>{title}</h1>
        <p>로그인하면 모카 점장과 만든 포션, 주문 기록, 발견한 비밀 레시피를 공방 도감에 차곡차곡 남길 수 있어요.</p>
        <div className={styles.cat} aria-hidden="true"><img src="/images/moka-auth-mascot.png" alt="" /></div>
        <ul>
          <li>✦ 나만의 포션 레시피 저장</li>
          <li>✦ 비밀 레시피 도감 수집</li>
          <li>✦ 주문·모의 결제 내역 확인</li>
        </ul>
      </aside>
      <section className={styles.card} aria-labelledby="auth-title">
        <span className={styles.eyebrow}>{isLogin ? "WELCOME BACK" : "CREATE ACCOUNT"}</span>
        <h2 id="auth-title">{isLogin ? "로그인" : "회원가입"}</h2>
        <p className={styles.intro}>{isLogin ? "비밀 레시피를 이어서 만들어 볼까요?" : "몇 가지만 입력하면 공방 수습생이 될 수 있어요."}</p>
        <form onSubmit={submit}>
          {!isLogin && <label>닉네임<input name="nickname" type="text" placeholder="공방에서 사용할 이름" autoComplete="nickname" required /></label>}
          <label>이메일<input name="email" type="email" placeholder="moka@example.com" autoComplete="email" required /></label>
          <label>비밀번호<input name="password" type="password" placeholder="8자 이상 입력" autoComplete={isLogin ? "current-password" : "new-password"} minLength={8} required /></label>
          {!isLogin && <label className={styles.agree}><input type="checkbox" required /> <span>이용 약관과 개인정보 처리방침에 동의해요.</span></label>}
          <button type="submit" disabled={pending}>{isLogin ? "공방으로 로그인" : "수습생 등록하기"}</button>
        </form>
        <p className={styles.feedback} role={error ? "alert" : undefined}>{error || (isLogin ? "수습생 등록을 마쳤다면, 방금 사용한 이메일과 비밀번호로 로그인해 주세요냥." : "등록 후에는 로그인 화면에서 이메일과 비밀번호를 다시 입력해 주세요.")}</p>
        <div className={styles.divider}><span>또는</span></div>
        <Link href="/menu" className={styles.guest}>🌙 비회원으로 메뉴 둘러보기</Link>
        <p className={styles.switch}>{isLogin ? "아직 수습생이 아니신가요?" : "이미 공방 계정이 있나요?"} <Link href={isLogin ? "/signup" : "/login"}>{isLogin ? "회원가입" : "로그인"}</Link></p>
      </section>
    </section>
  </main>;
}
