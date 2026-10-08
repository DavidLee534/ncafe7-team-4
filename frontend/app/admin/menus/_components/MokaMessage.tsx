"use client";

import { type ReactNode, useState } from "react";
import styles from "./MenuCatalog.module.css";

export default function MokaMessage({ message, label = "MOKA'S CATEGORY REPORT", children }: { message: string; label?: string; children?: ReactNode }) {
  const [minimized, setMinimized] = useState(false);

  if (minimized) {
    return (
      <button type="button" className={styles.messageDock} onClick={() => setMinimized(false)} aria-label="모카 점장 메시지 펼치기">
        <span aria-hidden="true">🐱</span>
        <small>!</small>
      </button>
    );
  }

  return (
    <section className={styles.mokaMessage} aria-live="polite" aria-label="모카 점장의 카테고리 안내">
      <span className={styles.messageCat} aria-hidden="true">🐱</span>
      <div>
        <span className={styles.messageLabel}>{label}</span>
        <p>{message}</p>
        {children && <div className={styles.messageActions}>{children}</div>}
      </div>
      <span className={styles.messagePaw} aria-hidden="true">🐾</span>
      <button type="button" className={styles.messageClose} onClick={() => setMinimized(true)} aria-label="모카 점장 메시지 최소화">×</button>
    </section>
  );
}
