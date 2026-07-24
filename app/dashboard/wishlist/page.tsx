import Image from "next/image";
import Link from "next/link";
import {
    ArrowRight,
    Heart,
    PackageOpen,
    ShoppingBag,
    Sparkles,
} from "lucide-react";

import RemoveWishlistButton from "@/components/marketplace/RemoveWishlistButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getUserWishlist } from "@/lib/wishlist/get-user-wishlist";

export const dynamic = "force-dynamic";

function formatPrice(value: number) {
    return new Intl.NumberFormat("en-PK", {
        maximumFractionDigits: 0,
    }).format(value);
}

export default async function WishlistPage() {
    const wishlist = await getUserWishlist();

    return (
        <main className="min-h-screen bg-[#f8fafc]">
            <div className="mx-auto w-full max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
                {/* Hero Section */}
                <section className="relative overflow-hidden rounded-[28px] border bg-white px-6 py-8 shadow-sm sm:px-8 sm:py-10 lg:px-12">
                    <div className="absolute -right-24 -top-24 size-64 rounded-full bg-primary/10 blur-3xl" />
                    <div className="absolute -bottom-28 left-1/3 size-56 rounded-full bg-violet-100/70 blur-3xl" />

                    <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary sm:size-16">
                                <Heart className="size-7 fill-current sm:size-8" />
                            </div>

                            <div>
                                <div className="mb-2 flex items-center gap-2">
                                    <Badge
                                        variant="outline"
                                        className="rounded-full border-primary/20 bg-primary/5 px-3 py-1 text-primary"
                                    >
                                        <Sparkles className="mr-1.5 size-3.5" />
                                        Your favourites
                                    </Badge>
                                </div>

                                <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                                    My Wishlist
                                </h1>

                                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                                    Keep track of the products you love and
                                    purchase them whenever you&apos;re ready.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 rounded-2xl border bg-slate-50/80 px-5 py-4">
                            <div className="flex size-11 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm">
                                <ShoppingBag className="size-5" />
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                    Saved products
                                </p>

                                <p className="mt-0.5 text-2xl font-bold text-slate-950">
                                    {wishlist.length}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Products Section */}
                {wishlist.length > 0 ? (
                    <section className="mt-8">
                        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                                    Saved collection
                                </p>

                                <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
                                    Products you&apos;ve saved
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Review your favourite products and continue
                                    shopping.
                                </p>
                            </div>

                            <Button
                                nativeButton={false}
                                variant="outline"
                                className="w-fit rounded-xl bg-white"
                                render={<Link href="/products" />}
                            >
                                Browse more products
                                <ArrowRight className="ml-2 size-4" />
                            </Button>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {wishlist.map((item) => {
                                const regularPrice = Number(item.price);

                                const rawSalePrice =
                                    item.salePrice !== null &&
                                        item.salePrice !== undefined
                                        ? Number(item.salePrice)
                                        : null;

                                const hasSale =
                                    rawSalePrice !== null &&
                                    rawSalePrice > 0 &&
                                    rawSalePrice < regularPrice;

                                const finalPrice = hasSale
                                    ? rawSalePrice
                                    : regularPrice;

                                const discountPercentage = hasSale
                                    ? Math.round(
                                        ((regularPrice - rawSalePrice) /
                                            regularPrice) *
                                        100,
                                    )
                                    : 0;

                                return (
                                    <article
                                        key={item.id}
                                        className="group relative flex h-full flex-col overflow-hidden rounded-[22px] border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_18px_45px_rgba(15,23,42,0.10)]"
                                    >
                                        {/* Product Image */}
                                        <div className="relative overflow-hidden bg-slate-50">
                                            <Link
                                                href={`/products/${item.slug}`}
                                                className="block"
                                            >
                                                <div className="relative aspect-[4/4.2]">
                                                    <Image
                                                        src={
                                                            item.image ||
                                                            "/placeholder.png"
                                                        }
                                                        alt={item.name}
                                                        fill
                                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                                        className="object-contain p-5 transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                </div>
                                            </Link>

                                            {/* Badges */}
                                            <div className="absolute left-3 top-3 flex flex-col gap-2">
                                                {hasSale && (
                                                    <Badge className="rounded-full border-0 bg-red-500 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm hover:bg-red-500">
                                                        -{discountPercentage}%
                                                    </Badge>
                                                )}

                                                <Badge
                                                    variant="secondary"
                                                    className="w-fit rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-slate-700 shadow-sm backdrop-blur"
                                                >
                                                    <Heart className="mr-1 size-3 fill-rose-500 text-rose-500" />
                                                    Saved
                                                </Badge>
                                            </div>

                                            {/* Quick View Overlay */}
                                            <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                                <Button
                                                    nativeButton={false}
                                                    className="w-full rounded-xl bg-slate-950 text-white shadow-lg hover:bg-slate-800"
                                                    render={
                                                        <Link
                                                            href={`/products/${item.slug}`}
                                                        />
                                                    }
                                                >
                                                    View product
                                                    <ArrowRight className="ml-2 size-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Product Content */}
                                        <div className="flex flex-1 flex-col p-5">
                                            <Link
                                                href={`/products/${item.slug}`}
                                                className="group/title"
                                            >
                                                <h3 className="line-clamp-2 min-h-12 text-base font-semibold leading-6 text-slate-900 transition-colors group-hover/title:text-primary">
                                                    {item.name}
                                                </h3>
                                            </Link>

                                            <div className="mt-3 flex flex-wrap items-end gap-x-2 gap-y-1">
                                                <p className="text-xl font-bold tracking-tight text-slate-950">
                                                    Rs.{" "}
                                                    {formatPrice(finalPrice)}
                                                </p>

                                                {hasSale && (
                                                    <p className="pb-0.5 text-sm text-slate-400 line-through">
                                                        Rs.{" "}
                                                        {formatPrice(
                                                            regularPrice,
                                                        )}
                                                    </p>
                                                )}
                                            </div>

                                            {hasSale && (
                                                <p className="mt-1 text-xs font-medium text-emerald-600">
                                                    You save Rs.{" "}
                                                    {formatPrice(
                                                        regularPrice -
                                                        finalPrice,
                                                    )}
                                                </p>
                                            )}

                                            <div className="mt-auto pt-5">
                                                <div className="flex gap-2">
                                                    <Button
                                                        nativeButton={false}
                                                        className="h-8 flex-1 rounded-xl"
                                                        render={
                                                            <Link
                                                                href={`/products/${item.slug}`}
                                                            />
                                                        }
                                                    >
                                                        <ShoppingBag className="mr-2 size-4" />
                                                        Buy Now
                                                    </Button>

                                                    <RemoveWishlistButton
                                                        productId={item.id}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </section>
                ) : (
                    /* Empty State */
                    <section className="mt-8 overflow-hidden rounded-[28px] border bg-white shadow-sm">
                        <div className="relative flex min-h-[480px] flex-col items-center justify-center px-6 py-16 text-center">
                            <div className="absolute left-1/2 top-1/2 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />

                            <div className="relative">
                                <div className="mx-auto flex size-24 items-center justify-center rounded-[28px] border border-primary/15 bg-primary/10 text-primary shadow-sm">
                                    <PackageOpen className="size-11" />
                                </div>

                                <Badge
                                    variant="outline"
                                    className="mt-6 rounded-full border-slate-200 px-3 py-1 text-slate-500"
                                >
                                    No saved products
                                </Badge>

                                <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                                    Your wishlist is empty
                                </h2>

                                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
                                    Explore our marketplace and save the
                                    products you love. They&apos;ll appear here
                                    for easy access later.
                                </p>

                                <Button
                                    nativeButton={false}
                                    size="lg"
                                    className="mt-7 rounded-xl px-6"
                                    render={<Link href="/products" />}
                                >
                                    Explore products
                                    <ArrowRight className="ml-2 size-4" />
                                </Button>
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}