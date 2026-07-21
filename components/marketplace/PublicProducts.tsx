"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    Loader2,
    PackageSearch,
    Search,
} from "lucide-react";
import {
    getPublicProducts,
    type PublicProduct,
    type ProductsResponse,
} from "@/services/public-product-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const categories: CategoryFilter[] = [
    "all",
    "electronics",
    "fashion",
    "home-living",
    "audio",
    "sports",
    "kids",
];

export default function PublicProducts() {
    const [search, setSearch] = useState<string>("");
    const [category, setCategory] =
        useState<CategoryFilter>("all");
    const [sort, setSort] =
        useState<SortOption>("newest");
    const [page, setPage] = useState<number>(1);

    const {
        data,
        isLoading,
        isError,
        error,
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

        placeholderData: (previousData) => previousData,
    });

    function handleSearch(value: string): void {
        setSearch(value);
        setPage(1);
    }

    function handleCategory(value: CategoryFilter): void {
        setCategory(value);
        setPage(1);
    }

    function handleSort(value: SortOption): void {
        setSort(value);
        setPage(1);
    }
    if (isError) {
        return (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-destructive">
                {error instanceof Error
                    ? error.message
                    : "Unable to load products"}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                    Marketplace
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                    Explore Products
                </h1>

                <p className="mt-2 text-muted-foreground">
                    Discover products from approved marketplace stores.
                </p>
            </div>

            <div className="grid gap-4 rounded-2xl border bg-card p-4 shadow-sm md:grid-cols-[1fr_220px_220px]">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                        value={search}
                        onChange={(event) =>
                            handleSearch(event.target.value)
                        }
                        placeholder="Search products..."
                        className="pl-9"
                    />
                </div>

                <select
                    value={category}
                    onChange={(event) =>
                        handleCategory(
                            event.target.value as CategoryFilter,
                        )
                    }
                    className="h-10 rounded-md border bg-background px-3 text-sm outline-none"
                >
                    {categories.map((item) => (
                        <option key={item} value={item}>
                            {item === "all"
                                ? "All Categories"
                                : item
                                    .replaceAll("-", " ")
                                    .replace(/\b\w/g, (letter) =>
                                        letter.toUpperCase(),
                                    )}
                        </option>
                    ))}
                </select>

                <select
                    value={sort}
                    onChange={(event) =>
                        handleSort(
                            event.target.value as SortOption,
                        )
                    }
                    className="h-10 rounded-md border bg-background px-3 text-sm outline-none"
                >
                    <option value="newest">Newest</option>
                    <option value="price-low">
                        Price: Low to High
                    </option>
                    <option value="price-high">
                        Price: High to Low
                    </option>
                </select>
            </div>

            {isLoading ? (
                <div className="flex min-h-72 items-center justify-center">
                    <Loader2 className="size-8 animate-spin text-primary" />
                </div>
            ) : !data?.products.length ? (
                <div className="rounded-2xl border bg-card p-14 text-center">
                    <PackageSearch className="mx-auto size-12 text-muted-foreground" />

                    <h2 className="mt-4 text-lg font-semibold">
                        No products found
                    </h2>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Try changing your search or filters.
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {data.products.map((currentProduct) => (
                            <PublicProductCard
                                key={currentProduct.id}
                                product={currentProduct}
                            />
                        ))}
                    </div>

                    <div className="flex items-center justify-center gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={page <= 1}
                            onClick={() =>
                                setPage((current) =>
                                    Math.max(current - 1, 1),
                                )
                            }
                        >
                            Previous
                        </Button>

                        <span className="text-sm text-muted-foreground">
                            Page {data.pagination.page} of{" "}
                            {Math.max(
                                data.pagination.totalPages,
                                1,
                            )}
                        </span>

                        <Button
                            type="button"
                            variant="outline"
                            disabled={
                                page >=
                                data.pagination.totalPages
                            }
                            onClick={() =>
                                setPage((current) => current + 1)
                            }
                        >
                            Next
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}

function PublicProductCard({
    product,
}: {
    product: PublicProduct;
}) {
    const displayPrice =
        product.salePrice ?? product.price;

    return (
        <article className="group overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <Link href={`/products/${product.slug}`}>
                <div className="relative aspect-square overflow-hidden bg-muted">
                    {product.image ? (
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover transition duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                            No image available
                        </div>
                    )}
                </div>
            </Link>

            <div className="p-5">
                <Link
                    href={`/stores/${product.storeSlug}`}
                    className="text-xs font-medium text-primary"
                >
                    {product.storeName}
                </Link>

                <Link href={`/products/${product.slug}`}>
                    <h2 className="mt-2 line-clamp-2 font-semibold transition hover:text-primary">
                        {product.name}
                    </h2>
                </Link>

                <p className="mt-2 text-xs text-muted-foreground">
                    {product.category}
                </p>

                <div className="mt-4 flex items-center gap-2">
                    <span className="text-lg font-bold">
                        Rs. {Number(displayPrice).toLocaleString()}
                    </span>

                    {product.salePrice && (
                        <span className="text-sm text-muted-foreground line-through">
                            Rs.{" "}
                            {Number(
                                product.price,
                            ).toLocaleString()}
                        </span>
                    )}
                </div>

                <p className="mt-2 text-xs text-muted-foreground">
                    {product.stock > 0
                        ? `${product.stock} available`
                        : "Out of stock"}
                </p>

                <AddToCartButton
                    product={{
                        productId: product.id,
                        name: product.name,
                        slug: product.slug,
                        image: product.image,
                        price: Number(product.salePrice ?? product.price),
                        stock: product.stock,
                        storeId: product.storeId,
                        storeName: product.storeName,
                    }}
                />
            </div>
        </article>
    );
}