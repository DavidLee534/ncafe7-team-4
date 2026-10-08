"use client";

import { useState } from "react";
import styles from "./MenuCatalog.module.css";

export default function MokaMessage({ message }: { message: string }) {
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
        <span className={styles.messageLabel}>MOKA&apos;S CATEGORY REPORT</span>
        <p>{message}</p>
      </div>
      <span className={styles.messagePaw} aria-hidden="true">🐾</span>
      <button type="button" className={styles.messageClose} onClick={() => setMinimized(true)} aria-label="모카 점장 메시지 최소화">×</button>
    </section>
  );
}
