"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    ChevronLeft,
    ChevronRight,
    Heart,
    Loader2,
    PackageOpen,
    PackageSearch,
    Search,
    SlidersHorizontal,
    Store,
} from "lucide-react";
import { toast } from "sonner";

import {
    getPublicProducts,
    type PublicProduct,
    type ProductsResponse,
} from "@/services/public-product-service";
import { toggleWishlist } from "@/lib/wishlist/toggle-wishlist";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import AddToCartButton from "./AddToCartButton";

type CategoryFilter =
    | "all"
    | "electronics"
    | "fashion"
    | "home-living"
    | "audio"
    | "sports"
    | "kids";

type SortOption =
    | "newest"
    | "price-low"
    | "price-high";

type WishlistProduct = PublicProduct & {
    isWishlisted?: boolean;
};

const categories: CategoryFilter[] = [
    "all",
    "electronics",
    "fashion",
    "home-living",
    "audio",
    "sports",
    "kids",
];

const categoryLabels: Record<CategoryFilter, string> = {
    all: "All Categories",
    electronics: "Electronics",
    fashion: "Fashion",
    "home-living": "Home & Living",
    audio: "Audio",
    sports: "Sports",
    kids: "Kids",
};

function formatPrice(amount: number | string) {
    return new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        maximumFractionDigits: 0,
    }).format(Number(amount));
}

export default function PublicProducts() {
    const [searchInput, setSearchInput] =
        useState<string>("");

    const [search, setSearch] =
        useState<string>("");

    const [category, setCategory] =
        useState<CategoryFilter>("all");

    const [sort, setSort] =
        useState<SortOption>("newest");

    const [page, setPage] =
        useState<number>(1);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setSearch(searchInput.trim());
            setPage(1);
        }, 400);

        return () => clearTimeout(timeout);
    }, [searchInput]);

    const {
        data,
        isLoading,
        isFetching,
        isError,
        error,
        refetch,
    } = useQuery<ProductsResponse, Error>({
        queryKey: [
            "public-products",
            search,
            category,
            sort,
            page,
        ],

        queryFn: () =>
            getPublicProducts({
                search,
                category,
                sort,
                page,
            }),

        placeholderData: (previousData) =>
            previousData,
    });

    function handleCategory(
        value: CategoryFilter,
    ) {
        setCategory(value);
        setPage(1);
    }

    function handleSort(value: SortOption) {
        setSort(value);
        setPage(1);
    }

    function clearFilters() {
        setSearchInput("");
        setSearch("");
        setCategory("all");
        setSort("newest");
        setPage(1);
    }

    const hasActiveFilters =
        search.length > 0 ||
        category !== "all" ||
        sort !== "newest";

    if (isError) {
        return (
            <div className="rounded-3xl border border-destructive/20 bg-destructive/5 px-6 py-12 text-center">
                <PackageSearch className="mx-auto size-12 text-destructive/70" />

                <h2 className="mt-4 text-xl font-semibold text-destructive">
                    Unable to load products
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                    {error instanceof Error
                        ? error.message
                        : "Something went wrong while loading marketplace products."}
                </p>

                <Button
                    type="button"
                    variant="outline"
                    className="mt-6"
                    onClick={() => refetch()}
                >
                    Try Again
                </Button>
            </div>
        );
    }

    return (
        <section className="space-y-8">
            <div className="relative overflow-hidden rounded-[28px] border bg-card px-6 py-8 shadow-sm sm:px-8 lg:px-10 lg:py-10">
                <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-primary/10 blur-3xl" />

                <div className="relative max-w-2xl">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary sm:text-sm">
                        Marketplace
                    </p>

                    <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                        Explore Products
                    </h1>

                    <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                        Discover quality products from
                        approved marketplace stores across
                        Pakistan.
                    </p>
                </div>
            </div>

            <div className="sticky top-3 z-20 rounded-3xl border bg-background/95 p-4 shadow-sm backdrop-blur-xl">
                <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_220px_auto]">
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                            value={searchInput}
                            onChange={(event) =>
                                setSearchInput(
                                    event.target.value,
                                )
                            }
                            placeholder="Search products, brands or categories..."
                            className="h-11 rounded-xl bg-background pl-10 pr-10"
                        />

                        {isFetching && !isLoading && (
                            <Loader2 className="absolute right-3.5 top-1/2 size-4 -translate-y-1/2 animate-spin text-primary" />
                        )}
                    </div>

                    <div className="relative">
                        <select
                            value={category}
                            onChange={(event) =>
                                handleCategory(
                                    event.target
                                        .value as CategoryFilter,
                                )
                            }
                            aria-label="Filter by category"
                            className="h-11 w-full appearance-none rounded-xl border bg-background px-3 pr-10 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                        >
                            {categories.map((item) => (
                                <option
                                    key={item}
                                    value={item}
                                >
                                    {categoryLabels[item]}
                                </option>
                            ))}
                        </select>

                        <SlidersHorizontal className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    </div>

                    <select
                        value={sort}
                        onChange={(event) =>
                            handleSort(
                                event.target
                                    .value as SortOption,
                            )
                        }
                        aria-label="Sort products"
                        className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                    >
                        <option value="newest">
                            Newest Products
                        </option>

                        <option value="price-low">
                            Price: Low to High
                        </option>

                        <option value="price-high">
                            Price: High to Low
                        </option>
                    </select>

                    {hasActiveFilters && (
                        <Button
                            type="button"
                            variant="outline"
                            className="h-11 rounded-xl"
                            onClick={clearFilters}
                        >
                            Clear Filters
                        </Button>
                    )}
                </div>
            </div>

            {!isLoading && data && (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-muted-foreground">
                        Showing{" "}
                        <span className="font-semibold text-foreground">
                            {data.products.length}
                        </span>{" "}
                        products
                    </p>

                    {isFetching && (
                        <p className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Loader2 className="size-3.5 animate-spin" />
                            Updating results...
                        </p>
                    )}
                </div>
            )}

            {isLoading ? (
                <ProductGridSkeleton />
            ) : !data?.products.length ? (
                <div className="rounded-[28px] border bg-card px-6 py-16 text-center shadow-sm">
                    <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-muted">
                        <PackageSearch className="size-9 text-muted-foreground" />
                    </div>

                    <h2 className="mt-5 text-xl font-semibold">
                        No products found
                    </h2>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                        We could not find any products
                        matching your current search and
                        filters.
                    </p>

                    {hasActiveFilters && (
                        <Button
                            type="button"
                            variant="outline"
                            className="mt-6 rounded-xl"
                            onClick={clearFilters}
                        >
                            Clear All Filters
                        </Button>
                    )}
                </div>
            ) : (
                <>
                    <div
                        className={cn(
                            "grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
                            isFetching &&
                            "pointer-events-none opacity-70",
                        )}
                    >
                        {data.products.map(
                            (currentProduct) => (
                                <PublicProductCard
                                    key={
                                        currentProduct.id
                                    }
                                    product={
                                        currentProduct
                                    }
                                />
                            ),
                        )}
                    </div>

                    {data.pagination.totalPages > 1 && (
                        <Pagination
                            page={
                                data.pagination.page
                            }
                            totalPages={
                                data.pagination
                                    .totalPages
                            }
                            onPageChange={setPage}
                        />
                    )}
                </>
            )}
        </section>
    );
}

function PublicProductCard({
    product,
}: {
    product: WishlistProduct;
}) {
    const [wishlisted, setWishlisted] =
        useState(Boolean(product.isWishlisted));

    const [wishlistLoading, setWishlistLoading] =
        useState(false);

    const originalPrice = Number(product.price);
    const salePrice =
        product.salePrice !== null &&
            product.salePrice !== undefined
            ? Number(product.salePrice)
            : null;

    const hasDiscount =
        salePrice !== null &&
        salePrice > 0 &&
        salePrice < originalPrice;

    const displayPrice = hasDiscount
        ? salePrice
        : originalPrice;

    const discount = hasDiscount
        ? Math.round(
            ((originalPrice - salePrice) /
                originalPrice) *
            100,
        )
        : 0;

    async function handleWishlist() {
        if (wishlistLoading) return;

        const previousValue = wishlisted;

        setWishlisted(!previousValue);
        setWishlistLoading(true);

        try {
            const result = await toggleWishlist(
                product.id,
            );

            if (!result.success) {
                setWishlisted(previousValue);

                if (
                    result.message === "Unauthorized"
                ) {
                    toast.error(
                        "Please login to use your wishlist",
                    );

                    return;
                }

                throw new Error(
                    result.message ||
                    "Unable to update wishlist",
                );
            }

            const added =
                result.action === "added";

            setWishlisted(added);

            toast.success(
                added
                    ? "Added to wishlist"
                    : "Removed from wishlist",
            );
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
        <article className="group flex h-full flex-col overflow-hidden rounded-[22px] border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl hover:shadow-black/5">
            <div className="relative overflow-hidden bg-muted/30">
                <Link
                    href={`/products/${product.slug}`}
                    className="relative block aspect-square"
                >
                    {product.image ? (
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                            className="object-contain p-5 transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <div className="text-center">
                                <PackageOpen className="mx-auto size-12 text-muted-foreground/35" />

                                <p className="mt-2 text-xs text-muted-foreground">
                                    No image available
                                </p>
                            </div>
                        </div>
                    )}
                </Link>

                {hasDiscount && (
                    <span className="absolute left-3 top-3 rounded-lg bg-primary px-2.5 py-1 text-[10px] font-bold text-primary-foreground shadow-sm">
                        -{discount}%
                    </span>
                )}

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
                        "absolute right-3 top-3 z-10 flex size-10 items-center justify-center rounded-full border bg-background/95 shadow-sm backdrop-blur transition-all hover:scale-105 hover:bg-background disabled:cursor-not-allowed",
                        wishlisted &&
                        "border-red-200 bg-red-50 text-red-500 dark:border-red-500/30 dark:bg-red-500/10",
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

                <span
                    className={cn(
                        "absolute bottom-3 left-3 rounded-lg px-2.5 py-1 text-[10px] font-semibold shadow-sm backdrop-blur",
                        product.stock > 0
                            ? "bg-emerald-500/90 text-white"
                            : "bg-destructive/90 text-destructive-foreground",
                    )}
                >
                    {product.stock > 0
                        ? "In Stock"
                        : "Out of Stock"}
                </span>
            </div>

            <div className="flex flex-1 flex-col p-4 sm:p-5">
                <Link
                    href={`/stores/${product.storeSlug}`}
                    className="flex w-fit max-w-full items-center gap-1.5 text-xs font-medium text-primary transition-colors hover:text-primary/80"
                >
                    <Store className="size-3.5 shrink-0" />

                    <span className="truncate">
                        {product.storeName}
                    </span>
                </Link>

                <Link
                    href={`/products/${product.slug}`}
                    className="mt-2"
                >
                    <h2 className="line-clamp-2 min-h-12 text-base font-semibold leading-6 transition-colors group-hover:text-primary">
                        {product.name}
                    </h2>
                </Link>

                <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    {product.category}
                </p>

                <div className="mt-auto pt-5">
                    <div className="flex flex-wrap items-end gap-x-2 gap-y-1">
                        <span className="text-xl font-bold leading-none">
                            {formatPrice(
                                displayPrice,
                            )}
                        </span>

                        {hasDiscount && (
                            <span className="text-xs text-muted-foreground line-through">
                                {formatPrice(
                                    originalPrice,
                                )}
                            </span>
                        )}
                    </div>

                    <p className="mt-2 text-xs text-muted-foreground">
                        {product.stock > 0
                            ? `${product.stock} item${product.stock === 1 ? "" : "s"} available`
                            : "Currently unavailable"}
                    </p>

                    <div className="mt-4">
                        <AddToCartButton
                            product={{
                                productId:
                                    product.id,
                                name: product.name,
                                slug: product.slug,
                                image:
                                    product.image,
                                price: displayPrice,
                                stock:
                                    product.stock,
                                storeId:
                                    product.storeId,
                                storeName:
                                    product.storeName,
                            }}
                        />
                    </div>
                </div>
            </div>
        </article>
    );
}

function Pagination({
    page,
    totalPages,
    onPageChange,
}: {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}) {
    const visiblePages = Array.from(
        { length: totalPages },
        (_, index) => index + 1,
    ).filter(
        (currentPage) =>
            currentPage === 1 ||
            currentPage === totalPages ||
            Math.abs(currentPage - page) <= 1,
    );

    return (
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-xl"
                disabled={page <= 1}
                onClick={() =>
                    onPageChange(page - 1)
                }
                aria-label="Previous page"
            >
                <ChevronLeft className="size-4" />
            </Button>

            {visiblePages.map(
                (currentPage, index) => {
                    const previousPage =
                        visiblePages[index - 1];

                    const showDots =
                        previousPage &&
                        currentPage -
                        previousPage >
                        1;

                    return (
                        <div
                            key={currentPage}
                            className="flex items-center gap-2"
                        >
                            {showDots && (
                                <span className="px-1 text-sm text-muted-foreground">
                                    ...
                                </span>
                            )}

                            <Button
                                type="button"
                                variant={
                                    currentPage ===
                                        page
                                        ? "default"
                                        : "outline"
                                }
                                size="icon"
                                className="rounded-xl"
                                onClick={() =>
                                    onPageChange(
                                        currentPage,
                                    )
                                }
                            >
                                {currentPage}
                            </Button>
                        </div>
                    );
                },
            )}

            <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-xl"
                disabled={page >= totalPages}
                onClick={() =>
                    onPageChange(page + 1)
                }
                aria-label="Next page"
            >
                <ChevronRight className="size-4" />
            </Button>
        </div>
    );
}

function ProductGridSkeleton() {
    return (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map(
                (_, index) => (
                    <div
                        key={index}
                        className="overflow-hidden rounded-[22px] border bg-card"
                    >
                        <div className="aspect-square animate-pulse bg-muted" />

                        <div className="space-y-4 p-5">
                            <div className="h-3 w-24 animate-pulse rounded bg-muted" />

                            <div className="space-y-2">
                                <div className="h-4 w-full animate-pulse rounded bg-muted" />
                                <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                            </div>

                            <div className="h-3 w-20 animate-pulse rounded bg-muted" />

                            <div className="h-6 w-32 animate-pulse rounded bg-muted" />

                            <div className="h-10 w-full animate-pulse rounded-xl bg-muted" />
                        </div>
                    </div>
                ),
            )}
        </div>
    );
}