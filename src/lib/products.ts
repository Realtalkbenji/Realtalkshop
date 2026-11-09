// Catalog for the shop. Rename a piece, change the price, or add a row.
// To show a photo: save a JPG at public/products/{slug}.jpg
// Example: public/products/linen-shirt.jpg (around 1600px wide, under 500KB)

export const categories = [
  { id: "shirts", label: "Shirts" },
  { id: "knitwear", label: "Knitwear" },
  { id: "trousers", label: "Trousers" },
  { id: "outerwear", label: "Outerwear" },
  { id: "accessories", label: "Accessories" },
] as const

export type CategoryId = (typeof categories)[number]["id"]

export type Product = {
  id: string
  slug: string
  name: string
  priceCents: number
  category: CategoryId
  summary: string
  details: string[]
  sizes: string[]
  featured: boolean
  soldOut: boolean
  swatch: string
  swatchInk: string
}

export const products: Product[] = [
  {
    id: "linen-shirt",
    slug: "linen-shirt",
    name: "Open collar linen shirt",
    priceCents: 8800,
    category: "shirts",
    summary:
      "A relaxed camp collar in mid-weight linen. Wear it open over a tee or closed with the trousers.",
    details: [
      "100% linen",
      "Camp collar, corozo buttons",
      "Cut to sit off the hip",
      "Machine wash cold, hang dry",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    featured: true,
    soldOut: false,
    swatch: "#ddd4c4",
    swatchInk: "#3f382e",
  },
  {
    id: "heavy-tee",
    slug: "heavy-tee",
    name: "Heavyweight tee",
    priceCents: 4200,
    category: "shirts",
    summary:
      "A thick cotton tee with a set-in sleeve and a neck that does not blow out after a month.",
    details: [
      "Heavyweight cotton jersey",
      "Rib collar, taped neck",
      "Straight hem",
      "Machine wash cold",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    featured: false,
    soldOut: false,
    swatch: "#2a3138",
    swatchInk: "#e8e4dc",
  },
  {
    id: "merino-crew",
    slug: "merino-crew",
    name: "Merino crew",
    priceCents: 12000,
    category: "knitwear",
    summary:
      "Fine merino with a quiet rib at the collar, cuff, and hem. Thin enough for a jacket, warm enough alone.",
    details: [
      "Extrafine merino wool",
      "Regular fit, set-in sleeve",
      "Rib collar, cuff, and hem",
      "Hand wash or dry clean",
    ],
    sizes: ["S", "M", "L", "XL"],
    featured: true,
    soldOut: false,
    swatch: "#3d3a38",
    swatchInk: "#ece7df",
  },
  {
    id: "wool-trouser",
    slug: "wool-trouser",
    name: "Wide wool trouser",
    priceCents: 14800,
    category: "trousers",
    summary:
      "A full leg in a dry wool blend, with a hook-and-bar close and a crease that shows up when you want it.",
    details: [
      "Wool blend, unlined",
      "Wide straight leg",
      "Side adjusters, two rear pockets",
      "Dry clean",
    ],
    sizes: ["28", "30", "32", "34", "36"],
    featured: true,
    soldOut: false,
    swatch: "#b7b1a6",
    swatchInk: "#2f2c28",
  },
  {
    id: "canvas-jacket",
    slug: "canvas-jacket",
    name: "Canvas work jacket",
    priceCents: 18600,
    category: "outerwear",
    summary:
      "Cotton canvas with a corozo-button front and two chest pockets. The piece you reach for when the morning is cold.",
    details: [
      "Washed cotton canvas",
      "Unlined, interior pocket",
      "Corozo buttons",
      "Spot clean or dry clean",
    ],
    sizes: ["S", "M", "L", "XL"],
    featured: true,
    soldOut: false,
    swatch: "#8c5a3c",
    swatchInk: "#f3ebe3",
  },
  {
    id: "everyday-chino",
    slug: "everyday-chino",
    name: "Everyday chino",
    priceCents: 9800,
    category: "trousers",
    summary:
      "A mid-rise chino with a tapered leg. The pair that replaces the ones already in rotation.",
    details: [
      "Cotton twill",
      "Zip fly, belt loops",
      "Tapered from the knee",
      "Machine wash cold",
    ],
    sizes: ["28", "30", "32", "34", "36"],
    featured: false,
    soldOut: false,
    swatch: "#5c6148",
    swatchInk: "#f0eee6",
  },
  {
    id: "cotton-overshirt",
    slug: "cotton-overshirt",
    name: "Cotton overshirt",
    priceCents: 13200,
    category: "outerwear",
    summary:
      "A shirt you can wear as a jacket. Two pockets, a soft wash, and enough room for a crew underneath.",
    details: [
      "Garment-washed cotton",
      "Chest pockets, button front",
      "Cut to layer",
      "Machine wash cold",
    ],
    sizes: ["S", "M", "L", "XL"],
    featured: false,
    soldOut: false,
    swatch: "#243044",
    swatchInk: "#e7e4dc",
  },
  {
    id: "ribbed-beanie",
    slug: "ribbed-beanie",
    name: "Ribbed beanie",
    priceCents: 3600,
    category: "accessories",
    summary: "A merino rib beanie that sits above the ears without a slouch.",
    details: ["Merino wool rib", "Turned cuff", "One size", "Hand wash"],
    sizes: ["One size"],
    featured: false,
    soldOut: false,
    swatch: "#1a1a1a",
    swatchInk: "#f2eee8",
  },
  {
    id: "stripe-oxford",
    slug: "stripe-oxford",
    name: "Stripe oxford",
    priceCents: 9600,
    category: "shirts",
    summary:
      "A classic oxford with a fine stripe. This one is in the catalog as sold out so you can see that state.",
    details: [
      "Cotton oxford",
      "Button-down collar",
      "Box pleat at the back",
      "Machine wash cold",
    ],
    sizes: ["S", "M", "L", "XL"],
    featured: false,
    soldOut: true,
    swatch: "#6b7c8a",
    swatchInk: "#f4f1ea",
  },
]

export function getProduct(slug: string) {
  return products.find(
    (product) => product.slug === slug || product.id === slug,
  )
}

export function getFeaturedProducts() {
  return products.filter((product) => product.featured)
}

export function getProductsByCategory(category?: CategoryId | "all") {
  if (!category || category === "all") {
    return products
  }
  return products.filter((product) => product.category === category)
}

export function getRelatedProducts(product: Product, limit = 3) {
  return products
    .filter(
      (candidate) =>
        candidate.id !== product.id && candidate.category === product.category,
    )
    .slice(0, limit)
}

export function getCategoryLabel(id: CategoryId) {
  return categories.find((category) => category.id === id)?.label ?? id
}

export function isCategoryId(value: string | null): value is CategoryId {
  return categories.some((category) => category.id === value)
}
