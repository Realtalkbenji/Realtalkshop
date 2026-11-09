import { Suspense } from "react"
import { ShopView } from "@/components/shop-view"

export const metadata = {
  title: "Shop",
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-16 text-muted-foreground">
          Loading the catalog…
        </div>
      }
    >
      <ShopView />
    </Suspense>
  )
}
