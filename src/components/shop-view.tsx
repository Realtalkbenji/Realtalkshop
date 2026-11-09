"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ProductCard } from "@/components/product-card"
import {
  categories,
  getProductsByCategory,
  isCategoryId,
  type CategoryId,
} from "@/lib/products"
import { cn } from "@/lib/utils"

export function ShopView() {
  const params = useSearchParams()
  const router = useRouter()
  const requested = params.get("category")
  const category: CategoryId | "all" = isCategoryId(requested)
    ? requested
    : "all"
  const items = getProductsByCategory(category)

  function setCategory(next: CategoryId | "all") {
    const query = next === "all" ? "/shop" : `/shop?category=${next}`
    router.replace(query)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-sm tracking-[0.18em] text-muted-foreground uppercase">
        Catalog
      </p>
      <h1 className="font-heading mt-2 text-4xl tracking-tight">Shop</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        The first cut. Filter by type, then open a piece for sizes and cloth.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        <FilterChip
          label="All"
          active={category === "all"}
          onClick={() => setCategory("all")}
        />
        {categories.map((item) => (
          <FilterChip
            key={item.id}
            label={item.label}
            active={category === item.id}
            onClick={() => setCategory(item.id)}
          />
        ))}
      </div>

      {items.length === 0 ? (
        <div className="mt-16 rounded-lg border border-dashed border-border px-6 py-16 text-center">
          <p className="font-heading text-2xl">Nothing in this category yet.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try another filter, or show every piece in the drop.
          </p>
          <Link
            href="/shop"
            className="mt-5 inline-block text-sm underline-offset-4 hover:underline"
          >
            Show every piece
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-background text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </button>
  )
}
