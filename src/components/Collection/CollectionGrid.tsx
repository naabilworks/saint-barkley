import { Link } from "react-router-dom";
import { MotionConfig, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { categories, formatPrice, products } from "../../data/products";
import { ProductImage } from "../shared/SizePicker";
import "./CollectionGrid.css";

const ease = [0.22, 1, 0.36, 1] as const;

// One tile per category, built from the same data as the shop,
// so counts, prices and images can never drift out of sync.
const tiles = categories.map((category) => {
  const items = products.filter((p) => p.category === category);
  return {
    category,
    to: `/shop?category=${category.toLowerCase()}`,
    image: items[0].image,
    alt: `${items[0].name}, ${items[0].color}`,
    count: items.length,
    from: Math.min(...items.map((p) => p.price)),
  };
});

export default function CollectionGrid() {
  return (
    <MotionConfig reducedMotion="user">
      <section className="cg" id="collection" aria-labelledby="cg-title">
        <div className="cg__inner">
          <header className="cg__head">
            <h2 className="cg__title" id="cg-title">
              Shop by category
            </h2>
            <p className="cg__desc">
              Three shapes, one standard of leather and construction. Start with
              the one you wear most.
            </p>
          </header>

          <motion.ul
            className="cg__grid"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.8, ease }}
          >
            {tiles.map((t) => (
              <li key={t.category}>
                <Link to={t.to} className="tile">
                  <span className="tile__media">
                    <ProductImage src={t.image} alt={t.alt} className="tile__img" />
                  </span>
                  <span className="tile__body">
                    <span className="tile__text">
                      <span className="tile__name">{t.category}</span>
                      <span className="tile__meta">
                        {t.count} {t.count === 1 ? "style" : "styles"}, from{" "}
                        {formatPrice(t.from)}
                      </span>
                    </span>
                    <ArrowUpRight
                      className="tile__arrow"
                      size={22}
                      strokeWidth={1.4}
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </motion.ul>
        </div>
      </section>
    </MotionConfig>
  );
}