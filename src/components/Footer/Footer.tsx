import { Link } from "react-router-dom";
import "./Footer.css";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "All footwear", to: "/shop" },
      { label: "Sneakers", to: "/shop?category=sneakers" },
      { label: "Boots", to: "/shop?category=boots" },
      { label: "Loafers", to: "/shop?category=loafers" },
    ],
  },
  {
    title: "Brand",
    links: [
      { label: "About", to: "/about" },
      { label: "Journal", to: "/journal" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Sizing guide", to: "/journal/finding-your-size" },
      { label: "Suede care", to: "/journal/caring-for-suede-boots" },
      { label: "Returns", to: "/about" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="ft">
      <div className="ft__inner">
        <div className="ft__brand">
          <Link to="/" className="ft__name">
            SAINT BARKLEY
          </Link>
          <p>Sneakers, boots, and loafers made to be worn for years.</p>
        </div>

        <nav className="ft__cols" aria-label="Footer">
          {columns.map((c) => (
            <div key={c.title}>
              <h2>{c.title}</h2>
              <ul>
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <p className="ft__legal">&copy; {new Date().getFullYear()} Saint Barkley. All rights reserved.</p>
    </footer>
  );
}