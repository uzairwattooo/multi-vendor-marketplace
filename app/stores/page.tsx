import { count, desc, eq } from "drizzle-orm";

import Container from "@/components/common/Container";
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import StoreCard from "@/components/marketplace/StoreCard";
import { db } from "@/db";
import { product, store } from "@/db/schema";

type StoreRow = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    productCount: number;
};

export default async function StoresPage() {
    const storeRows: StoreRow[] = await db
        .select({
            id: store.id,
            name: store.name,
            slug: store.slug,
            description: store.description,
            productCount: count(product.id),
        })
        .from(store)
        .leftJoin(
            product,
            eq(product.storeId, store.id),
        )
        .where(eq(store.status, "approved"))
        .groupBy(
            store.id,
            store.name,
            store.slug,
            store.description,
        )
        .orderBy(desc(store.createdAt));

    return (
        <main className="min-h-screen">
            <Navbar />

            <section className="py-12 sm:py-16">
                <Container>
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                            Trusted Sellers
                        </p>

                        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
                            Marketplace Stores
                        </h1>

                        <p className="mt-3 text-muted-foreground">
                            Browse approved and trusted marketplace stores.
                        </p>
                    </div>

                    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {storeRows.map((currentStore) => (
                            <StoreCard
                                key={currentStore.id}
                                name={currentStore.name}
                                slug={currentStore.slug}
                                category={
                                    currentStore.description ??
                                    "Marketplace Store"
                                }
                                rating={0}
                                reviews={0}
                                products={
                                    currentStore.productCount
                                }
                                initials={currentStore.name
                                    .split(" ")
                                    .map((word) => word.charAt(0))
                                    .join("")
                                    .slice(0, 2)
                                    .toUpperCase()}
                            />
                        ))}
                    </div>
                </Container>
            </section>

            <Footer />
        </main>
    );
}