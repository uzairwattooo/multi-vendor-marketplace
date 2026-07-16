"use client";

import Link from "next/link";
import {
    Heart,
    ShoppingCart,
    Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import AddToCartButton from "./AddToCartButton";
import type { MarketplaceProduct } from "@/types/product";

type ProductCardProps = MarketplaceProduct & {
    badge?: string;
    imageClassName?: string;
};

export default function ProductCard({
    id,
    name,
    slug,
    storeId,
    storeName,
    price,
    salePrice,
    stock,
    image,
    rating = 0,
    reviewCount = 0,
    badge,
    imageClassName = "bg-gradient-to-br from-violet-100 to-violet-200",
}: ProductCardProps) {
    function handleWishlist() {
        console.log("Add product to wishlist:", id);
    }

    const displayPrice = salePrice ?? price;

    return (
        <article className="group overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div
                className={`relative aspect-[4/3] overflow-hidden ${imageClassName}`}
            >
                <Link
                    href={`/products/${slug}`}
                    aria-label={`View ${name}`}
                    className="absolute inset-0"
                >
                    {image ? (
                        <img
                            src={image}
                            alt={name}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <ShoppingCart className="size-14 text-primary/20 transition duration-300 group-hover:scale-110" />
                        </div>
                    )}
                </Link>

                {badge && (
                    <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                        {badge}
                    </span>
                )}

                <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    onClick={handleWishlist}
                    aria-label="Add to wishlist"
                    className="absolute right-3 top-3 rounded-full bg-background/90 shadow-sm backdrop-blur hover:text-red-500"
                >
                    <Heart className="size-4" />
                </Button>
            </div>

            <div className="p-5">
                <Link href={`/products/${slug}`}>
                    <h3 className="line-clamp-2 min-h-12 text-base font-semibold transition hover:text-primary">
                        {name}
                    </h3>
                </Link>

                <p className="mt-2 text-sm text-muted-foreground">
                    {storeName}
                </p>

                <div className="mt-3 flex items-center gap-1">
                    <Star className="size-4 fill-amber-400 text-amber-400" />

                    <span className="text-sm font-medium">
                        {rating}
                    </span>

                    <span className="text-sm text-muted-foreground">
                        ({reviewCount})
                    </span>
                </div>

                <div className="mt-4 flex items-center gap-2">
                    <span className="text-lg font-bold">
                        Rs. {displayPrice.toLocaleString()}
                    </span>

                    {salePrice && (
                        <span className="text-sm text-muted-foreground line-through">
                            Rs. {price.toLocaleString()}
                        </span>
                    )}
                </div>

                <div className="mt-4">
                    <AddToCartButton
                        product={{
                            productId: id,
                            name,
                            slug,
                            image,
                            price: displayPrice,
                            stock,
                            storeId,
                            storeName,
                        }}
                    />
                </div>
            </div>
        </article>
    );
}