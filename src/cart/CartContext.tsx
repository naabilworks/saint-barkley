import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import { products, type Product } from "../data/products";

type Line = { id: string; size: number; qty: number };

type Action =
  | { type: "add"; id: string; size: number }
  | { type: "qty"; id: string; size: number; qty: number }
  | { type: "remove"; id: string; size: number }
  | { type: "clear" };

const KEY = "cart:v1";
const MAX_QTY = 9;

function reducer(state: Line[], a: Action): Line[] {
  const same = (l: Line) =>
    "size" in a && l.id === a.id && l.size === a.size;

  switch (a.type) {
    case "add": {
      const hit = state.find(same);
      if (hit)
        return state.map((l) =>
          same(l) ? { ...l, qty: Math.min(l.qty + 1, MAX_QTY) } : l
        );
      return [...state, { id: a.id, size: a.size, qty: 1 }];
    }
    case "qty":
      return a.qty <= 0
        ? state.filter((l) => !same(l))
        : state.map((l) =>
            same(l) ? { ...l, qty: Math.min(a.qty, MAX_QTY) } : l
          );
    case "remove":
      return state.filter((l) => !same(l));
    case "clear":
      return [];
  }
}

function load(): Line[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as Line[]) : [];
    return parsed.filter((l) => products.some((p) => p.id === l.id));
  } catch {
    return [];
  }
}

export type CartItem = Line & { product: Product };

type CartCtx = {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  add: (product: Product, size: number) => void;
  setQty: (id: string, size: number, qty: number) => void;
  remove: (id: string, size: number) => void;
  clear: () => void;
  maxQty: number;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(reducer, [], load);
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      /* storage unavailable */
    }
  }, [lines]);

  const value = useMemo<CartCtx>(() => {
    const items = lines.flatMap((l) => {
      const product = products.find((p) => p.id === l.id);
      return product ? [{ ...l, product }] : [];
    });
    return {
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotal: items.reduce((n, i) => n + i.qty * i.product.price, 0),
      isOpen,
      maxQty: MAX_QTY,
      openCart: () => setOpen(true),
      closeCart: () => setOpen(false),
      add: (product, size) => {
        dispatch({ type: "add", id: product.id, size });
        setOpen(true);
      },
      setQty: (id, size, qty) => dispatch({ type: "qty", id, size, qty }),
      remove: (id, size) => dispatch({ type: "remove", id, size }),
      clear: () => dispatch({ type: "clear" }),
    };
  }, [lines, isOpen]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}