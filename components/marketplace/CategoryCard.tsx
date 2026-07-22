import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { MarketplaceCategory } from "@/types/marketplace-home";

export default function CategoryCard({
  name,
  productCount,
  icon: Icon,
}: MarketplaceCategory) {
  return (
    <Link
      href={`/products?category=${encodeURIComponent(name)}`}
      className="group rounded-3xl border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-black/5"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105">
          <Icon className="size-5" />
        </div>

        <ArrowUpRight className="size-4 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
      </div>

      <h3 className="mt-5 truncate font-semibold">{name}</h3>

      <p className="mt-1 text-xs text-muted-foreground">
        {productCount.toLocaleString()}{" "}
        {productCount === 1 ? "product" : "products"}
      </p>
    </Link>
  );
}
