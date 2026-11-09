import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <p className="text-sm tracking-[0.18em] text-muted-foreground uppercase">
        404
      </p>
      <h1 className="font-heading mt-3 text-4xl tracking-tight">
        That page is not in this shop
      </h1>
      <p className="mt-3 text-muted-foreground">
        The link may be old, or the piece was renamed.
      </p>
      <Link
        href="/shop"
        className={cn(
          buttonVariants({ size: "lg" }),
          "mt-8 inline-flex h-11 px-5",
        )}
      >
        Back to the catalog
      </Link>
    </div>
  )
}
