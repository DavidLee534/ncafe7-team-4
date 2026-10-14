"use client";

import { useOrders } from "@/lib/orders";
import styles from "./MembershipStatus.module.css";

const levels = [
  { name: "수습생", requiredOrders: 0, badge: "APPRENTICE" },
  { name: "달빛 연금사", requiredOrders: 5, badge: "MOONLIGHT" },
  { name: "별빛 마도사", requiredOrders: 20, badge: "STARLIGHT" },
] as const;

export default function MembershipStatus() {
  const orders = useOrders();
  const orderCount = orders?.length ?? 0;
  const levelIndex = orderCount >= 20 ? 2 : orderCount >= 5 ? 1 : 0;
  const level = levels[levelIndex];

  return <section className={styles.badge} data-level={levelIndex} aria-label={`멤버십 등급 ${level.name}`}>
    <span>{level.badge}</span>
    <strong>{level.name}</strong>
  </section>;
}
