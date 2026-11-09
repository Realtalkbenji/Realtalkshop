"use client"

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { getProduct, type Product } from "@/lib/products"

export type CartLine = {
  productId: string
  size: string
  quantity: number
}

export type CartEntry = CartLine & {
  product: Product
  lineTotalCents: number
}

const STORAGE_KEY = "real-talk-cart-v1"

function readStoredCart(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return []
    }
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed.filter(isCartLine)
  } catch {
    return []
  }
}

function isCartLine(value: unknown): value is CartLine {
  if (typeof value !== "object" || value === null) {
    return false
  }
  const line = value as CartLine
  return (
    typeof line.productId === "string" &&
    typeof line.size === "string" &&
    Number.isInteger(line.quantity) &&
    line.quantity > 0
  )
}

function persist(lines: CartLine[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
}

type CartContextValue = {
  lines: CartLine[]
  entries: CartEntry[]
  count: number
  subtotalCents: number
  addItem: (productId: string, size: string, quantity?: number) => void
  setQuantity: (productId: string, size: string, quantity: number) => void
  removeItem: (productId: string, size: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() =>
    typeof window === "undefined" ? [] : readStoredCart(),
  )

  const value = useMemo<CartContextValue>(() => {
    const entries: CartEntry[] = lines.flatMap((line) => {
      const product = getProduct(line.productId)
      if (!product) {
        return []
      }
      return [
        {
          ...line,
          product,
          lineTotalCents: product.priceCents * line.quantity,
        },
      ]
    })
    const count = entries.reduce((sum, entry) => sum + entry.quantity, 0)
    const subtotalCents = entries.reduce(
      (sum, entry) => sum + entry.lineTotalCents,
      0,
    )

    function write(next: CartLine[]) {
      persist(next)
      setLines(next)
    }

    return {
      lines,
      entries,
      count,
      subtotalCents,
      addItem(productId, size, quantity = 1) {
        const existing = lines.find(
          (line) => line.productId === productId && line.size === size,
        )
        if (existing) {
          write(
            lines.map((line) =>
              line.productId === productId && line.size === size
                ? { ...line, quantity: line.quantity + quantity }
                : line,
            ),
          )
          return
        }
        write([...lines, { productId, size, quantity }])
      },
      setQuantity(productId, size, quantity) {
        if (quantity < 1) {
          write(
            lines.filter(
              (line) => !(line.productId === productId && line.size === size),
            ),
          )
          return
        }
        write(
          lines.map((line) =>
            line.productId === productId && line.size === size
              ? { ...line, quantity }
              : line,
          ),
        )
      },
      removeItem(productId, size) {
        write(
          lines.filter(
            (line) => !(line.productId === productId && line.size === size),
          ),
        )
      },
      clear() {
        write([])
      },
    }
  }, [lines])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const cart = useContext(CartContext)
  if (!cart) {
    throw new Error("useCart must be used inside CartProvider.")
  }
  return cart
}
