"use client";

import { type ReactNode, useEffect, useState } from "react";
import styles from "./MagicWorkshopShell.module.css";

type Sparkle = { id: number; x: number; y: number };

export default function MagicWorkshopShell({ children }: { children: ReactNode }) {
  const [night, setNight] = useState(true);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    const themeTimer = window.setTimeout(() => {
      const saved = window.localStorage.getItem("nyang-bakery-theme");
      const hour = new Date().getHours();
      setNight(saved ? saved === "night" : hour >= 18 || hour < 6);
      setReady(true);
    }, 0);
    const loadingTimer = window.setTimeout(() => setLoading(false), 720);
    return () => {
      window.clearTimeout(themeTimer);
      window.clearTimeout(loadingTimer);
    };
  }, []);

  function toggleTheme() {
    const next = !night;
    setNight(next);
    window.localStorage.setItem("nyang-bakery-theme", next ? "night" : "day");
  }

  function castSparkle(event: React.MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    const navigationLink = target.closest("a[href]");
    if (navigationLink) {
      setLoading(true);
      window.setTimeout(() => setLoading(false), 520);
    }
    const sparkle = { id: Date.now(), x: event.clientX, y: event.clientY };
    setSparkles((items) => [...items, sparkle]);
    window.setTimeout(() => setSparkles((items) => items.filter((item) => item.id !== sparkle.id)), 650);
  }

  return (
    <div className={`${styles.shell} ${night ? styles.night : styles.day}`} onClick={castSparkle}>
      <button type="button" className={styles.themeSwitch} onClick={toggleTheme} aria-label={night ? "낮 모드로 전환" : "밤 모드로 전환"}>
        <span aria-hidden="true">{night ? "🌙" : "☀️"}</span>
        <small>{night ? "마법의 밤" : "조용한 낮"}</small>
      </button>

      {ready && !night && (
        <section className={styles.dayGate} aria-live="polite">
          <div className={styles.dayMessage}>
            <span aria-hidden="true">💤</span>
            <p>GOOD MORNING, HUMAN</p>
            <h1>고양이 마법사들이<br />자는 시간이에요</h1>
            <strong>오후 6시가 되면 공방의 불이 켜져요.</strong>
            <button type="button" onClick={toggleTheme}>달빛으로 공방 열기 🌙</button>
          </div>
        </section>
      )}

      {children}
      {sparkles.map((sparkle) => <span key={sparkle.id} className={styles.sparkle} style={{ left: sparkle.x, top: sparkle.y }} aria-hidden="true">✦</span>)}
      {loading && (
        <div className={styles.loader} role="status" aria-label="마법 반죽을 준비하고 있어요">
          <p>냥이 마법사들이 오늘의 빵을 굽고 있어요</p>
          <div className={styles.loaderSteps}>
            <div className={`${styles.loaderStep} ${styles.doughStep}`}><span className={styles.doughBall} aria-hidden="true" /></div>
            <div className={`${styles.loaderStep} ${styles.kneadStep}`}><span className={styles.kneadPaw} aria-hidden="true">🐾</span></div>
            <div className={`${styles.loaderStep} ${styles.ovenStep}`}><span className={styles.oven} aria-hidden="true"><i>🍞</i></span></div>
          </div>
        </div>
      )}
    </div>
  );
}
