import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { CartProvider } from "./cart/CartContext";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Marquee from "./components/Marquee/Marquee";
import Featured from "./components/Featured/Featured";
import CollectionGrid from "./components/Collection/CollectionGrid";
import CartDrawer from "./components/Cart/CartDrawer";
import Footer from "./components/Footer/Footer";
import About from "./pages/About";
import { Journal, JournalPost } from "./pages/Journal";
import { Checkout, ProductDetail, Shop } from "./pages/Pages";
import "./App.css";
import "./styles/shop.css";

/** Scroll to top on page change, or to the #hash target when one is present. */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function Home() {
  return (
    <main>
      <Hero />
      <Marquee />
      <Featured />
      <CollectionGrid />
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <ScrollManager />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/journal/:slug" element={<JournalPost />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="*" element={<Shop />} />
        </Routes>
        <Footer />
        <CartDrawer />
      </CartProvider>
    </BrowserRouter>
  );
}