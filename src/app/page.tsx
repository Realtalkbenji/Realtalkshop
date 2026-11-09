import Link from "next/link"
import { ProductCard } from "@/components/product-card"
import { ProductImage } from "@/components/product-image"
import { buttonVariants } from "@/components/ui/button"
import { about, brand, careNote } from "@/lib/content"
import {
  categories,
  getFeaturedProducts,
  getProduct,
} from "@/lib/products"
import { cn } from "@/lib/utils"

export default function HomePage() {
  const featured = getFeaturedProducts()
  const heroProduct = getProduct("canvas-jacket") ?? featured[0]

  return (
    <div>
      <section className="mx-auto grid max-w-6xl items-stretch gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:py-16">
        <div className="flex flex-col justify-center py-4">
          <p className="text-sm tracking-[0.22em] text-muted-foreground uppercase">
            First drop
          </p>
          <h1 className="font-heading mt-4 max-w-xl text-4xl leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            {brand.tagline}
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
            Shirts, knitwear, trousers, and a jacket for the days that do not
            need a costume. Linen that softens, canvas that takes a crease, a
            chino you can wear on a Tuesday.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className={cn(buttonVariants({ size: "lg" }), "h-11 px-5")}
            >
              Shop the collection
            </Link>
            <Link
              href="/about"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "h-11 px-5",
              )}
            >
              About the shop
            </Link>
          </div>
        </div>
        {heroProduct ? (
          <Link href={`/product/${heroProduct.slug}`} className="block">
            <ProductImage
              product={heroProduct}
              className="aspect-[4/5] min-h-[22rem] rounded-lg sm:min-h-[28rem]"
            />
          </Link>
        ) : null}
      </section>

      <section className="border-y border-border bg-secondary/60">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm tracking-[0.18em] text-muted-foreground uppercase">
                This week
              </p>
              <h2 className="font-heading mt-2 text-3xl tracking-tight">
                Featured pieces
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-sm underline-offset-4 hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <p className="text-sm tracking-[0.18em] text-muted-foreground uppercase">
          Shop by type
        </p>
        <h2 className="font-heading mt-2 text-3xl tracking-tight">
          Find a piece
        </h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.id}`}
              className="rounded-lg border border-border bg-card px-4 py-6 transition-colors hover:bg-secondary"
            >
              <p className="font-heading text-xl tracking-tight">
                {category.label}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                See the {category.label.toLowerCase()}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="text-sm tracking-[0.18em] text-muted-foreground uppercase">
              {about.kicker}
            </p>
            <h2 className="font-heading mt-2 max-w-md text-3xl tracking-tight">
              {about.title}
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
              {about.body[0]}
            </p>
            <Link
              href="/about"
              className="mt-5 inline-block text-sm underline-offset-4 hover:underline"
            >
              Read the rest
            </Link>
          </div>
          <div className="rounded-lg bg-secondary px-6 py-8">
            <h2 className="font-heading text-2xl tracking-tight">
              {careNote.title}
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {careNote.body}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
