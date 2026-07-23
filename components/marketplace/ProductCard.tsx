"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
    ArrowRight,
    Heart,
    Loader2,
    PackageOpen,
    Store,
} from "lucide-react";
import { toast } from "sonner";
import { toggleWishlist } from "@/lib/wishlist/toggle-wishlist";
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

type ProductCardProps = MarketplaceProduct & {
    id: string;
};

export default function ProductCard({
    id,
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
}: ProductCardProps) {
    const router = useRouter();

    const [wishlisted, setWishlisted] =
        useState(isWishlisted);

    const [wishlistLoading, setWishlistLoading] =
        useState(false);

    const currentPrice =
        salePrice !== null && salePrice < price
            ? salePrice
            : price;

    const discount =
        salePrice !== null && salePrice < price
            ? Math.round(
                ((price - salePrice) / price) * 100,
            )
            : 0;

    async function handleWishlist() {
        if (wishlistLoading) return;

        const previousValue = wishlisted;

        setWishlisted(!previousValue);
        setWishlistLoading(true);

        try {
            const result = await toggleWishlist(id);

            if (!result.success) {
                setWishlisted(previousValue);

                if (result.message === "Unauthorized") {
                    toast.error(
                        "Please login to add products to wishlist",
                    );

                    router.push("/auth/login");
                    return;
                }

                throw new Error(
                    result.message ||
                    "Unable to update wishlist",
                );
            }

            const added = result.action === "added";

            setWishlisted(added);

            toast.success(
                added
                    ? "Product added to wishlist"
                    : "Product removed from wishlist",
            );

            router.refresh();
        } catch (error) {
            setWishlisted(previousValue);

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Unable to update wishlist",
            );
        } finally {
            setWishlistLoading(false);
        }
    }

    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-[22px] border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
            <div className="relative overflow-hidden bg-muted/40">
                <Link
                    href={`/products/${slug}`}
                    className="relative block aspect-square"
                >
                    {image ? (
                        <Image
                            src={image}
                            alt={name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-contain p-5 transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <PackageOpen className="size-12 text-muted-foreground/30" />
                        </div>
                    )}
                </Link>

                <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-2">
                    {badge && (
                        <span className="rounded-lg bg-foreground px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-background shadow-sm">
                            {badge}
                        </span>
                    )}

                    {discount > 0 && (
                        <span className="rounded-lg bg-primary px-2.5 py-1 text-[10px] font-bold text-primary-foreground shadow-sm">
                            -{discount}%
                        </span>
                    )}
                </div>

                <button
                    type="button"
                    onClick={handleWishlist}
                    disabled={wishlistLoading}
                    aria-label={
                        wishlisted
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                    }
                    className={cn(
                        "absolute right-3 top-3 z-10 flex size-10 items-center justify-center rounded-full border bg-background/95 shadow-sm backdrop-blur transition-all hover:scale-105",
                        wishlisted &&
                        "border-red-200 bg-red-50 text-red-500",
                    )}
                >
                    {wishlistLoading ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : (
                        <Heart
                            className={cn(
                                "size-[18px]",
                                wishlisted &&
                                "fill-current text-red-500",
                            )}
                        />
                    )}
                </button>
            </div>

            <div className="flex flex-1 flex-col p-4">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                    <span className="truncate">
                        {category}
                    </span>

                    {brand && (
                        <>
                            <span>•</span>
                            <span className="truncate">
                                {brand}
                            </span>
                        </>
                    )}
                </div>

                <Link href={`/products/${slug}`}>
                    <h3 className="mt-2 line-clamp-2 min-h-11 text-[15px] font-semibold leading-[22px] text-foreground transition-colors group-hover:text-primary">
                        {name}
                    </h3>
                </Link>

                <Link
                    href={`/stores/${storeSlug}`}
                    className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                    <Store className="size-3.5 shrink-0" />

                    <span className="truncate">
                        {storeName}
                    </span>
                </Link>

                <div className="mt-auto pt-4">
                    <div className="flex items-end justify-between gap-3">
                        <div className="min-w-0">
                            <p className="text-lg font-bold leading-none">
                                {formatPrice(currentPrice)}
                            </p>

                            {discount > 0 && (
                                <p className="mt-1.5 text-xs text-muted-foreground line-through">
                                    {formatPrice(price)}
                                </p>
                            )}
                        </div>

                        <span
                            className={cn(
                                "shrink-0 rounded-lg px-2 py-1 text-[10px] font-semibold",
                                stock > 0
                                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                                    : "bg-destructive/10 text-destructive",
                            )}
                        >
                            {stock > 0
                                ? "In Stock"
                                : "Out of Stock"}
                        </span>
                    </div>

                    <Link
                        href={`/products/${slug}`}
                        className={cn(
                            buttonVariants({
                                variant: "outline",
                            }),
                            "mt-4 w-full justify-between rounded-xl",
                        )}
                    >
                        View Product
                        <ArrowRight className="size-4" />
                    </Link>
                </div>
            </div>
        </article>
    );
}