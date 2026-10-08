export type Product = {
  id: string;
  slug: string;
  name: string;
  category: "Sneakers" | "Boots" | "Loafers";
  color: string;
  price: number;
  image: string;
  tag?: string;
  description: string;
  sizes: number[];
  soldOut?: number[];
};

const SIZES = [39, 40, 41, 42, 43, 44, 45];

export const products: Product[] = [
  {
    id: "court-86",
    slug: "court-86",
    name: "Court '86",
    category: "Sneakers",
    color: "Cream / Lime",
    price: 1890000,
    image: "/featured/featured-1.png",
    tag: "New",
    description:
      "A low-profile court shoe in smooth leather with a vulcanised sole. Clean enough for the office, easy enough for the weekend.",
    sizes: SIZES,
    soldOut: [39],
  },
  {
    id: "alder-chelsea",
    slug: "alder-chelsea",
    name: "Alder Chelsea",
    category: "Boots",
    color: "Ink Suede",
    price: 2450000,
    image: "/featured/featured-2.png",
    description:
      "A Chelsea boot in water-resistant suede with elastic side panels and a stacked heel. Pulls on in seconds.",
    sizes: SIZES,
    soldOut: [44, 45],
  },
  {
    id: "moreno-penny",
    slug: "moreno-penny",
    name: "Moreno Penny",
    category: "Loafers",
    color: "Walnut",
    price: 1750000,
    image: "/featured/featured-3.png",
    tag: "Best Seller",
    description:
      "A hand-finished penny loafer in walnut leather with a cushioned insole. Softens after the first week of wear.",
    sizes: SIZES,
  },
  {
    id: "kestrel-runner",
    slug: "kestrel-runner",
    name: "Kestrel Runner",
    category: "Sneakers",
    color: "Olive / Cream",
    price: 1590000,
    image: "/featured/featured-4.png",
    description:
      "A lightweight runner with a breathable mesh upper and a sprung foam midsole, made for long city days.",
    sizes: SIZES,
    soldOut: [40, 41],
  },
  {
    id: "fenn-derby",
    slug: "fenn-derby",
    name: "Fenn Derby",
    category: "Loafers",
    color: "Black Calf",
    price: 2190000,
    image: "/featured/featured-5.png",
    tag: "Limited",
    description:
      "A polished black calf derby with a slim last and a leather sole. Produced in a single run.",
    sizes: SIZES,
    soldOut: [39, 40],
  },
];

export const categories = ["Sneakers", "Boots", "Loafers"] as const;

export const getProduct = (slug?: string) => products.find((p) => p.slug === slug);

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);