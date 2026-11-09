"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { Product } from "@/lib/products"

export function ProductImage({
  product,
  alt,
  className,
}: {
  product: Product
  alt?: string
  className?: string
}) {
  const [status, setStatus] = useState<"pending" | "ready" | "missing">(
    "pending",
  )
  const label = alt ?? product.name

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ backgroundColor: product.swatch }}
    >
      {status !== "missing" ? (
        // Native img so a missing photo can fall back to the cloth color.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/products/${product.slug}.jpg`}
          alt={status === "ready" ? label : ""}
          className={cn(
            "absolute inset-0 size-full object-cover transition-opacity duration-300",
            status === "ready" ? "opacity-100" : "opacity-0",
          )}
          onLoad={() => setStatus("ready")}
          onError={() => setStatus("missing")}
        />
      ) : null}
      {status !== "ready" ? (
        <div className="absolute inset-0 flex flex-col justify-end p-5">
          <p
            className="max-w-[12rem] text-sm leading-snug tracking-wide"
            style={{ color: product.swatchInk }}
          >
            {product.name}
          </p>
        </div>
      ) : null}
    </div>
  )
}
