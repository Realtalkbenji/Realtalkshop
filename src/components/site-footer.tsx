import Link from "next/link"
import { brand } from "@/lib/content"

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-[oklch(0.2_0.02_45)] text-[oklch(0.95_0.01_85)]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-[1fr_auto] sm:items-end sm:px-6">
        <div>
          <p className="font-heading text-2xl tracking-[0.14em] uppercase">
            {brand.name}
          </p>
          <p className="mt-3 max-w-sm text-sm text-[oklch(0.82_0.02_80)]">
            {brand.tagline}
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm sm:items-end">
          <Link className="underline-offset-4 hover:underline" href="/shop">
            Shop the drop
          </Link>
          <Link className="underline-offset-4 hover:underline" href="/about">
            About the shop
          </Link>
          <a
            className="underline-offset-4 hover:underline"
            href={`mailto:${brand.email}`}
          >
            {brand.email}
          </a>
        </div>
      </div>
    </footer>
  )
}
