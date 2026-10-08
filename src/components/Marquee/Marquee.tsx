import { Fragment, useEffect, useRef } from "react";
import type { Ref } from "react";
import logo from "../../assets/logo.png";
import "./Marquee.css";

/* Edit teks di sini. Jumlah item bebas. */
const items = [
  "New Arrivals",
  "Sneakers, Boots & Loafers",
  "Crafted to Last",
  "Made for Every Step",
  "Saint Barkley Footwear",
];

/* Kecepatan gerak dalam px per detik. Naikkan untuk lebih cepat. */
const SPEED = 80;

/* false = marquee SELALU bergerak, walau Windows/browser kamu mengaktifkan
   "kurangi animasi" (reduced motion). true = marquee diam untuk pengguna
   yang mengaktifkan pengaturan itu. */
const RESPECT_REDUCED_MOTION = false;

/* Satu grup berisi minimal ~20 item supaya selalu lebih lebar dari layar.
   Jumlah salinan dibuat genap, jadi pola caps/italic tetap bergantian
   di titik sambungan loop. */
const COPIES = Math.ceil(20 / items.length / 2) * 2;
const list = Array.from({ length: COPIES }, () => items).flat();

function Group({ hidden, groupRef }: { hidden: boolean; groupRef?: Ref<HTMLUListElement> }) {
  return (
    <ul className="marquee__group" aria-hidden={hidden || undefined} ref={groupRef}>
      {list.map((text, i) => (
        <Fragment key={i}>
          <li className="marquee__item" data-style={i % 2 === 0 ? "caps" : "italic"}>
            {text}
          </li>
          <li className="marquee__sep" aria-hidden="true">
            <img src={logo} alt="" draggable={false} />
          </li>
        </Fragment>
      ))}
    </ul>
  );
}

export default function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLUListElement>(null);

  /* Gerakan memakai Web Animations API (bukan CSS @keyframes), jadi tidak
     ikut mati oleh aturan CSS prefers-reduced-motion.
     Dua grup identik digeser tepat -50%, jadi sambungan loop selalu mulus.
     Durasi dihitung dari lebar grup supaya kecepatan konstan, dan
     diperbarui otomatis kalau lebar berubah (font/logo selesai dimuat, resize)
     tanpa membuat gerakan loncat. */
  useEffect(() => {
    const track = trackRef.current;
    const group = groupRef.current;
    if (!track || !group) return;

    if (RESPECT_REDUCED_MOTION && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const toMs = (width: number) => (width / SPEED) * 1000;

    const anim = track.animate(
      [{ transform: "translate3d(0, 0, 0)" }, { transform: "translate3d(-50%, 0, 0)" }],
      { duration: toMs(group.getBoundingClientRect().width) || 60000, iterations: Infinity, easing: "linear" }
    );

    const update = () => {
      const width = group.getBoundingClientRect().width;
      if (width) anim.effect?.updateTiming({ duration: toMs(width) });
    };

    const ro = new ResizeObserver(update);
    ro.observe(group);

    return () => {
      ro.disconnect();
      anim.cancel();
    };
  }, []);

  return (
    <section className="marquee" aria-label="Saint Barkley highlights">
      <div className="marquee__viewport">
        <div className="marquee__track" ref={trackRef}>
          <Group hidden={false} groupRef={groupRef} />
          <Group hidden />
        </div>
      </div>
    </section>
  );
}