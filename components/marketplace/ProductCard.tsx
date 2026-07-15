"use client";

import Link from "next/link";
import {
    Heart,
    ShoppingCart,
    Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type ProductCardProps = {
    id: string;
    title: string;
    storeName: string;
    price: number;
    oldPrice?: number;
    rating: number;
    reviewCount: number;
    badge?: string;
    imageClassName?: string;
};

export default function ProductCard({
    id,
    title,
    storeName,
    price,
    oldPrice,
    rating,
    reviewCount,
    badge,
    imageClassName = "bg-gradient-to-br from-violet-100 to-violet-200",
}: ProductCardProps) {
    const handleAddToCart = () => {
        console.log("Add product to cart:", id);
    };

    const handleWishlist = () => {
        console.log("Add product to wishlist:", id);
    };

    return (
        <article className="group overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className={`relative aspect-[4/3] overflow-hidden ${imageClassName}`}>
                <Link
                    href={`/products/${id}`}
                    aria-label={`View ${title}`}
                    className="absolute inset-0"
                >
                    <div className="flex h-full items-center justify-center">
                        <ShoppingCart className="size-14 text-primary/20 transition duration-300 group-hover:scale-110" />
                    </div>
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
                <Link href={`/products/${id}`}>
                    <h3 className="line-clamp-2 min-h-12 text-base font-semibold transition hover:text-primary">
                        {title}
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
                        Rs. {price.toLocaleString()}
                    </span>

                    {oldPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                            Rs. {oldPrice.toLocaleString()}
                        </span>
                    )}
                </div>

                <Button
                    type="button"
                    onClick={handleAddToCart}
                    className="mt-5 w-full"
                >
                    <ShoppingCart className="size-4" />
                    Add to Cart
                </Button>
            </div>
        </article>
    );
}