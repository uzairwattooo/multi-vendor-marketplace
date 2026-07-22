import Image from "next/image";
import Link from "next/link";
import {
    ArrowRight,
    Heart,
    PackageOpen,
    Store,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { MarketplaceProduct } from "@/types/marketplace-home";

function formatPrice(amount: number) {
    return new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        maximumFractionDigits: 0,
    }).format(amount);
}

export default function ProductCard({
    name,
    slug,
    category,
    brand,
    storeName,
    storeSlug,
    price,
    salePrice,
    stock,
    image,
    isWishlisted = false,
    badge,
}: MarketplaceProduct) {
    const currentPrice =
        salePrice !== null && salePrice < price
            ? salePrice
            : price;

    const discount =
        salePrice !== null && salePrice < price
            ? Math.round(((price - salePrice) / price) * 100)
            : 0;

    return (
        <article className="group overflow-hidden rounded-3xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl hover:shadow-black/5">
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                {image ? (
                    <Image
                        src={image}
                        alt={name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw p-4"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <PackageOpen className="size-12 text-muted-foreground/35" />
                    </div>
                )}

                <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                    {badge && (
                        <span className="rounded-full bg-foreground px-3 py-1 text-[11px] font-semibold text-background shadow-sm">
                            {badge}
                        </span>
                    )}

                    {discount > 0 && (
                        <span className="rounded-full bg-primary px-3 py-1 text-[11px] font-bold text-primary-foreground shadow-sm">
                            -{discount}%
                        </span>
                    )}
                </div>

                <Link
                    href="/wishlist"
                    aria-label="Open wishlist"
                    className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full border bg-background/90 shadow-sm backdrop-blur transition-colors hover:bg-background"
                >
                    <Heart
                        className={cn(
                            "size-4",
                            isWishlisted && "fill-current text-red-500",
                        )}
                    />
                </Link>
            </div>

            <div className="p-5">
                <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    <span className="truncate">{category}</span>

                    {brand && (
                        <>
                            <span aria-hidden="true">•</span>
                            <span className="truncate">{brand}</span>
                        </>
                    )}
                </div>

                <Link href={`/products/${slug}`}>
                    <h3 className="mt-2 line-clamp-2 min-h-12 text-base font-semibold leading-6 transition-colors group-hover:text-primary">
                        {name}
                    </h3>
                </Link>

                <Link
                    href={`/stores/${storeSlug}`}
                    className="mt-3 flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                    <Store className="size-3.5 shrink-0" />
                    <span className="truncate">{storeName}</span>
                </Link>

                <div className="mt-5 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-lg font-bold">
                            {formatPrice(currentPrice)}
                        </p>

                        {discount > 0 && (
                            <p className="mt-0.5 text-xs text-muted-foreground line-through">
                                {formatPrice(price)}
                            </p>
                        )}
                    </div>

                    <span
                        className={cn(
                            "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                            stock > 0
                                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                                : "bg-destructive/10 text-destructive",
                        )}
                    >
                        {stock > 0 ? "In stock" : "Out of stock"}
                    </span>
                </div>

                <Link
                    href={`/products/${slug}`}
                    className={cn(
                        buttonVariants({ variant: "outline" }),
                        "mt-5 w-full gap-2 rounded-xl",
                    )}
                >
                    View Product
                    <ArrowRight className="size-4" />
                </Link>
            </div>
        </article>
    );
}
