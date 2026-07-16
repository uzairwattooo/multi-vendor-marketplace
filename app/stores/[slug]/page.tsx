import Image from "next/image";
import Link from "next/link";
import { and, desc, eq, sql } from "drizzle-orm";
import { notFound } from "next/navigation";

import Container from "@/components/common/Container";
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import ProductCard from "@/components/marketplace/ProductCard";
import { db } from "@/db";
import {
    product,
    productImage,
    store,
} from "@/db/schema";

type StorePageProps = {
    params: Promise<{
        slug: string;
    }>;
};

type StoreDetails = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    logo: string | null;
    status: string;
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
            logo: store.logo,
            status: store.status,
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

    const storeDetails: StoreDetails = currentStore;

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
            salePrice: currentProduct.salePrice
                ? Number(currentProduct.salePrice)
                : null,
            stock: currentProduct.stock,
            image: currentProduct.image,
        }),
    );

    return (
        <main className="min-h-screen">
            <Navbar />

            <section className="border-b bg-card py-12 sm:py-16">
                <Container>
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                        <div className="relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-muted">
                            {storeDetails.logo ? (
                                <Image
                                    src={storeDetails.logo}
                                    alt={storeDetails.name}
                                    fill
                                    sizes="96px"
                                    className="object-cover"
                                />
                            ) : (
                                <span className="text-3xl font-bold text-primary">
                                    {storeDetails.name
                                        .split(" ")
                                        .map((word) => word.charAt(0))
                                        .join("")
                                        .slice(0, 2)
                                        .toUpperCase()}
                                </span>
                            )}
                        </div>

                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                                Approved Store
                            </p>

                            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
                                {storeDetails.name}
                            </h1>

                            <p className="mt-3 max-w-2xl text-muted-foreground">
                                {storeDetails.description ||
                                    "Explore products from this marketplace store."}
                            </p>
                        </div>
                    </div>
                </Container>
            </section>

            <section className="py-12 sm:py-16">
                <Container>
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                                Store Products
                            </p>

                            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                                Products by {storeDetails.name}
                            </h2>
                        </div>

                        <Link
                            href="/stores"
                            className="text-sm font-semibold text-primary"
                        >
                            Back to Stores
                        </Link>
                    </div>

                    {storeProducts.length === 0 ? (
                        <div className="mt-10 rounded-2xl border bg-card p-12 text-center">
                            <h3 className="text-lg font-semibold">
                                No products available
                            </h3>

                            <p className="mt-2 text-sm text-muted-foreground">
                                This store has not published any active products yet.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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