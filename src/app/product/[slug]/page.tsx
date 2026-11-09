import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { AddToCart } from "@/components/add-to-cart"
import { ProductCard } from "@/components/product-card"
import { ProductImage } from "@/components/product-image"
import { formatPrice } from "@/lib/money"
import {
  getCategoryLabel,
  getProduct,
  getRelatedProducts,
  products,
} from "@/lib/products"

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) {
    return { title: "Not found" }
  }
  return { title: product.name, description: product.summary }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = getProduct(slug)

  if (!product) {
    notFound()
  }

  const related = getRelatedProducts(product)

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <nav className="text-sm text-muted-foreground">
        <Link
          href="/shop"
          className="underline-offset-4 hover:text-foreground hover:underline"
        >
          Shop
        </Link>
        <span className="px-2">/</span>
        <Link
          href={`/shop?category=${product.category}`}
          className="underline-offset-4 hover:text-foreground hover:underline"
        >
          {getCategoryLabel(product.category)}
        </Link>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <ProductImage product={product} className="aspect-[4/5] rounded-lg" />
        <div>
          <p className="text-sm tracking-[0.18em] text-muted-foreground uppercase">
            {getCategoryLabel(product.category)}
          </p>
          <h1 className="font-heading mt-2 text-4xl tracking-tight">
            {product.name}
          </h1>
          <p className="mt-3 text-lg tabular-nums">
            {formatPrice(product.priceCents)}
          </p>
          <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
            {product.summary}
          </p>
          <AddToCart product={product} />
          <ul className="mt-10 space-y-2 text-sm text-muted-foreground">
            {product.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-20">
          <h2 className="font-heading text-3xl tracking-tight">
            More {getCategoryLabel(product.category).toLowerCase()}
          </h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
