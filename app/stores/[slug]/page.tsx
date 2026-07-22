import Image from "next/image";
import Link from "next/link";
import { and, desc, eq, sql } from "drizzle-orm";
import { MapPin, ShieldCheck, Store as StoreIcon } from "lucide-react";
import { notFound } from "next/navigation";

import Container from "@/components/common/Container";
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import ProductCard from "@/components/marketplace/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { product, productImage, store } from "@/db/schema";

export const dynamic = "force-dynamic";

type StorePageProps = {
    params: Promise<{
        slug: string;
    }>;
};

type StoreProduct = {
    id: string;
    name: string;
    slug: string;
    storeId: string;
    storeName: string;
    price: number;
    salePrice: number | null;
    stock: number;
    image: string | null;
};

export default async function StoreDetailsPage({
    params,
}: StorePageProps) {
    const { slug } = await params;

    const [currentStore] = await db
        .select({
            id: store.id,
            name: store.name,
            slug: store.slug,
            description: store.description,
            category: store.category,
            logo: store.logo,
            banner: store.banner,
            city: store.city,
            country: store.country,
            primaryColor: store.primaryColor,
            secondaryColor: store.secondaryColor,
        })
        .from(store)
        .where(
            and(
                eq(store.slug, slug),
                eq(store.status, "approved"),
            ),
        )
        .limit(1);

    if (!currentStore) {
        notFound();
    }

    const productRows = await db
        .select({
            id: product.id,
            name: product.name,
            slug: product.slug,
            storeId: store.id,
            storeName: store.name,
            price: product.price,
            salePrice: product.salePrice,
            stock: product.stock,
            image: sql<string | null>`
                (
                    SELECT ${productImage.url}
                    FROM ${productImage}
                    WHERE ${productImage.productId} = ${product.id}
                    ORDER BY ${productImage.createdAt} ASC
                    LIMIT 1
                )
            `,
        })
        .from(product)
        .innerJoin(store, eq(product.storeId, store.id))
        .where(
            and(
                eq(product.storeId, currentStore.id),
                eq(product.status, "active"),
            ),
        )
        .orderBy(desc(product.createdAt));

    const storeProducts: StoreProduct[] = productRows.map(
        (currentProduct) => ({
            id: currentProduct.id,
            name: currentProduct.name,
            slug: currentProduct.slug,
            storeId: currentProduct.storeId,
            storeName: currentProduct.storeName,
            price: Number(currentProduct.price),
            salePrice:
                currentProduct.salePrice === null
                    ? null
                    : Number(currentProduct.salePrice),
            stock: currentProduct.stock,
            image: currentProduct.image,
        }),
    );

    const initials = currentStore.name
        .split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <main className="min-h-screen bg-muted/20">
            <Navbar />

            <section className="pb-10 sm:pb-14">
                <div
                    className="relative h-52 overflow-hidden sm:h-72 lg:h-80"
                    style={{ backgroundColor: currentStore.primaryColor }}
                >
                    {currentStore.banner && (
                        <Image
                            src={currentStore.banner}
                            alt={`${currentStore.name} banner`}
                            fill
                            priority
                            sizes="100vw"
                            className="object-cover"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
                </div>

                <Container>
                    <div className="relative -mt-16 rounded-3xl border bg-card p-5 shadow-lg sm:-mt-20 sm:p-7">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                            <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
                                <div className="relative flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-card bg-muted shadow-sm sm:size-32">
                                    {currentStore.logo ? (
                                        <Image
                                            src={currentStore.logo}
                                            alt={currentStore.name}
                                            fill
                                            sizes="128px"
                                            className="object-cover"
                                        />
                                    ) : (
                                        <span
                                            className="text-3xl font-bold"
                                            style={{ color: currentStore.primaryColor }}
                                        >
                                            {initials}
                                        </span>
                                    )}
                                </div>

                                <div className="pb-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Badge>
                                            <ShieldCheck className="size-3" />
                                            Verified seller
                                        </Badge>
                                        <Badge variant="outline">
                                            {currentStore.category}
                                        </Badge>
                                    </div>

                                    <h1
                                        className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl"
                                        style={{ color: currentStore.secondaryColor }}
                                    >
                                        {currentStore.name}
                                    </h1>

                                    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1.5">
                                            <MapPin className="size-4" />
                                            {currentStore.city}, {currentStore.country}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <StoreIcon className="size-4" />
                                            {storeProducts.length} products
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                render={<Link href="/stores" />}
                                nativeButton={false}
                            >
                                Browse all stores
                            </Button>
                        </div>

                        <p className="mt-6 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
                            {currentStore.description ||
                                "Explore products from this marketplace store."}
                        </p>
                    </div>
                </Container>
            </section>

            <section className="pb-16 sm:pb-20">
                <Container>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p
                                className="text-sm font-semibold uppercase tracking-[0.18em]"
                                style={{ color: currentStore.primaryColor }}
                            >
                                Store products
                            </p>
                            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                                Shop from {currentStore.name}
                            </h2>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {storeProducts.length} products available
                        </p>
                    </div>

                    {storeProducts.length === 0 ? (
                        <div className="mt-10 rounded-3xl border bg-card p-12 text-center shadow-sm">
                            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-muted">
                                <StoreIcon className="size-6 text-muted-foreground" />
                            </div>
                            <h3 className="mt-5 text-lg font-semibold">
                                No products available
                            </h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                This store has not published any active products yet.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {storeProducts.map((currentProduct) => (
                                <ProductCard
                                    key={currentProduct.id}
                                    id={currentProduct.id}
                                    name={currentProduct.name}
                                    slug={currentProduct.slug}
                                    storeId={currentProduct.storeId}
                                    storeName={currentProduct.storeName}
                                    price={currentProduct.price}
                                    salePrice={currentProduct.salePrice}
                                    stock={currentProduct.stock}
                                    image={currentProduct.image}
                                    rating={0}
                                    reviewCount={0}
                                    badge={
                                        currentProduct.salePrice
                                            ? "Sale"
                                            : undefined
                                    }
                                />
                            ))}
                        </div>
                    )}
                </Container>
            </section>

            <Footer />
        </main>
    );
}
