"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCart } from "@/lib/cart"
import { brand } from "@/lib/content"
import { cn } from "@/lib/utils"

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
]

export function SiteHeader() {
  const { count } = useCart()
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="leading-none">
          <span className="font-heading text-lg tracking-[0.14em] uppercase sm:text-xl">
            {brand.name}
          </span>
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-muted-foreground underline-offset-4 hover:text-foreground hover:underline",
                pathname.startsWith(link.href) && "text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/cart"
            className={cn(
              "text-muted-foreground underline-offset-4 hover:text-foreground hover:underline",
              pathname === "/cart" && "text-foreground",
            )}
          >
            {count > 0 ? `Bag (${count})` : "Bag"}
          </Link>
        </nav>
      </div>
    </header>
  )
}
