"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { ProductImage } from "@/components/product-image"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCart } from "@/lib/cart"
import { brand } from "@/lib/content"
import { formatPrice } from "@/lib/money"
import { cn } from "@/lib/utils"

type CheckoutForm = {
  name: string
  email: string
  phone: string
  address: string
  notes: string
}

type FieldName = "name" | "email" | "address"

const emptyForm: CheckoutForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
  notes: "",
}

export default function CartPage() {
  const { entries, count, subtotalCents, setQuantity, removeItem, clear } =
    useCart()
  const [form, setForm] = useState<CheckoutForm>(emptyForm)
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({})
  const [placed, setPlaced] = useState(false)

  if (placed) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 sm:px-6">
        <p className="text-sm tracking-[0.18em] text-muted-foreground uppercase">
          Request received
        </p>
        <h1 className="font-heading mt-2 text-4xl tracking-tight">
          We have your order note
        </h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          This first version of the shop keeps the bag on this computer and
          shows a confirmation here. It does not take a card yet. When you are
          ready to sell, we can wire payments and email.
        </p>
        <p className="mt-4 text-sm">
          We will use {form.email || brand.email} if we need to follow up.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-block text-sm underline-offset-4 hover:underline"
        >
          Keep looking
        </Link>
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-heading text-4xl tracking-tight">Your bag is empty</h1>
        <p className="mt-3 text-muted-foreground">
          Add a shirt, a jacket, or whatever is in this drop.
        </p>
        <Link
          href="/shop"
          className={cn(
            buttonVariants({ size: "lg" }),
            "mt-8 inline-flex h-11 px-5",
          )}
        >
          Shop the collection
        </Link>
      </div>
    )
  }

  function validate(next: CheckoutForm) {
    const nextErrors: Partial<Record<FieldName, string>> = {}
    if (next.name.trim().length < 2) {
      nextErrors.name = "Add the name on the order."
    }
    if (!next.email.includes("@")) {
      nextErrors.email = "Add an email we can write back to."
    }
    if (next.address.trim().length < 8) {
      nextErrors.address = "Add a shipping address."
    }
    return nextErrors
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      return
    }
    clear()
    setPlaced(true)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-heading text-4xl tracking-tight">Bag</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {count} {count === 1 ? "piece" : "pieces"} · {formatPrice(subtotalCents)}
      </p>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <ul className="space-y-6">
          {entries.map((entry) => (
            <li
              key={`${entry.productId}-${entry.size}`}
              className="grid grid-cols-[6.5rem_1fr] gap-4 border-b border-border pb-6 sm:grid-cols-[8rem_1fr]"
            >
              <ProductImage
                product={entry.product}
                className="aspect-[4/5] rounded-md"
              />
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      href={`/product/${entry.product.slug}`}
                      className="font-heading text-xl tracking-tight underline-offset-4 hover:underline"
                    >
                      {entry.product.name}
                    </Link>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Size {entry.size}
                    </p>
                  </div>
                  <p className="text-sm tabular-nums">
                    {formatPrice(entry.lineTotalCents)}
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <label className="text-sm">
                    Qty
                    <input
                      type="number"
                      min={1}
                      max={9}
                      value={entry.quantity}
                      onChange={(event) => {
                        const next = Number(event.target.value)
                        if (Number.isFinite(next)) {
                          setQuantity(entry.productId, entry.size, next)
                        }
                      }}
                      className="ml-2 h-8 w-16 rounded-md border border-input bg-transparent px-2 text-sm"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => removeItem(entry.productId, entry.size)}
                    className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <form
          onSubmit={handleSubmit}
          className="h-fit rounded-lg border border-border bg-card p-5 sm:p-6"
        >
          <h2 className="font-heading text-2xl tracking-tight">Checkout</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Subtotal {formatPrice(subtotalCents)}. Shipping is figured later —
            this form only saves a note on the page.
          </p>

          <div className="mt-6 space-y-4">
            <Field
              id="name"
              label="Name"
              value={form.name}
              error={errors.name}
              onChange={(value) => setForm({ ...form, name: value })}
            />
            <Field
              id="email"
              label="Email"
              type="email"
              value={form.email}
              error={errors.email}
              onChange={(value) => setForm({ ...form, email: value })}
            />
            <Field
              id="phone"
              label="Phone (optional)"
              value={form.phone}
              onChange={(value) => setForm({ ...form, phone: value })}
            />
            <div className="space-y-2">
              <Label htmlFor="address">Shipping address</Label>
              <Textarea
                id="address"
                value={form.address}
                onChange={(event) =>
                  setForm({ ...form, address: event.target.value })
                }
                aria-invalid={Boolean(errors.address)}
                className="min-h-24"
              />
              {errors.address ? (
                <p className="text-sm text-destructive">{errors.address}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                value={form.notes}
                onChange={(event) =>
                  setForm({ ...form, notes: event.target.value })
                }
              />
            </div>
          </div>

          <Button type="submit" size="lg" className="mt-6 h-11 w-full px-5">
            Place the order note
          </Button>
        </form>
      </div>
    </div>
  )
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  type?: string
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        className="h-10"
      />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  )
}
