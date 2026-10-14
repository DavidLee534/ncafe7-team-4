"use client";

import { type RefObject, useCallback, useEffect, useRef } from "react";
import styles from "./RecipeCodex.module.css";

// 도감 진행도(%)에 따라 바뀌는 모카 점장의 말풍선
const TIERS: [number, string][] = [
  [0, "공방에 온 걸 환영한다냥. 첫 포션부터 빚어 보라냥!"],
  [20, "제법이다냥! 이 정도면 견습 연금술사라고 불러 주겠다냥."],
  [40, "벌써 이만큼 모았냥? 내 비밀 레시피가 위험하다냥…"],
  [60, "훌륭하다냥! 슬슬 전설 레시피 냄새가 날 거다냥."],
  [80, "거의 다 왔다냥! 마지막 몇 칸이 제일 어렵다냥."],
  [100, "도감을 전부 채웠다냥! 오늘부터 너도 대연금술사다냥 ✨"],
];

export function mokaLine(percent: number) {
  const line = TIERS.reduce((picked, [min, text]) => (percent >= min ? text : picked), TIERS[0][1]);
  return `${line} (도감 ${percent}%)`;
}

// 도감 판 양옆에 서 있는 모카 두 마리 (넓은 화면에서만 보임).
// 고양이 발이 판 아래 끝보다 조금 위에 오도록, 말풍선은 오른쪽 고양이 머리 위에 오도록 맞춘다.
export default function MokaScenes({ boardRef, percent }: { boardRef: RefObject<HTMLDivElement | null>; percent: number }) {
  const figRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bubbleRef = useRef<HTMLDivElement>(null);

  const place = useCallback(() => {
    const board = boardRef.current;
    if (!board) return;
    figRefs.current.forEach((fig) => {
      const img = fig?.querySelector("img");
      if (!fig || !img || !img.naturalWidth || !fig.offsetParent) return;
      fig.style.marginTop = `${Math.max(-150, board.offsetTop + board.offsetHeight - img.offsetHeight - 120)}px`;
    });
    const bubble = bubbleRef.current;
    const rightImg = figRefs.current[1]?.querySelector("img");
    if (bubble && rightImg && rightImg.naturalWidth && bubble.offsetParent) {
      const headTop = rightImg.clientHeight * 0.24; // 그림 속 모자 끝 높이쯤
      bubble.style.top = `${Math.max(8, headTop - bubble.offsetHeight - 14)}px`;
    }
  }, [boardRef]);

  useEffect(() => {
    place();
    const observer = new ResizeObserver(place);
    if (boardRef.current) observer.observe(boardRef.current);
    window.addEventListener("resize", place);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", place);
    };
  }, [boardRef, place]);

  // 대사가 바뀌면 말풍선 높이가 달라질 수 있으니 다시 맞추고 살짝 튀어 오르게
  useEffect(() => {
    place();
    const bubble = bubbleRef.current;
    if (!bubble) return;
    bubble.classList.remove(styles.pop);
    void bubble.offsetWidth;
    bubble.classList.add(styles.pop);
  }, [percent, place]);

  return (
    <>
      <div className={`${styles.deco} ${styles.decoLeft}`} aria-hidden="true">
        <div className={styles.fig} ref={(el) => { figRefs.current[0] = el; }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/codex/codex-moka-left.jpg" alt="" data-star-avoid onLoad={place} />
        </div>
      </div>
      <div className={`${styles.deco} ${styles.decoRight}`}>
        <div className={styles.fig} ref={(el) => { figRefs.current[1] = el; }}>
          <div className={styles.bubble} ref={bubbleRef} role="status" aria-live="polite">
            <small>모카 점장</small>
            <p>{mokaLine(percent)}</p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/codex/codex-moka-right.jpg" alt="" data-star-avoid onLoad={place} />
        </div>
      </div>
    </>
  );
}
