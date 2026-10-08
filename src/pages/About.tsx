import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { getProduct } from "../data/products";
import { ProductImage } from "../components/shared/SizePicker";
import "./About.css";

/* SAMPLE COPY: replace with your real brand story, materials and policies. */

const materials = [
  { term: "Leather", text: "Smooth leathers chosen for how they age. Expect fine creases and a deeper colour over time, not cracking." },
  { term: "Suede", text: "Soft-nap suede with a protective finish. A quick brush after wearing keeps the colour even." },
  { term: "Soles", text: "Leather soles on dress styles. Rubber or vulcanised soles where grip and flexibility matter more." },
  { term: "Fit", text: "Lasts with a roomier toe box than most dress shoes, so they feel right from the first day." },
];

const principles = [
  { title: "A small range", text: "Five styles for now. Each one is refined for as long as it takes before another is added." },
  { title: "Repair before replace", text: "A well-made shoe should be worth resoling. Our care guides show how to keep a pair going." },
  { title: "Plain pricing", text: "One price per style, all year. No inflated markdowns." },
];

const service = [
  { term: "Sizes", text: "EU 39 to 45. Not sure which to pick? Read the sizing guide." , to: "/journal/finding-your-size", cta: "Sizing guide" },
  { term: "Returns", text: "Free returns within 14 days, if the shoes are unworn and in their box." },
  { term: "Care", text: "Every pair needs a little care to last. We keep short guides in the journal.", to: "/journal", cta: "Read the journal" },
];

export default function About() {
  const hero = getProduct("moreno-penny");

  return (
    <main className="ab">
      <section className="ab-hero" aria-labelledby="ab-title">
        <h1 id="ab-title" className="ab-title">
          Fewer shoes, made to last longer.
        </h1>
        <div className="ab-hero__side">
          <p className="ab-lede">
            Saint Barkley designs a small range of sneakers, boots, and loafers.
            A style stays in the line until we can make it better, not because
            the season changed.
          </p>
          <Link to="/shop" className="ab-link">
            Shop footwear <ArrowUpRight size={16} strokeWidth={1.6} aria-hidden="true" />
          </Link>
        </div>
        {hero && (
          <div className="ab-hero__media">
            <ProductImage src={hero.image} alt={`${hero.name}, ${hero.color}`} />
          </div>
        )}
      </section>

      <section className="ab-block" aria-labelledby="ab-mat">
        <h2 id="ab-mat" className="ab-h2">What they are made of</h2>
        <dl className="ab-list">
          {materials.map((m) => (
            <div key={m.term} className="ab-row">
              <dt>{m.term}</dt>
              <dd>{m.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="ab-block" aria-labelledby="ab-prin">
        <h2 id="ab-prin" className="ab-h2">How we work</h2>
        <ul className="ab-cols">
          {principles.map((p) => (
            <li key={p.title}>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="ab-block" aria-labelledby="ab-svc">
        <h2 id="ab-svc" className="ab-h2">Before you order</h2>
        <dl className="ab-list">
          {service.map((s) => (
            <div key={s.term} className="ab-row">
              <dt>{s.term}</dt>
              <dd>
                {s.text}
                {s.to && (
                  <Link to={s.to} className="ab-inline">
                    {s.cta}
                  </Link>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="ab-cta" aria-label="Start shopping">
        <p className="ab-cta__text">Find the pair you will wear most.</p>
        <Link to="/shop" className="btn btn--solid">
          Shop all footwear
        </Link>
      </section>
    </main>
  );
}