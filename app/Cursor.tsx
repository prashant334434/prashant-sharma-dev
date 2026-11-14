"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { heroImages } from "./data";

const IMG_W = 352, IMG_H = 264, PAD = 14, SMALL = 28;
const COLS = 3, ROWS = 2; // hero split into a 3x2 grid, one image per cell

const corners = [
  "left-0 top-0 border-l border-t",
  "right-0 top-0 border-r border-t",
  "left-0 bottom-0 border-l border-b",
  "right-0 bottom-0 border-r border-b",
];

export default function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const bx = useSpring(x, { stiffness: 260, damping: 28 });
  const by = useSpring(y, { stiffness: 260, damping: 28 });
  const [enabled, setEnabled] = useState(false);
  const [inHero, setInHero] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches) return; // touch devices keep native behaviour
    setEnabled(true);
    document.documentElement.classList.add("custom-cursor");
    const check = (cx: number, cy: number, t: Element | null) => {
      const hero = t?.closest("#top");
      if (hero && !t?.closest("a")) {
        const r = hero.getBoundingClientRect();
        const col = Math.min(COLS - 1, Math.floor(((cx - r.left) / r.width) * COLS));
        const row = Math.min(ROWS - 1, Math.floor(((cy - r.top) / r.height) * ROWS));
        setIdx((row * COLS + col) % heroImages.length);
        setInHero(true);
      } else setInHero(false);
    };
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      check(e.clientX, e.clientY, e.target as Element);
    };
    // page scrolls under a still cursor: re-check what's beneath it
    const scroll = () => check(x.get(), y.get(), document.elementFromPoint(x.get(), y.get()));
    const leave = () => { x.set(-100); y.set(-100); setInHero(false); };
    window.addEventListener("pointermove", move);
    window.addEventListener("scroll", scroll, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", scroll);
      document.removeEventListener("pointerleave", leave);
      document.documentElement.classList.remove("custom-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[60]">
      <motion.span style={{ x }} className="absolute left-0 top-0 h-full w-px bg-fg/10" />
      <motion.span style={{ y }} className="absolute left-0 top-0 h-px w-full bg-fg/10" />
      <motion.div style={{ x: bx, y: by }} className="absolute left-0 top-0">
        <motion.div
          animate={inHero ? { width: IMG_W + PAD * 2, height: IMG_H + PAD * 2 } : { width: SMALL, height: SMALL }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute -translate-x-1/2 -translate-y-1/2"
        >
          {corners.map((c) => <span key={c} className={`absolute h-3 w-3 border-fg ${c}`} />)}
          <div className="absolute overflow-hidden" style={{ inset: PAD }}>
            {heroImages.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src} src={src} alt=""
                className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
                style={{ opacity: inHero && i === idx ? 1 : 0 }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
