import Link from "next/link"
import { ProductImage } from "@/components/product-image"
import { formatPrice } from "@/lib/money"
import { getCategoryLabel, type Product } from "@/lib/products"

export function ProductCard({ product }: { product: Product }) {
  return (
    <article>
      <Link
        href={`/product/${product.slug}`}
        className="group block focus-visible:outline-none"
      >
        <ProductImage
          product={product}
          className="aspect-[4/5] rounded-md transition-transform duration-300 group-hover:-translate-y-0.5 group-focus-visible:ring-3 group-focus-visible:ring-ring/50"
        />
        <div className="mt-3 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-heading text-lg leading-tight tracking-tight">
              {product.name}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {getCategoryLabel(product.category)}
            </p>
          </div>
          <p className="text-sm tabular-nums">
            {product.soldOut ? "Sold out" : formatPrice(product.priceCents)}
          </p>
        </div>
      </Link>
    </article>
  )
}
