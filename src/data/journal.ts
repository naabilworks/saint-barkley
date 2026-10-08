/* SAMPLE COPY: the care and sizing advice is general and accurate for leather
   footwear, but review every article so it matches how your own products are made. */

export type Block =
  | { t: "p"; text: string }
  | { t: "h"; text: string }
  | { t: "ul"; items: string[] };

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  topic: "Care" | "Guide" | "Materials";
  date: string; // ISO
  product: string; // slug of the product used as cover and "featured" card
  body: Block[];
};

export const posts: Post[] = [
  {
    slug: "caring-for-suede-boots",
    title: "How to care for suede boots",
    excerpt:
      "Suede is easier to live with than its reputation suggests. Four habits keep it looking new for years.",
    topic: "Care",
    date: "2026-09-14",
    product: "alder-chelsea",
    body: [
      { t: "p", text: "Suede is leather with the soft nap on the outside. That nap is what makes it look rich, and also what makes it pick up dirt and water. The good news is that a small routine handles almost everything." },
      { t: "h", text: "Protect before the first wear" },
      { t: "p", text: "Apply a suede protector spray in a ventilated space, holding the can about 20 cm away. Let the first coat dry fully, then add a second. Repeat every few months if you wear the boots often." },
      { t: "h", text: "Brush after each wear" },
      { t: "p", text: "Use a suede brush, moving in one direction. This lifts the nap and removes dust before it settles in. For marks that do not brush out, a suede eraser works like a pencil eraser." },
      { t: "h", text: "If they get wet" },
      { t: "ul", items: [
        "Blot the surface with a clean cloth. Do not rub.",
        "Stuff the boots with plain paper to hold their shape and absorb moisture.",
        "Dry them at room temperature, away from heaters and direct sun.",
        "Once dry, brush the nap back up.",
      ]},
      { t: "p", text: "Heat is the real enemy. A radiator can stiffen suede for good, so patience is the safest method." },
    ],
  },
  {
    slug: "finding-your-size",
    title: "Finding your size in leather shoes",
    excerpt:
      "Leather stretches in width, not in length. Here is how to measure once and order with confidence.",
    topic: "Guide",
    date: "2026-09-02",
    product: "court-86",
    body: [
      { t: "p", text: "Most sizing problems come down to one thing: length cannot be fixed later, width can. Leather relaxes sideways with wear, but it will not grow longer. So choose the size by length first." },
      { t: "h", text: "Measure at the end of the day" },
      { t: "p", text: "Feet swell slightly through the day. Measure in the evening, standing, on a sheet of paper against a wall. Mark the longest toe and measure from the wall to the mark." },
      { t: "h", text: "What to look for" },
      { t: "ul", items: [
        "About a thumb's width of space in front of your longest toe.",
        "Your heel should stay put when you walk, with only a little lift.",
        "The sides should feel snug, not painful. New leather eases within a couple of weeks.",
      ]},
      { t: "p", text: "Our sizes run in EU numbers from 39 to 45. If you fall between two sizes, take the larger one and wear a slightly thicker sock while the leather settles." },
    ],
  },
  {
    slug: "breaking-in-loafers",
    title: "Breaking in a new pair of loafers",
    excerpt:
      "A new loafer should not hurt, but it should feel firm. A gentle first fortnight makes the difference.",
    topic: "Care",
    date: "2026-08-21",
    product: "moreno-penny",
    body: [
      { t: "p", text: "Good leather is firm when new. It softens as it warms and flexes with your foot. Rushing that process is what causes blisters, so give the shoes a few easy outings first." },
      { t: "h", text: "The first two weeks" },
      { t: "ul", items: [
        "Wear them at home for an hour or two, with socks.",
        "Take short walks before a full day out.",
        "Alternate with another pair so the leather can rest and dry.",
      ]},
      { t: "h", text: "Keep them in shape" },
      { t: "p", text: "Cedar shoe trees absorb moisture and hold the shape overnight. Add a light leather conditioner every couple of months, and a cream polish when the colour starts to dull." },
    ],
  },
  {
    slug: "reading-a-sole",
    title: "Leather, rubber, or vulcanised: reading a sole",
    excerpt:
      "The sole decides how a shoe grips, flexes, and ages. A quick guide to the three you will meet most often.",
    topic: "Materials",
    date: "2026-08-05",
    product: "fenn-derby",
    body: [
      { t: "p", text: "Before the upper, look at the sole. It tells you what the shoe was built to do." },
      { t: "h", text: "Leather" },
      { t: "p", text: "Slim, elegant, and breathable. Leather soles suit dry weather and dress shoes, and they can be replaced by a cobbler. They are slippery on wet or polished floors." },
      { t: "h", text: "Rubber" },
      { t: "p", text: "Grippy and durable, and happier in rain. Rubber soles add a little weight, and many can also be resoled." },
      { t: "h", text: "Vulcanised" },
      { t: "p", text: "The upper is bonded to a rubber sole under heat. The result is flexible and light, which is why sneakers use it. It is comfortable from day one, though it is harder to resole." },
    ],
  },
];

export const getPost = (slug?: string) => posts.find((p) => p.slug === slug);

export const readMins = (post: Post) => {
  const words = post.body
    .map((b) => (b.t === "ul" ? b.items.join(" ") : b.text))
    .join(" ")
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
};

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });