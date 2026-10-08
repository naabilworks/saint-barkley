import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MotionConfig, motion } from "motion/react";
import type { Variants } from "motion/react";
import { ArrowUpRight, Plus } from "lucide-react";
import { products, formatPrice } from "../../data/products";
import { useCart } from "../../cart/CartContext";
import SizePicker, { ProductImage } from "../shared/SizePicker";
import "./Featured.css";

const ease = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

export default function Featured() {
  const { add } = useCart();
  const [active, setActive] = useState(0);
  const [sizes, setSizes] = useState<Record<string, number | null>>({});
  const current = products[active];
  const size = sizes[current.id] ?? null;

  // Preload so switching previews never flashes an empty frame.
  useEffect(() => {
    products.forEach((p) => {
      const img = new Image();
      img.src = p.image;
    });
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <section className="featured" id="featured" aria-labelledby="featured-title">
        <div className="featured__inner">
          <motion.header
            className="featured__headline"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={container}
          >
            <motion.h2 id="featured-title" className="headline__title" variants={rise}>
              Elevated essentials
            </motion.h2>
            <motion.div className="headline__side" variants={rise}>
              <p className="headline__desc">
                Classic silhouettes, rebuilt with better materials. Five pieces
                to anchor an everyday wardrobe.
              </p>
              <Link to="/shop" className="link-arrow">
                Shop all footwear <ArrowUpRight size={16} strokeWidth={1.6} aria-hidden="true" />
              </Link>
            </motion.div>
          </motion.header>

          <div className="featured__body">
            <ul className="list">
              {products.map((p, i) => (
                <li
                  key={p.id}
                  className="row"
                  data-active={i === active}
                  onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                >
                  <span className="row__thumb" aria-hidden="true">
                    <ProductImage src={p.image} alt="" className="row__thumb-img" />
                  </span>

                  <div className="row__main">
                    <h3 className="row__name">
                      <Link
                        to={`/product/${p.slug}`}
                        className="row__link"
                        onFocus={() => setActive(i)}
                      >
                        {p.name}
                      </Link>
                    </h3>
                    <p className="row__meta">
                      <Link to={`/shop?category=${p.category.toLowerCase()}`} className="row__cat">
                        {p.category}
                      </Link>
                      <span>{p.color}</span>
                      {p.tag && <span className="tag tag--inline">{p.tag}</span>}
                    </p>
                  </div>

                  <span className="row__price">{formatPrice(p.price)}</span>

                  <Link
                    to={`/product/${p.slug}`}
                    className="row__quick"
                    aria-label={`Choose a size for ${p.name}`}
                    tabIndex={-1}
                  >
                    <Plus size={18} strokeWidth={1.6} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>

            <aside className="stage" aria-label="Product preview">
              <Link
                to={`/product/${current.slug}`}
                className="stage__media"
                aria-label={`View ${current.name}`}
              >
                {products.map((p, i) => (
                  <div
                    key={p.id}
                    className={`stage__slide${i === active ? " is-active" : ""}`}
                    aria-hidden={i !== active}
                  >
                    <ProductImage
                      src={p.image}
                      alt={`${p.name}, ${p.color}`}
                      className="stage__img"
                    />
                  </div>
                ))}
                {current.tag && <span className="tag stage__tag">{current.tag}</span>}
              </Link>

              <div className="stage__info" aria-live="polite">
                <div>
                  <p className="stage__name">{current.name}</p>
                  <p className="stage__sub">
                    {current.category}, {current.color}
                  </p>
                </div>
                <p className="stage__price">{formatPrice(current.price)}</p>
              </div>

              <SizePicker
                compact
                product={current}
                value={size}
                onChange={(s) => setSizes((prev) => ({ ...prev, [current.id]: s }))}
              />

              <button
                type="button"
                className="stage__add"
                disabled={size === null}
                onClick={() => size !== null && add(current, size)}
              >
                {size === null ? "Choose a size" : "Add to bag"}
                <Plus size={16} strokeWidth={1.8} aria-hidden="true" />
              </button>
            </aside>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}