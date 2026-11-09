"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart"
import type { Product } from "@/lib/products"
import { cn } from "@/lib/utils"

export function AddToCart({ product }: { product: Product }) {
  const { addItem } = useCart()
  const router = useRouter()
  const [size, setSize] = useState(
    product.sizes.length === 1 ? (product.sizes[0] ?? "") : "",
  )
  const [error, setError] = useState("")
  const [added, setAdded] = useState(false)

  if (product.soldOut) {
    return (
      <div className="mt-8 rounded-lg border border-dashed border-border px-4 py-5">
        <p className="font-heading text-xl">Sold out</p>
        <p className="mt-1 text-sm text-muted-foreground">
          This size run is gone. Check the rest of the drop, or come back when
          the next cut lands.
        </p>
      </div>
    )
  }

  function handleAdd() {
    if (!size) {
      setError("Choose a size first.")
      setAdded(false)
      return
    }
    addItem(product.id, size)
    setError("")
    setAdded(true)
  }

  return (
    <fieldset className="mt-8">
      <legend className="text-sm font-medium">Size</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {product.sizes.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => {
              setSize(option)
              setError("")
              setAdded(false)
            }}
            aria-pressed={size === option}
            className={cn(
              "min-w-12 rounded-md border px-3 py-2 text-sm",
              size === option
                ? "border-foreground bg-foreground text-background"
                : "border-border hover:border-foreground",
            )}
          >
            {option}
          </button>
        ))}
      </div>
      {error ? (
        <p className="mt-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      <div className="mt-6 flex flex-wrap gap-3">
        <Button size="lg" className="h-11 px-5" onClick={handleAdd}>
          Add to bag
        </Button>
        {added ? (
          <Button
            size="lg"
            variant="outline"
            className="h-11 px-5"
            onClick={() => router.push("/cart")}
          >
            View bag
          </Button>
        ) : null}
      </div>
      {added ? (
        <p className="mt-3 text-sm" role="status">
          Added in {size}. It is waiting in your bag.
        </p>
      ) : null}
    </fieldset>
  )
}
