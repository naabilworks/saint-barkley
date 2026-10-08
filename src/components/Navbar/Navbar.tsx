import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, ShoppingBag, Plus, Menu, X } from "lucide-react";
import logo from "../../assets/logo.png";
import { useCart } from "../../cart/CartContext";
import { products, formatPrice } from "../../data/products";
import "./Navbar.css";

const shopLinks = [
  { label: "All footwear", to: "/shop" },
  { label: "Sneakers", to: "/shop?category=sneakers" },
  { label: "Boots", to: "/shop?category=boots" },
  { label: "Loafers", to: "/shop?category=loafers" },
];

const pageLinks = [
  { label: "About", to: "/about" },
  { label: "Journal", to: "/journal" },
];

/** Text that rolls up to a duplicate on hover (the duplicate is hidden from screen readers). */
function Roll({ children }: { children: string }) {
  return (
    <span className="roll">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  );
}

export default function Navbar() {
  const { count, openCart } = useCart();
  const { pathname, search } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const inShop = pathname.startsWith("/shop") || pathname.startsWith("/product");

  // Close every overlay when the page changes.
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setQuery("");
  }, [pathname, search]);

  // Escape closes overlays.
  useEffect(() => {
    if (!mobileOpen && !searchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMobileOpen(false);
      setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen, searchOpen]);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter((p) =>
        [p.name, p.category, p.color].some((v) => v.toLowerCase().includes(q))
      )
      .slice(0, 5);
  }, [query]);

  const toggleSearch = () => {
    setMobileOpen(false);
    setSearchOpen((v) => !v);
  };

  const toggleMobile = () => {
    setSearchOpen(false);
    setMobileOpen((v) => !v);
  };

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <div className="navbar__left">
          <button
            type="button"
            className="icon-btn navbar__burger"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={toggleMobile}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <nav className="navbar__desktop" aria-label="Main">
            <div className="shop">
              <Link
                to="/shop"
                className="navbar__link"
                aria-current={inShop ? "page" : undefined}
              >
                <Roll>Shop</Roll>
                <Plus size={12} strokeWidth={1.8} aria-hidden="true" />
              </Link>
              <ul className="dropdown">
                {shopLinks.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className="dropdown__link">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {pageLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="navbar__link"
                aria-current={pathname.startsWith(item.to) ? "page" : undefined}
              >
                <Roll>{item.label}</Roll>
              </Link>
            ))}
          </nav>
        </div>

        <Link
          to="/"
          className="navbar__brand"
          aria-label="Saint Barkley home"
          onClick={() => pathname === "/" && window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <img src={logo} alt="" className="navbar__logo" />
          <span className="navbar__name">SAINT BARKLEY</span>
        </Link>

        <div className="navbar__right">
          <button
            type="button"
            className="icon-btn"
            aria-label="Search products"
            aria-expanded={searchOpen}
            aria-controls="nav-search"
            onClick={toggleSearch}
          >
            {searchOpen ? <X size={17} strokeWidth={1.6} /> : <Search size={17} strokeWidth={1.6} />}
          </button>
          <button
            type="button"
            className="icon-btn"
            aria-label={`Open bag, ${count} ${count === 1 ? "item" : "items"}`}
            onClick={openCart}
          >
            <ShoppingBag size={17} strokeWidth={1.6} />
            {count > 0 && <span className="badge">{count}</span>}
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <div id="nav-search" className="panel search" data-open={searchOpen}>
        <div className="panel__inner">
          <label className="search__field">
            <span className="sr-only">Search products</span>
            <Search size={18} strokeWidth={1.5} aria-hidden="true" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              placeholder="Search by name, category or color"
              onChange={(e) => setQuery(e.target.value)}
              tabIndex={searchOpen ? 0 : -1}
            />
          </label>

          <div className="search__results" aria-live="polite">
            {query.trim() === "" ? (
              <p className="search__browse">
                {shopLinks.slice(1).map((c) => (
                  <Link key={c.to} to={c.to} tabIndex={searchOpen ? 0 : -1}>
                    {c.label}
                  </Link>
                ))}
              </p>
            ) : results.length === 0 ? (
              <p className="search__empty">
                No results for "{query.trim()}". Try a category like boots or sneakers.
              </p>
            ) : (
              <ul>
                {results.map((p) => (
                  <li key={p.id}>
                    <Link to={`/product/${p.slug}`} className="result" tabIndex={searchOpen ? 0 : -1}>
                      <img src={p.image} alt="" />
                      <span className="result__name">{p.name}</span>
                      <span className="result__meta">{p.color}</span>
                      <span className="result__price">{formatPrice(p.price)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <nav
        id="mobile-menu"
        className="panel mobile-menu"
        data-open={mobileOpen}
        aria-label="Mobile"
      >
        <div className="panel__inner">
          <Link to="/shop" className="mobile-menu__link" tabIndex={mobileOpen ? 0 : -1}>
            Shop
          </Link>
          <ul className="mobile-menu__sub">
            {shopLinks.slice(1).map((item) => (
              <li key={item.to}>
                <Link to={item.to} tabIndex={mobileOpen ? 0 : -1}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          {pageLinks.map((item) => (
            <Link key={item.to} to={item.to} className="mobile-menu__link" tabIndex={mobileOpen ? 0 : -1}>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <div
        className="navbar__scrim"
        data-open={mobileOpen || searchOpen}
        onClick={() => {
          setMobileOpen(false);
          setSearchOpen(false);
        }}
      />
    </header>
  );
}