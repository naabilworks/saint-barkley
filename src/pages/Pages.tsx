import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { categories, formatPrice, getProduct, products } from "../data/products";
import { useCart } from "../cart/CartContext";
import SizePicker, { ProductImage } from "../components/shared/SizePicker";
export function Shop() {
  const [params, setParams] = useSearchParams();
  const cat = params.get("category") ?? "all";
  const sort = params.get("sort") ?? "featured";

  const update = (key: string, value: string, fallback: string) => {
    const next = new URLSearchParams(params);
    value === fallback ? next.delete(key) : next.set(key, value);
    setParams(next, { replace: true });
  };

  const list = products
    .filter((p) => cat === "all" || p.category.toLowerCase() === cat)
    .sort((a, b) =>
      sort === "low" ? a.price - b.price : sort === "high" ? b.price - a.price : 0
    );

  return (
    <main className="page">
      <h1 className="page__title">Footwear</h1>

      <div className="toolbar">
        <div className="chips" role="group" aria-label="Filter by category">
          {["all", ...categories.map((c) => c.toLowerCase())].map((c) => (
            <button
              key={c}
              type="button"
              className="chip"
              aria-pressed={cat === c}
              onClick={() => update("category", c, "all")}
            >
              {c === "all" ? "All" : c[0].toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
        <label className="sort">
          <span>Sort by</span>
          <select value={sort} onChange={(e) => update("sort", e.target.value, "featured")}>
            <option value="featured">Featured</option>
            <option value="low">Price, low to high</option>
            <option value="high">Price, high to low</option>
          </select>
        </label>
      </div>

      {list.length === 0 ? (
        <p className="empty">Nothing matches this filter. Try another category.</p>
      ) : (
        <ul className="grid">
          {list.map((p) => (
            <li key={p.id}>
              <Link to={`/product/${p.slug}`} className="card">
                <span className="card__media">
                  <ProductImage src={p.image} alt={`${p.name}, ${p.color}`} />
                  {p.tag && <span className="tag card__tag">{p.tag}</span>}
                </span>
                <span className="card__name">{p.name}</span>
                <span className="card__meta">
                  {p.category}, {p.color}
                </span>
                <span className="card__price">{formatPrice(p.price)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export function ProductDetail() {
  const { slug } = useParams();
  const product = getProduct(slug);
  const { add } = useCart();
  const [size, setSize] = useState<number | null>(null);

  if (!product) {
    return (
      <main className="page page--center">
        <h1 className="page__title">Product not found</h1>
        <p>This product may have been removed.</p>
        <Link to="/shop" className="btn btn--solid">
          Back to shop
        </Link>
      </main>
    );
  }

  const related = products.filter((p) => p.id !== product.id && p.category === product.category);
  const more = (related.length ? related : products.filter((p) => p.id !== product.id)).slice(0, 3);

  return (
    <main className="page">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/shop">Shop</Link>
        <Link to={`/shop?category=${product.category.toLowerCase()}`}>{product.category}</Link>
        <span aria-current="page">{product.name}</span>
      </nav>

      <div className="detail" key={product.id}>
        <div className="detail__media">
          <ProductImage src={product.image} alt={`${product.name}, ${product.color}`} />
          {product.tag && <span className="tag card__tag">{product.tag}</span>}
        </div>

        <div className="detail__info">
          <h1 className="detail__name">{product.name}</h1>
          <p className="detail__sub">
            {product.category}, {product.color}
          </p>
          <p className="detail__price">{formatPrice(product.price)}</p>
          <p className="detail__desc">{product.description}</p>

          <SizePicker product={product} value={size} onChange={setSize} />

          <button
            type="button"
            className="btn btn--solid btn--block"
            disabled={size === null}
            onClick={() => size !== null && add(product, size)}
          >
            {size === null ? "Choose a size" : "Add to bag"}
          </button>
          <p className="detail__note">Free returns within 14 days. Sizes run true to fit.</p>
        </div>
      </div>

      <section className="related" aria-labelledby="related-title">
        <h2 id="related-title">You may also like</h2>
        <ul className="grid">
          {more.map((p) => (
            <li key={p.id}>
              <Link to={`/product/${p.slug}`} className="card">
                <span className="card__media">
                  <ProductImage src={p.image} alt={`${p.name}, ${p.color}`} />
                </span>
                <span className="card__name">{p.name}</span>
                <span className="card__meta">{p.color}</span>
                <span className="card__price">{formatPrice(p.price)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export function Checkout() {
  const { items, subtotal, clear } = useCart();
  const [placed, setPlaced] = useState(false);

  if (placed)
    return (
      <main className="page page--center">
        <h1 className="page__title">Order received</h1>
        <p>Thank you. This is a demo checkout, so no payment was taken.</p>
        <Link to="/shop" className="btn btn--solid">
          Continue shopping
        </Link>
      </main>
    );

  if (items.length === 0)
    return (
      <main className="page page--center">
        <h1 className="page__title">Your bag is empty</h1>
        <Link to="/shop" className="btn btn--solid">
          Browse footwear
        </Link>
      </main>
    );

  return (
    <main className="page page--narrow">
      <h1 className="page__title">Order summary</h1>
      <ul className="summary">
        {items.map((i) => (
          <li key={`${i.id}-${i.size}`}>
            <span>
              {i.qty} x {i.product.name}
              <small>
                {i.product.color}, size {i.size}
              </small>
            </span>
            <span>{formatPrice(i.product.price * i.qty)}</span>
          </li>
        ))}
        <li className="summary__total">
          <span>Total</span>
          <strong>{formatPrice(subtotal)}</strong>
        </li>
      </ul>
      <button
        type="button"
        className="btn btn--solid btn--block"
        onClick={() => {
          clear();
          setPlaced(true);
        }}
      >
        Place order
      </button>
    </main>
  );
}