import { useEffect, useRef, useState } from "react";
import { MotionConfig, motion } from "motion/react";
import type { Transition, Variants } from "motion/react";

import hero1 from "../../assets/hero.png";
import hero2 from "../../assets/hero2.png";
import hero3 from "../../assets/hero3.png";
// Import logo (asumsi path sama dengan di Navbar)
import logo from "../../assets/logo.png"; 
import "./Hero.css";

const slides = [
  { src: hero1, position: "center center" },
  { src: hero2, position: "center center" },
  { src: hero3, position: "center center" },
];

const DURATION = 2.8; 
const AUTOPLAY = 7; 

const move: Transition = { duration: DURATION, ease: "easeInOut" };
const instant: Transition = { duration: 0 };

const imgVariants: Variants = {
  enter: { opacity: 0, transition: instant },
  center: { opacity: 1, transition: move },
  exit: { opacity: 1, transition: move },
};

export default function Hero() {
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const [ready, setReady] = useState(false);
  const [pos, setPos] = useState({ current: 0, prev: -1 });

  useEffect(() => {
    let alive = true;
    Promise.all(
      imgRefs.current.map((img) => img?.decode().catch(() => undefined))
    ).then(() => {
      if (alive) setReady(true);
    });
    
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;

    let timer: number;
    const next = () =>
      setPos((p) => ({
        prev: p.current,
        current: (p.current + 1) % slides.length,
      }));
    const start = () => {
      timer = window.setTimeout(next, AUTOPLAY * 1000);
    };
    const onVisibility = () => {
      window.clearTimeout(timer);
      if (!document.hidden) start();
    };

    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [ready, pos.current]);

  return (
    <MotionConfig reducedMotion="user">
      <section className="hero" aria-label="Hero">
        {/* LAYER 1: Background Images (Bergerak / Crossfade) */}
        {slides.map((slide, i) => {
          const state = i === pos.current ? "center" : i === pos.prev ? "exit" : "enter";
          const zIndex = state === "center" ? 2 : state === "exit" ? 1 : 0;

          return (
            <motion.div
              key={i}
              className="hero__slide"
              style={{ zIndex }}
              initial={false}
              animate={state}
            >
              <motion.img
                src={slide.src}
                alt={`Saint Barkley Showcase ${i + 1}`}
                className="hero__img"
                style={{ objectPosition: slide.position }}
                draggable={false}
                variants={imgVariants}
                initial={false}
                ref={(el) => { imgRefs.current[i] = el; }}
              />
            </motion.div>
          );
        })}

        {/* LAYER 2: Static Center Brand (Diam Sempurna di Tengah) */}
        <div className="hero__static-overlay">
          <div className="hero__brand-center">
            <img src={logo} alt="Saint Barkley Logo" className="hero__logo-center" draggable={false} />
            <h1 className="hero__name-center">SAINT BARKLEY</h1>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}