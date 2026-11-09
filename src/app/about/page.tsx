import type { Metadata } from "next"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { about, brand, careNote } from "@/lib/content"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "About",
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-sm tracking-[0.18em] text-muted-foreground uppercase">
        {about.kicker}
      </p>
      <h1 className="font-heading mt-3 text-4xl tracking-tight sm:text-5xl">
        {about.title}
      </h1>
      <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
        {about.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <section className="mt-12 rounded-lg bg-secondary px-6 py-8">
        <h2 className="font-heading text-2xl tracking-tight">{careNote.title}</h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          {careNote.body}
        </p>
      </section>

      <section className="mt-12 border-t border-border pt-10">
        <h2 className="font-heading text-2xl tracking-tight">Write to us</h2>
        <p className="mt-3 text-muted-foreground">
          Questions about size, cloth, or a future drop go to{" "}
          <a
            className="text-foreground underline-offset-4 hover:underline"
            href={`mailto:${brand.email}`}
          >
            {brand.email}
          </a>
          .
        </p>
        <Link
          href="/shop"
          className={cn(
            buttonVariants({ size: "lg" }),
            "mt-6 inline-flex h-11 px-5",
          )}
        >
          Shop the collection
        </Link>
      </section>
    </div>
  )
}
