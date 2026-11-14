"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion, useMotionValue, useSpring } from "motion/react";
import Cursor from "./Cursor";
import {
  apps,
  career,
  contact,
  heroImages,
  skills,
  stats,
  toolkit,
} from "./data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function Magnetic({
  children,
  className,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  href: string;
}) {
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });
  return (
    <motion.a
      href={href}
      className={className}
      style={{ x, y }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.3);
        y.set((e.clientY - r.top - r.height / 2) * 0.3);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.a>
  );
}

// hover: text rolls up and an identical copy rolls in from below (wrap in a .group)
function Roll({ children }: { children: string }) {
  return (
    <span className="relative inline-block overflow-hidden align-bottom">
      <span className="block transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 translate-y-full transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0"
      >
        {children}
      </span>
    </span>
  );
}

const ringImages = [...new Set([...heroImages, ...apps.flatMap((a) => a.shots)])];
// text split for the career card reveals (screen readers get the parent's aria-label)
function Letters({ text }: { text: string }) {
  return text.split("").map((ch, i) => (
    <span key={i} aria-hidden className="cr-letter inline-block whitespace-pre">{ch}</span>
  ));
}
function Words({ text }: { text: string }) {
  return text.split(" ").map((w, i) => (
    <span key={i} aria-hidden className="mr-[0.27em] inline-block overflow-hidden align-bottom">
      <span className="cr-word inline-block">{w}</span>
    </span>
  ));
}

const navLinks = ["About", "Work", "Career", "Contact"];

// Career card placement measured from the reference: left offset (% of panel), gap from the previous card
// (negative = overlap, px) and which side the node sits on. Repeats if there are more cards.
const CAREER_LAYOUT = [
  { x: 57, mt: 0, side: "r" },
  { x: 18, mt: -37, side: "l" },
  { x: 9.3, mt: 124, side: "l" },
  { x: 57, mt: -7, side: "r" },
  { x: 32.5, mt: 81, side: "r" },
  { x: 9.3, mt: 96, side: "l" },
];

export default function Home() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // CAREER: build an S-curve path through the node squares; rebuilt on every refresh/resize
      const buildCareer = () => {
        const panel = document.querySelector<HTMLElement>(".career-panel");
        const path = document.querySelector<SVGPathElement>(".career-path");
        if (!panel || !path) return;
        // layout offsets (not getBoundingClientRect) so in-progress card fade-ins don't skew the curve
        // nodes are display:none below lg (straight-line layout), so they have no offsetParent
        const pts = gsap.utils.toArray<HTMLElement>(".career-node").filter((n) => n.offsetParent).map((n) => {
          const card = n.offsetParent as HTMLElement;
          return [
            card.offsetLeft + n.offsetLeft + n.offsetWidth / 2,
            card.offsetTop + n.offsetTop + n.offsetHeight / 2,
          ];
        });
        if (!pts.length) { path.setAttribute("d", ""); return; }
        // Catmull-Rom spline through the nodes: the line keeps its momentum through each node, so between
        // two same-side cards it swings out past the panel edge (clipped) and back, like the reference.
        const n = pts.length;
        const back = n > 1 ? pts[1] : [pts[0][0] - 1, pts[0][1] + 1];
        const P = [
          [pts[0][0] + (pts[0][0] - back[0]) * 0.35, pts[0][1] + (pts[0][1] - back[1]) * 0.35], // enters from beyond the edge
          ...pts,
        ];
        const at = (i: number) =>
          i < P.length ? P[i] : [2 * P[P.length - 1][0] - P[P.length - 2][0], 2 * P[P.length - 1][1] - P[P.length - 2][1]];
        const K = 0.3; // tension: bigger = wider swings
        let d = `M ${P[0][0]} ${P[0][1]}`;
        for (let i = 0; i < P.length - 1; i++) {
          const p0 = at(Math.max(0, i - 1)), p1 = P[i], p2 = P[i + 1], p3 = at(i + 2);
          d += ` C ${p1[0] + (p2[0] - p0[0]) * K} ${p1[1] + (p2[1] - p0[1]) * K} ${p2[0] - (p3[0] - p1[0]) * K} ${p2[1] - (p3[1] - p1[1]) * K} ${p2[0]} ${p2[1]}`;
        }
        path.setAttribute("d", d);
      };
      buildCareer();
      ScrollTrigger.addEventListener("refresh", buildCareer);

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // hero: letters rise in
        gsap.from(".hero-char", {
          yPercent: 110,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.035,
          delay: 0.2,
        });
        gsap.from(".hero-fade", {
          opacity: 0,
          y: 20,
          duration: 0.9,
          stagger: 0.1,
          delay: 0.9,
        });

        // infinite marquee
        gsap.to(".marquee-track", {
          xPercent: -50,
          duration: 60,
          ease: "none",
          repeat: -1,
        });

        // big headings scrub in
        gsap.utils.toArray<HTMLElement>(".reveal-heading").forEach((el) => {
          gsap.from(el, {
            opacity: 0.1,
            yPercent: 30,
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              end: "top 55%",
              scrub: true,
            },
          });
        });

        // stat counters
        gsap.utils.toArray<HTMLElement>(".stat-num").forEach((el) => {
          const end = Number(el.dataset.value);
          const obj = { v: 0 };
          gsap.to(obj, {
            v: end,
            duration: 1.6,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
            onUpdate: () => {
              el.textContent = Math.round(obj.v).toString();
            },
          });
        });

        // TOOLKIT: cards sit on the inside of a cylinder and turn as you scroll
        const tk = gsap.utils.toArray<HTMLElement>(".tk-card");
        if (tk.length && window.matchMedia("(min-width: 768px)").matches) {
          // proportions measured from the reference at rest (all in card widths):
          // neighbours sit 0.97w out turned 44°, the next ones 1.9w out turned 80°, perspective 3.2w
          const place = (center: number) => {
            const w = tk[0].offsetWidth;
            gsap.set(tk[0].parentElement, { perspective: w * 3.2 });
            tk.forEach((card, i) => {
              const s = i - center, d = Math.abs(s);
              const x = d <= 1 ? 0.967 * d : d <= 2 ? 0.967 + 0.933 * (d - 1) : 1.9 + 0.9 * (d - 2);
              const angle = d <= 1 ? 44 * d : d <= 2 ? 44 + 36 * (d - 1) : 80;
              gsap.set(card, { x: Math.sign(s) * x * w, rotationY: -Math.sign(s) * angle, zIndex: 100 - Math.round(d * 10), autoAlpha: d > 2.6 ? 0 : 1 });
            });
          };
          const ring = { c: 1 };
          place(ring.c);
          gsap.to(ring, {
            c: tk.length - 2,
            ease: "none",
            // step card-to-card: hold centred, then turn during the middle 40% of each segment
            onUpdate: () => {
              const base = Math.floor(ring.c),
                f = ring.c - base;
              place(
                base +
                  gsap.parseEase("power2.inOut")(
                    gsap.utils.clamp(0, 1, (f - 0.3) / 0.4),
                  ),
              );
            },
            scrollTrigger: {
              trigger: ".tk-track",
              start: "top top",
              end: "bottom bottom",
              scrub: 1,
            },
          });
        }

        // CAREER: line is revealed top-down with a soft fading tip that sits ~75% down the viewport
        const careerSvg = document.querySelector<SVGSVGElement>(".career-svg");
        const panelEl = document.querySelector<HTMLElement>(".career-panel");
        if (careerSvg && panelEl) {
          // like the reference's cover: its edge travels down the line as the panel scrolls from 50% to 90% of the viewport
          const reveal = (p: number) => {
            const y = p * panelEl.offsetHeight;
            const m = `linear-gradient(to bottom, #000 ${y - 40}px, transparent ${y}px)`;
            careerSvg.style.maskImage = m;
            careerSvg.style.webkitMaskImage = m;
          };
          reveal(0);
          ScrollTrigger.create({
            trigger: panelEl, start: "top 50%", end: "bottom 90%",
            onUpdate: (self) => reveal(self.progress), onRefresh: (self) => reveal(self.progress),
          });
        }
        // card box grows in, then date/title letters, description/location words and the company tag
        gsap.utils.toArray<HTMLElement>(".career-card").forEach((card) => {
          gsap.timeline({ scrollTrigger: { trigger: card, start: "top 70%", toggleActions: "play none none reverse" } })
            .from(card.querySelector(".cr-box"), { scale: 0.7, y: 144, opacity: 0, duration: 0.6, ease: "power3.out" })
            .from(card.querySelectorAll(".cr-letter"), { y: 16, opacity: 0, duration: 0.4, stagger: 0.025, ease: "power2.out" }, 0.15)
            .from(card.querySelectorAll(".cr-word"), { yPercent: 110, duration: 0.5, stagger: 0.012, ease: "power2.out" }, 0.3)
            .from(card.querySelector(".cr-tag"), { y: -50, opacity: 0, duration: 0.5, ease: "power2.out" }, 0.2);
        });

        // CTA: image rings spin forever (alternating) and grow as the section scrolls past
        gsap.utils.toArray<HTMLElement>(".ring-spin").forEach((el, i) => {
          gsap.to(el, {
            rotation: i % 2 ? -360 : 360,
            duration: 60,
            ease: "none",
            repeat: -1,
          });
        });
        [
          [0.2, 1.4],
          [0.75, 1.95],
          [1.45, 2.65],
        ].forEach(([from, to], i) => {
          gsap.fromTo(
            `.ring-scale-${i}`,
            { scale: from },
            {
              scale: to,
              ease: "none",
              scrollTrigger: {
                trigger: ".cta-section",
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });

        // JOURNEY: headings roll up into their line with a slight tilt
        gsap.utils.toArray<HTMLElement>(".roll-in").forEach((el) => {
          gsap.fromTo(
            el,
            { yPercent: 110, rotation: 6 },
            {
              yPercent: 0,
              rotation: 0,
              ease: "none",
              scrollTrigger: {
                trigger: el.parentElement,
                start: "top 90%",
                end: "top 40%",
                scrub: true,
              },
            },
          );
        });
        // JOURNEY: photo grows upward from the section bottom, with slow parallax inside
        gsap.fromTo(
          ".about-reveal",
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: {
              trigger: ".about-block",
              start: "top 80%",
              end: "top -25%",
              scrub: true,
            },
          },
        );
        gsap.fromTo(
          ".about-parallax",
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: ".about-block",
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );

        // WORK: pinned stage, cards drop in tilted and stack; older cards shrink, sink and darken
        const cards = gsap.utils.toArray<HTMLElement>(".work-card");
        const shades = gsap.utils.toArray<HTMLElement>(".work-shade");
        const N = cards.length,
          FALL = 0.875,
          TOTAL = N + 0.6;
        let active = -1;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".work-track",
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            onUpdate: (self) => {
              // active = card that's at least halfway into its drop
              const i = Math.max(
                0,
                Math.min(N - 1, Math.floor(self.progress * TOTAL - FALL / 2)),
              );
              if (i !== active) {
                active = i;
                gsap.to(".work-marker", {
                  y: i * 32,
                  duration: 0.3,
                  overwrite: true,
                });
              }
            },
          },
        });
        tl.to(".work-title", { opacity: 0.55, duration: 1, ease: "none" }, 0);
        cards.forEach((card, i) => {
          tl.fromTo(
            card,
            {
              yPercent: -230,
              scale: 2.4,
              rotationX: 55,
              transformOrigin: "50% 100%",
            },
            {
              yPercent: 0,
              scale: 1,
              rotationX: 0,
              duration: FALL,
              ease: "power2.inOut",
            },
            i,
          );
          const depth = N - i,
            rest = TOTAL - (i + FALL);
          tl.to(
            card,
            {
              scale: 1 - (0.24 / N) * depth, // pile depth stays constant however many cards (4 cards = 6% / 42px per step)
              y: (168 / N) * depth,
              duration: rest,
              ease: "none",
            },
            i + FALL,
          );
          tl.to(
            shades[i],
            {
              opacity: Math.min(0.8, (0.8 / N) * depth),
              duration: rest,
              ease: "none",
            },
            i + FALL,
          );
        });
        tl.fromTo(
          ".work-progress",
          { xPercent: 0 },
          { xPercent: 200, duration: TOTAL, ease: "none" },
          0,
        );
      });
      return () => ScrollTrigger.removeEventListener("refresh", buildCareer);
    },
    { scope: root },
  );

  const nameLines = ["Prashant", "Sharma."];

  return (
    <div ref={root}>
      <Cursor />
      {/* NAV */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="fixed inset-x-0 top-0 z-50 flex items-start justify-center px-4 py-4 sm:justify-between sm:px-7"
      >
        <div className="flex items-center gap-4 rounded bg-[#1c1c1c]/90 px-4 py-2.5 text-sm backdrop-blur sm:gap-6 sm:px-5">
          <a href="#top" className="font-display text-lg font-bold">
            PS<span className="text-accent">.</span>
          </a>
          <div className="flex gap-3.5 sm:gap-5">
            {navLinks.map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                className="text-fg/80 transition hover:text-fg"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
        <div className="hidden gap-1.5 sm:flex">
          <a
            href={`mailto:${contact.email}`}
            className="hidden rounded bg-[#1c1c1c]/90 px-5 py-2.5 text-sm backdrop-blur transition hover:bg-[#2a2a2a] sm:block"
          >
            Let&apos;s talk ?
          </a>
          <a
            href={`mailto:${contact.email}`}
            aria-label="Email me"
            className="grid w-11 place-items-center rounded bg-[#1c1c1c]/90 py-2.5 backdrop-blur transition hover:bg-accent hover:text-black"
          >
            ↗
          </a>
        </div>
      </motion.nav>

      {/* HERO (sticky: following sections slide over it) */}
      <div>
        <header
          id="top"
          className="sticky top-0 flex min-h-svh flex-col justify-between px-4 pb-7 pt-28 sm:px-7"
        >
          <p className="hero-fade mt-[22svh] text-center text-sm uppercase leading-relaxed tracking-wide text-fg/70 sm:text-left">
            Scroll down and
            <br />
            learn more
          </p>
          <div className="grid items-end gap-8 text-center sm:text-left lg:grid-cols-[1fr_auto_auto]">
            <div>
              <p className="hero-fade mb-4 flex items-center justify-center gap-3 text-sm text-muted sm:justify-start">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                Senior React Native Developer · {contact.location}
              </p>
              <h1 className="font-sans text-[16vw] font-light leading-[0.93] tracking-[-0.03em] sm:text-[7vw]">
                {nameLines.map((line) => (
                  <span key={line} className="block overflow-hidden">
                    {line.split("").map((c, i) => (
                      <span key={i} className="hero-char inline-block">
                        {c}
                      </span>
                    ))}
                  </span>
                ))}
              </h1>
            </div>
            <p className="hero-fade hidden self-end text-sm text-muted lg:block lg:mr-[14vw]">
              © {new Date().getFullYear()}
            </p>
            <a href="#work" className="hero-fade group hidden items-start gap-6 sm:flex">
              <span className="text-sm uppercase tracking-wide">
                See my work
              </span>
              <span className="relative block aspect-[10/7] w-48 overflow-hidden sm:w-72">
                <Image
                  src="/me.jpg"
                  alt="Prashant Sharma"
                  fill
                  priority
                  sizes="288px"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              </span>
            </a>
          </div>
        </header>

        {/* TECH CARDS MARQUEE + CONTACT STRIP */}
        <section className="relative z-10 bg-black pt-16">
          <div className="overflow-hidden">
            <div className="marquee-track flex w-max gap-6 pr-6">
              {[...skills, ...skills].map((s, i) => (
                <div
                  key={i}
                  className="grid h-[37vw] w-[56vw] shrink-0 place-items-center rounded-md border border-line bg-[#0a0a0a] px-6 text-center font-display text-xl font-bold text-fg/70 transition-colors hover:text-fg sm:h-44 sm:w-[22rem] sm:text-2xl"
                >
                  {s}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between gap-8 px-0 py-20 sm:py-28">
            <div className="hidden h-8 flex-1 gap-4 overflow-hidden sm:flex">
              {Array.from({ length: 24 }, (_, i) => (
                <span key={i} className="h-full w-px shrink-0 bg-fg/40" />
              ))}
            </div>
            <div className="mx-auto shrink-0 px-4 text-center text-base text-fg/80 sm:text-xl">
              <a href={`mailto:${contact.email}`} className="hover:text-accent">
                {contact.email}
              </a>
              <p className="mt-4">{contact.location}</p>
            </div>
            <div className="hidden h-8 flex-1 gap-4 overflow-hidden sm:flex justify-end">
              {Array.from({ length: 24 }, (_, i) => (
                <span key={i} className="h-full w-px shrink-0 bg-fg/40" />
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT — MY JOURNEY / BEST WORK; photo reveals upward behind the headings */}
        <section id="about" className="relative z-10 bg-black">
          <div className="about-block relative">
            <div className="about-reveal absolute inset-0 overflow-hidden">
              <div className="about-parallax absolute inset-x-0 -inset-y-[10%]">
                <Image
                  src="/me.jpg"
                  alt=""
                  fill
                  sizes="100vw"
                  className="hue-drift scale-125 object-cover blur-2xl brightness-[0.35] saturate-150"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-black" />
            </div>
            <div className="relative px-4 pt-24 text-[13vw] font-bold uppercase leading-[0.9] tracking-tight text-white sm:px-8 sm:text-[7vw]">
              <h2 className="overflow-hidden pb-[0.06em] text-center sm:pl-[6vw] sm:text-left">
                <span className="roll-in inline-block origin-bottom-left">
                  My journey
                </span>
              </h2>
              <h2 className="overflow-hidden pb-[0.06em] text-center sm:pr-[3vw] sm:text-right">
                <span className="roll-in inline-block origin-bottom-left">
                  Best work
                </span>
              </h2>
            </div>
            <div className="relative grid items-center gap-16 px-5 pb-32 pt-24 sm:px-8 sm:pb-40 sm:pt-28 lg:grid-cols-2">
              <div className="flex h-12 justify-center gap-1.5 sm:h-[4.5rem] lg:ml-[6vw] lg:justify-start">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="w-10 rounded-sm bg-white" />
                ))}
                {Array.from({ length: 8 }, (_, i) => (
                  <span key={i} className="w-1 bg-white" />
                ))}
              </div>
              <div className="space-y-16 sm:space-y-24 lg:pl-6">
                {[
                  [
                    "Intro",
                    "4 years across the full React Native stack: architecture, Redux, navigation, performance, offline-first SQLite, native modules and CI/CD. I own App Store and Play releases end to end.",
                  ],
                  [
                    "Work",
                    "Fast, reliable mobile apps, with OpenAI-powered features shipped into production fintech apps.",
                  ],
                ].map(([k, v]) => (
                  <div key={k} className="grid gap-3 text-center sm:grid-cols-[10rem_1fr] sm:gap-4 sm:text-left">
                    <h3 className="text-lg">{k}</h3>
                    <p className="mx-auto max-w-xl text-base leading-relaxed text-fg/85 sm:mx-0 sm:text-lg">
                      {v}
                    </p>
                  </div>
                ))}
                <div className="grid gap-6 sm:grid-cols-[10rem_1fr] sm:gap-4">
                  <h3 className="text-center text-lg sm:text-left">Results</h3>
                  <div className="space-y-8">
                    {stats.map((st) => (
                      <div
                        key={st.label}
                        className="flex items-end justify-between gap-6 border-b border-white/10 pb-4 sm:items-start sm:border-0 sm:pb-0"
                      >
                        <p className="text-base text-fg/85 sm:text-lg">{st.label}</p>
                        <p className="text-5xl font-bold tracking-tight sm:text-8xl">
                          <span className="stat-num" data-value={st.value}>
                            {st.value}
                          </span>
                          {st.suffix}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* WORK — pinned "Recent Work" stage; cards drop in and stack as you scroll */}
      <section id="work" className="work-track relative bg-black" style={{ height: `${(apps.length + 1.3) * 150}svh` }}>
        <div className="sticky top-0 h-svh overflow-hidden [perspective:1400px]">
          <h2 className="work-title absolute inset-0 grid place-items-center text-[17vw] font-normal tracking-tight sm:text-[8vw]">
            Recent Work
          </h2>
          {apps.map((a, i) => (
            <div
              key={a.name}
              className="pointer-events-none absolute inset-0 grid place-items-center"
              style={{ zIndex: i + 1 }}
            >
              <a
                href={a.url ?? a.ios ?? a.android} target="_blank" rel="noopener noreferrer" aria-label={`${a.name}: ${a.desc}`}
                className="work-card group pointer-events-auto relative block aspect-[4/5] h-[44svh] max-w-[84vw] overflow-hidden rounded-[20px] bg-[#111] ring-1 ring-white/10 sm:h-[62svh] sm:max-w-[80vw]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.image} alt="" className="absolute inset-0 h-full w-full scale-125 object-cover blur-2xl brightness-[0.45]" />
                {a.kind === "web" ? (
                  <div className="absolute inset-0 flex flex-col justify-center gap-4 p-5">
                    {a.shots.map((src) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={src} src={src} alt="" className="w-full rounded-xl shadow-2xl ring-1 ring-white/15" />
                    ))}
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.image} alt="" className="absolute inset-0 m-auto h-[94%] w-auto max-w-[94%] rounded-xl object-contain drop-shadow-2xl" />
                )}
                <div className="work-shade absolute inset-0 bg-black opacity-0" />
                <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between overflow-hidden px-5 text-sm font-medium text-white [text-shadow:0_1px_8px_rgba(0,0,0,.6)]">
                  <span className="-translate-x-[200%] transition-transform duration-500 group-hover:translate-x-0">
                    0{i + 1}
                  </span>
                  <span className="translate-x-[200%] transition-transform duration-500 group-hover:translate-x-0">
                    {a.name}
                  </span>
                </div>
              </a>
            </div>
          ))}
          <ul className="absolute bottom-5 left-4 z-10 text-xs sm:bottom-8 sm:left-7 sm:text-sm">
            <span className="work-marker absolute left-0 top-[9px] h-1.5 w-1.5 bg-white sm:top-[13px]" />
            {apps.map((a) => (
              <li key={a.name} className="h-6 pl-4 leading-6 sm:h-8 sm:leading-8">
                {a.name}
              </li>
            ))}
          </ul>
          <div className="absolute bottom-7 right-4 z-10 h-1.5 w-20 overflow-hidden bg-[#292929] sm:bottom-11 sm:right-7 sm:w-32">
            <div className="work-progress h-full w-1/3 bg-white" />
          </div>
        </div>
      </section>

      {/* TOOLKIT — pinned 3D card ring */}
      <section className="tk-track relative bg-black pb-24 pt-16 md:h-[400svh] md:pb-0 md:pt-0">
        <div className="md:sticky md:top-0 md:h-svh md:overflow-hidden">
          <h2 className="sticky top-[17vw] z-0 text-center text-[14vw] font-normal leading-none tracking-tight md:static md:pt-[11svh] md:text-[8vw]">
            My Toolkit
          </h2>
          {/* container is exactly one card's size, so the vanishing point sits at the card centre (like the reference) */}
          <div className="relative mx-auto mt-[14vw] flex w-[71vw] flex-col gap-[12vw] sm:w-[50vw] md:mt-[11svh] md:block md:aspect-[549/545] md:w-[34vw] lg:w-[28vw]">
            {toolkit.map((t) => (
              <div
                key={t.name}
                className="tk-card group sticky top-[40vw] aspect-[549/545] w-full overflow-hidden rounded-[7px] bg-[#0a0a0a] shadow-[0_-20px_40px_rgba(0,0,0,.5)] md:absolute md:inset-0 md:aspect-auto md:shadow-none"
              >
                <div
                  className="absolute inset-0"
                  style={{ background: `radial-gradient(120% 90% at 50% 35%, ${t.color} 0%, ${t.color}55 45%, #0a0a0a 100%)` }}
                />
                <div className="absolute inset-0 flex items-center justify-center gap-[8%] pb-[12%]">
                  {t.logos.map((l) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={l} src={`/tech/${l}.svg`} alt={l} className={`${t.logos.length > 1 ? "w-[30%]" : "w-[42%]"} drop-shadow-[0_8px_30px_rgba(0,0,0,.35)]`} />
                  ))}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
                <p className="absolute bottom-4 left-4 text-xl font-semibold sm:bottom-5 sm:left-5 sm:text-2xl">
                  {t.name}
                </p>
                <div className="absolute inset-0 flex flex-col justify-between bg-[#2b2b2b] p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100 sm:p-6">
                  <div className="flex items-center gap-4">
                    <span className="grid h-[71px] w-[55px] shrink-0 place-items-center" style={{ background: t.color }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`/tech/${t.logos[0]}.svg`} alt="" className="w-7" />
                    </span>
                    <div>
                      <p className="text-lg">{t.name}</p>
                      <p className="text-sm text-fg/60">{t.kind}</p>
                    </div>
                  </div>
                  <p className="text-base leading-snug text-fg/85 sm:text-xl">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAREER — zig-zag timeline with a scroll-drawn curve */}
      <section id="career" className="bg-black px-4 py-24 sm:px-[10vw] sm:py-28">
        <div className="mb-16 flex justify-between text-sm sm:mb-24">
          <span>+</span>
          <span>+</span>
        </div>
        <div className="mb-14 grid items-center gap-8 sm:mb-20 sm:gap-10 lg:grid-cols-[1fr_1.15fr]">
          <div className="flex h-12 gap-1.5">
            {[0, 1].map((i) => (
              <span key={i} className="w-12 rounded-sm bg-white" />
            ))}
            <span className="w-6 rounded-sm bg-white" />
            <span className="w-2 rounded-sm bg-white" />
          </div>
          <h2 className="text-[8.5vw] font-semibold uppercase leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Growing through
            <br />
            shipped products
          </h2>
        </div>
        <div className="career-panel relative overflow-hidden bg-[#141414] py-12 pl-12 pr-4 sm:pl-16 sm:pr-8 lg:px-0 lg:pb-28 lg:pt-20">
          {/* below lg: a straight line down the left (the reference's mobile layout) */}
          <span aria-hidden className="absolute bottom-0 left-6 top-0 w-[2px] bg-white sm:left-8 lg:hidden" />
          <svg className="career-svg pointer-events-none absolute inset-0 hidden h-full w-full lg:block" aria-hidden>
            <path className="career-path" fill="none" stroke="white" strokeWidth="2.5" />
          </svg>
          {career.map((c, i) => (
            <div
              key={c.org}
              style={{ "--ml": `${CAREER_LAYOUT[i % CAREER_LAYOUT.length].x}%`, "--mt": `${i ? CAREER_LAYOUT[i % CAREER_LAYOUT.length].mt : 0}px` } as React.CSSProperties}
              className={`career-card relative z-10 w-full max-w-md lg:ml-[var(--ml)] lg:mt-[var(--mt)] lg:w-[35%] lg:min-w-[300px] lg:max-w-none ${i ? "mt-8 sm:mt-10" : ""}`}
            >
              <span
                className={`career-node absolute -bottom-[38px] hidden h-5 w-5 rounded-[5px] bg-[#c2c2c2] lg:block ${CAREER_LAYOUT[i % CAREER_LAYOUT.length].side === "r" ? "-right-[36px]" : "-left-[36px]"}`}
              />
              <span aria-hidden className="absolute -left-[30px] bottom-3 h-3 w-3 rounded-[3px] bg-[#c2c2c2] sm:-left-[38px] lg:hidden" />
              <div className="cr-box flex min-h-[300px] flex-col rounded-md bg-[#2a2a2a] p-4 sm:min-h-[348px] sm:p-[22px]">
                <span className="cr-tag self-end bg-black px-2.5 py-1 text-xs">{c.org}</span>
                <p className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl" aria-label={c.date}><Letters text={c.date} /></p>
                <h3 className="mt-6 text-lg sm:mt-8 sm:text-xl" aria-label={c.title}><Letters text={c.title} /></h3>
                <p className="mt-3 text-sm leading-relaxed text-fg/60" aria-label={c.desc}><Words text={c.desc} /></p>
                <p className="mt-auto pt-8 text-sm text-fg/80" aria-label={c.meta}><Words text={c.meta} /></p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA — spinning image rings around a round button */}
      <section
        id="contact"
        className="cta-section relative overflow-hidden bg-black"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {[0, 1, 2].map((r) => (
            <div
              key={r}
              className={`ring-scale-${r} absolute left-1/2 top-1/2 -ml-[227px] -mt-[227px] h-[455px] w-[455px]`}
            >
              <div
                className={`ring-spin relative h-full w-full ${r !== 1 ? "blur-[1.5px]" : ""}`}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={ringImages[(r * 12 + i) % ringImages.length]}
                    alt=""
                    className="absolute left-1/2 top-1/2 -ml-[37px] -mt-[42px] h-[84px] w-[74px] rounded object-cover brightness-75"
                    style={{
                      transform: `rotate(${i * 30 + r * 15}deg) translateY(-227px)`,
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#000_8%,rgba(0,0,0,.55)_28%,rgba(0,0,0,.4)_45%,#000_80%)]" />
        </div>
        <div className="relative flex min-h-[100svh] flex-col items-center justify-between gap-10 px-4 py-16 text-center sm:min-h-[115svh] sm:px-[10vw]">
          <div>
            <h2 className="text-[15vw] font-bold uppercase leading-none tracking-tight sm:text-[8vw]">
              Let&apos;s build
            </h2>
            <p className="mx-auto mt-6 max-w-[16rem] text-sm text-fg/85">
              Turning ideas into fast, reliable mobile apps.
            </p>
          </div>
          <div className="flex w-full items-center justify-between gap-3 text-[10px] uppercase sm:gap-4 sm:text-xs">
            <span>4Y Experience</span>
            <Magnetic
              href={`mailto:${contact.email}`}
              className="grid h-28 w-28 shrink-0 place-items-center rounded-full bg-white text-xs uppercase text-black sm:h-36 sm:w-36 sm:text-sm"
            >
              Get started
            </Magnetic>
            <span>Since - 2022</span>
          </div>
          <div>
            <p className="font-display text-5xl font-bold">
              PS<span className="text-accent">.</span>
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
              {[
                ["LinkedIn", contact.linkedin],
                ["GitHub", contact.github],
                ["Email", `mailto:${contact.email}`],
              ].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="group"
                >
                  <Roll>{`[ ${label} ]`}</Roll>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER — big nav, info columns, name revealed behind the page at the very end */}
      <footer className="relative bg-black">
        <div className="relative overflow-hidden px-4 pb-16 pt-24 sm:px-7">
          <p
            aria-hidden
            className="pointer-events-none absolute -bottom-[0.2em] right-0 select-none text-[34vw] font-bold leading-none text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,.18)]"
          >
            PS
          </p>
          <div className="relative grid gap-14 sm:grid-cols-2 lg:grid-cols-[45%_1fr_auto] lg:gap-24">
            <nav className="sm:col-span-2 lg:col-span-1">
              <p className="mb-6 text-sm text-fg/70">Navigation</p>
              {navLinks.map((l) => (
                <a
                  key={l}
                  href={`#${l.toLowerCase()}`}
                  className="group block border-b border-line py-3 text-4xl font-semibold uppercase sm:text-6xl"
                >
                  <Roll>{l}</Roll>
                </a>
              ))}
            </nav>
            <div className="text-sm leading-relaxed">
              <p className="mb-6 text-fg/70">Location</p>
              <p>{contact.location}</p>
              <a
                href={`mailto:${contact.email}`}
                className="mt-4 block hover:text-accent"
              >
                {contact.email}
              </a>
              <a
                href={`tel:${contact.phone.replace(/-/g, "")}`}
                className="block hover:text-accent"
              >
                {contact.phone}
              </a>
            </div>
            <div className="text-sm leading-relaxed">
              <p className="mb-6 text-fg/70">Elsewhere</p>
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-accent"
              >
                LinkedIn
              </a>
              <a
                href={contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-accent"
              >
                GitHub
              </a>
            </div>
          </div>
          <p className="relative mt-16 text-xs text-fg/70 sm:mt-20 sm:text-right">
            © {new Date().getFullYear()} Developed & Designed by Prashant Sharma
            ·
          </p>
        </div>
        {/* clip-path clips the fixed child to this box, so the name only shows once you reach the end */}
        <div className="relative h-[17vw] [clip-path:inset(0)]">
          <p
            aria-hidden
            className="fixed inset-x-0 bottom-0 select-none text-center text-[19vw] font-bold uppercase leading-[0.78] tracking-tight text-fg/15"
          >
            Prashant
          </p>
        </div>
      </footer>
    </div>
  );
}
