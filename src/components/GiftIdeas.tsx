"use client";

import { useState } from "react";
import type { Messages } from "@/i18n/messages";

const groups = [
  "food",
  "home",
  "creative",
  "experiences",
  "funny",
  "absurd",
  "practical",
  "handmade",
] as const;

export function GiftIdeas({ m }: { m: Messages }) {
  const [category, setCategory] = useState("all");
  const t = m.festive;
  const visible = t.items
    .map((item, index) => ({
      ...item,
      index,
      group: groups.find((group) => group === item.group)!,
    }))
    .filter((item) => category === "all" || item.group === category);
  return (
    <section className="gift-workshop" aria-labelledby="gift-heading">
      <div className="gift-intro">
        <span className="eyebrow">{t.eyebrow}</span>
        <h1 id="gift-heading">
          {t.title}
          <span className="title-dot">.</span>
        </h1>
        <p>{t.description}</p>
      </div>
      <div className="category-filters" role="group" aria-label={t.gifts}>
        {(["all", ...groups] as const).map((key) => (
          <button
            type="button"
            key={key}
            aria-pressed={category === key}
            onClick={() => setCategory(key)}
          >
            {t[key]}
          </button>
        ))}
      </div>
      <p className="gift-note">{t.note}</p>
      <div className="gift-grid" aria-live="polite" aria-atomic="true">
        {visible.map((item) => (
          <article className={`gift-card gift-${item.group}`} key={item.index}>
            <div className="gift-art" aria-hidden="true">
              <span>{item.symbol}</span>
              <i>✦</i>
              <i>✧</i>
            </div>
            <div className="gift-copy">
              <span className="eyebrow">{t[item.group]}</span>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </div>
          </article>
        ))}
      </div>
      <aside className="elf-tip">
        <span aria-hidden="true">✦</span>
        <div>
          <strong>{t.tipTitle}</strong>
          <p>{t.tip}</p>
        </div>
      </aside>
    </section>
  );
}
