import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Package,
  Store,
} from "lucide-react";

import type { MarketplaceStore } from "@/types/marketplace-home";

export default function StoreCard({
  name,
  slug,
  description,
  products,
  initials,
}: MarketplaceStore) {
  return (
    <article className="group rounded-3xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl hover:shadow-black/5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-lg font-bold text-primary">
          {initials || <Store className="size-6" />}
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
          <Package className="size-3.5" />
          {products.toLocaleString()}
        </span>
      </div>

      <div className="mt-5 flex items-center gap-2">
        <h3 className="truncate text-lg font-semibold">{name}</h3>
        <BadgeCheck className="size-4 shrink-0 text-primary" />
      </div>

      <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
        {description || "Marketplace Store"}
      </p>

      <Link
        href={`/stores/${slug}`}
        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary"
      >
        Visit Store
        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </article>
  );
}
