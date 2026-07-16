import Image from "next/image";
import Link from "next/link";
import { and, eq, sql } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import {
    product,
    productImage,
    store,
} from "@/db/schema";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import Container from "@/components/common/Container";
import AddToCartButton from "@/components/marketplace/AddToCartButton";


export const dynamic = "force-dynamic";
type ProductDetailsPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export default async function ProductDetailsPage({
    params,
}: ProductDetailsPageProps) {
    const { slug } = await params;

    const [currentProduct] = await db
        .select({
            id: product.id,
            name: product.name,
            slug: product.slug,
            description: product.description,
            category: product.category,
            brand: product.brand,
            sku: product.sku,
            price: product.price,
            salePrice: product.salePrice,
            storeId: store.id,
            stock: product.stock,
            storeName: store.name,
            storeSlug: store.slug,

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
                eq(product.slug, slug),
                eq(product.status, "active"),
                eq(store.status, "approved"),
            ),
        )
        .limit(1);

    if (!currentProduct) {
        notFound();
    }

    const displayPrice =
        currentProduct.salePrice ?? currentProduct.price;

    return (
        <main className="min-h-screen">
            <Navbar />

            <section className="py-12 sm:py-16">
                <Container>
                    <div className="grid gap-10 lg:grid-cols-2">
                        <div className="relative aspect-square overflow-hidden rounded-3xl border bg-muted">
                            {currentProduct.image ? (
                                <Image
                                    src={currentProduct.image}
                                    alt={currentProduct.name}
                                    fill
                                    priority
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-muted-foreground">
                                    No image available
                                </div>
                            )}
                        </div>

                        <div>
                            <Link
                                href={`/stores/${currentProduct.storeSlug}`}
                                className="text-sm font-semibold text-primary"
                            >
                                {currentProduct.storeName}
                            </Link>

                            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                                {currentProduct.name}
                            </h1>

                            <p className="mt-3 text-sm text-muted-foreground">
                                {currentProduct.category}
                                {currentProduct.brand
                                    ? ` · ${currentProduct.brand}`
                                    : ""}
                            </p>

                            <div className="mt-6 flex items-center gap-3">
                                <span className="text-3xl font-bold">
                                    Rs.{" "}
                                    {Number(
                                        displayPrice,
                                    ).toLocaleString()}
                                </span>

                                {currentProduct.salePrice && (
                                    <span className="text-lg text-muted-foreground line-through">
                                        Rs.{" "}
                                        {Number(
                                            currentProduct.price,
                                        ).toLocaleString()}
                                    </span>
                                )}
                            </div>

                            <p className="mt-4 text-sm">
                                {currentProduct.stock > 0
                                    ? `${currentProduct.stock} items available`
                                    : "Out of stock"}
                            </p>

                            <p className="mt-6 leading-7 text-muted-foreground">
                                {currentProduct.description ||
                                    "No description available for this product."}
                            </p>

                            <div className="mt-8">
                                <AddToCartButton
                                    product={{
                                        productId: currentProduct.id,
                                        name: currentProduct.name,
                                        slug: currentProduct.slug,
                                        image: currentProduct.image,
                                        price: Number(currentProduct.salePrice ?? currentProduct.price),
                                        stock: currentProduct.stock,
                                        storeId: currentProduct.storeId,
                                        storeName: currentProduct.storeName,
                                    }}
                                />
                            </div>

                            <div className="mt-8 rounded-2xl border bg-card p-5">
                                <p className="text-sm">
                                    <span className="font-semibold">
                                        SKU:
                                    </span>{" "}
                                    {currentProduct.sku}
                                </p>

                                <p className="mt-2 text-sm">
                                    <span className="font-semibold">
                                        Seller:
                                    </span>{" "}
                                    {currentProduct.storeName}
                                </p>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            <Footer />
        </main>
    );
}