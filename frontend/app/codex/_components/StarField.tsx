"use client";

import { useEffect, useRef } from "react";
import styles from "./RecipeCodex.module.css";

// 큰 반짝이 별: 길고 반투명한 뒤 별 + 작고 밝은 앞 별 (그라데이션은 CodexStarDefs 가 정의)
export const STAR_SVG =
  '<svg viewBox="-70 -125 140 250">' +
  `<polygon class="${styles.starBack}" points="0,-112 7.5,-7.5 62,0 7.5,7.5 0,112 -7.5,7.5 -62,0 -7.5,-7.5" fill="url(#codexStarOut)" stroke="url(#codexStarOut)" stroke-width="7" stroke-linejoin="round"/>` +
  '<polygon points="0,-45 7.5,-7.5 21,0 7.5,7.5 0,45 -7.5,7.5 -21,0 -7.5,-7.5" fill="url(#codexStarIn)" stroke="url(#codexStarIn)" stroke-width="6" stroke-linejoin="round"/></svg>';

export function CodexStarDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <radialGradient id="codexStarIn" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset=".6" stopColor="#FFFDF3" />
          <stop offset="1" stopColor="#FFF8DC" stopOpacity=".9" />
        </radialGradient>
        <radialGradient id="codexStarOut" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#FFF8DC" stopOpacity=".55" />
          <stop offset=".5" stopColor="#FFF0BF" stopOpacity=".28" />
          <stop offset="1" stopColor="#FFF0BF" stopOpacity=".1" />
        </radialGradient>
      </defs>
    </svg>
  );
}

// 부모 영역에 별을 뿌린다. data-star-avoid 가 붙은 요소(글자·판·고양이) 위는 피하고,
// 빈 공간이 넓은 곳일수록 큰 반짝이를 둔다. 같은 seed 면 항상 같은 자리.
export default function StarField({ seed, density, className }: { seed: number; density: number; className?: string }) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const scope = layer?.parentElement;
    if (!layer || !scope) return;

    function sprinkle() {
      if (!layer || !scope) return;
      const box = layer.getBoundingClientRect();
      if (!box.width || !box.height) return;
      const avoid = Array.from(scope.querySelectorAll<HTMLElement>("[data-star-avoid]"))
        .map((el) => el.getBoundingClientRect())
        .filter((r) => r.width && r.height)
        .map((r) => ({ l: r.left - box.left, t: r.top - box.top, r: r.right - box.left, b: r.bottom - box.top }));
      let s = seed;
      const rand = () => {
        s = (s * 9301 + 49297) % 233280;
        return s / 233280;
      };
      const dist = (x: number, y: number) =>
        avoid.reduce((m, a) => Math.min(m, Math.hypot(Math.max(a.l - x, 0, x - a.r), Math.max(a.t - y, 0, y - a.b))), Infinity);

      const count = Math.round((box.width * box.height) / density);
      let html = "";
      let bigCount = 0;
      for (let i = 0; i < count; i++) {
        const x = rand() * box.width;
        const y = rand() * box.height;
        const d = dist(x, y);
        const roll = rand();
        const anim = `--o:${(0.45 + rand() * 0.55).toFixed(2)};--d:${(3 + rand() * 4).toFixed(1)}s;--delay:${(-rand() * 6).toFixed(1)}s;`;
        if (d < 14) continue;
        if (d > 110 && roll < 0.16 && bigCount < 9) {
          const big = 40 + rand() * 30;
          bigCount++;
          html += `<span class="${styles.sp}" style="left:${(x - big * 0.28).toFixed(1)}px;top:${(y - big / 2).toFixed(1)}px;width:${(big * 0.56).toFixed(1)}px;height:${big.toFixed(1)}px;${anim}">${STAR_SVG}</span>`;
          continue;
        }
        const size = d > 80 ? 2.6 + rand() * 2.6 : 1.6 + rand() * 1.6;
        html += `<span class="${styles.st}${rand() < 0.3 ? ` ${styles.warm}` : ""}" style="left:${x.toFixed(1)}px;top:${y.toFixed(1)}px;width:${size.toFixed(1)}px;height:${size.toFixed(1)}px;${anim}"></span>`;
      }
      layer.innerHTML = html;
    }

    let timer = 0;
    const later = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(sprinkle, 150);
    };
    sprinkle();
    const observer = new ResizeObserver(later);
    observer.observe(scope);
    window.addEventListener("load", later);
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener("load", later);
    };
  }, [seed, density]);

  return <div ref={layerRef} className={className} aria-hidden="true" />;
}
