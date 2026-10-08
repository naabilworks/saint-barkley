import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useCart } from "../../cart/CartContext";
import { formatPrice } from "../../data/products";
import { ProductImage } from "../shared/SizePicker";
export function Header() {
  const { count, openCart } = useCart();
  return (
    <header className="site-header">
      <Link to="/" className="site-header__logo">
        Maison
      </Link>
      <nav className="site-header__nav" aria-label="Main">
        <Link to="/shop">Shop</Link>
        <Link to="/shop?category=sneakers">Sneakers</Link>
        <Link to="/shop?category=boots">Boots</Link>
        <Link to="/shop?category=loafers">Loafers</Link>
      </nav>
      <button
        type="button"
        className="bag-btn"
        onClick={openCart}
        aria-label={`Open bag, ${count} ${count === 1 ? "item" : "items"}`}
      >
        <ShoppingBag size={20} strokeWidth={1.5} aria-hidden="true" />
        {count > 0 && <span className="bag-btn__count">{count}</span>}
      </button>
    </header>
  );
}

export default function CartDrawer() {
  const { isOpen, closeCart, items, subtotal, count, setQty, remove, maxQty } = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();

  useEffect(() => closeCart(), [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, closeCart]);

  return (
    <div className="drawer" data-open={isOpen} aria-hidden={!isOpen}>
      <div className="drawer__scrim" onClick={closeCart} />
      <aside className="drawer__panel" role="dialog" aria-modal="true" aria-label="Shopping bag">
        <header className="drawer__head">
          <h2>Your bag ({count})</h2>
          <button ref={closeRef} type="button" onClick={closeCart} aria-label="Close bag">
            <X size={20} strokeWidth={1.5} />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="drawer__empty">
            <p>Your bag is empty.</p>
            <Link to="/shop" className="btn btn--solid">
              Browse footwear
            </Link>
          </div>
        ) : (
          <>
            <ul className="drawer__list">
              {items.map((i) => (
                <li key={`${i.id}-${i.size}`} className="line">
                  <Link to={`/product/${i.product.slug}`} className="line__img">
                    <ProductImage src={i.product.image} alt="" />
                  </Link>
                  <div className="line__body">
                    <Link to={`/product/${i.product.slug}`} className="line__name">
                      {i.product.name}
                    </Link>
                    <p className="line__meta">
                      {i.product.color}, size {i.size}
                    </p>
                    <div className="qty">
                      <button
                        type="button"
                        aria-label={`Decrease quantity of ${i.product.name}`}
                        onClick={() => setQty(i.id, i.size, i.qty - 1)}
                      >
                        <Minus size={14} />
                      </button>
                      <span aria-live="polite">{i.qty}</span>
                      <button
                        type="button"
                        aria-label={`Increase quantity of ${i.product.name}`}
                        disabled={i.qty >= maxQty}
                        onClick={() => setQty(i.id, i.size, i.qty + 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="line__side">
                    <span>{formatPrice(i.product.price * i.qty)}</span>
                    <button type="button" className="line__remove" onClick={() => remove(i.id, i.size)}>
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <footer className="drawer__foot">
              <p className="drawer__sub">
                <span>Subtotal</span>
                <strong>{formatPrice(subtotal)}</strong>
              </p>
              <Link to="/checkout" className="btn btn--solid">
                Checkout
              </Link>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}