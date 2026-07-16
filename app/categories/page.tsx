
import { asc, count, eq } from "drizzle-orm";

import CategoryCard from "@/components/marketplace/CategoryCard";
import Container from "@/components/common/Container";
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import { db } from "@/db";
import { category, product } from "@/db/schema";
import {
    Baby,
    Dumbbell,
    Headphones,
    Home,
    Laptop,
    Package,
    Shirt,
    type LucideIcon,
} from "lucide-react";

const categoryIconMap: Record<string, LucideIcon> = {
    electronics: Laptop,
    fashion: Shirt,
    "home-living": Home,
    audio: Headphones,
    sports: Dumbbell,
    kids: Baby,
};

type CategoryRow = {
    id: string;
    name: string;
    slug: string;
    productCount: number;
};

export default async function CategoriesPage() {
    const categoryRows: CategoryRow[] = await db
        .select({
            id: category.id,
            name: category.name,
            slug: category.slug,
            productCount: count(product.id),
        })
        .from(category)
        .leftJoin(
            product,
            eq(product.category, category.name),
        )
        .groupBy(
            category.id,
            category.name,
            category.slug,
        )
        .orderBy(asc(category.name));

    return (
        <main className="min-h-screen">
            <Navbar />

            <section className="py-12 sm:py-16">
                <Container>
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                            Categories
                        </p>

                        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
                            Shop by Category
                        </h1>

                        <p className="mt-3 text-muted-foreground">
                            Explore products from different categories.
                        </p>
                    </div>

                    <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                        {categoryRows.map((currentCategory) => (
                            <CategoryCard
                                key={currentCategory.id}
                                name={currentCategory.name}
                                slug={currentCategory.slug}
                                productCount={
                                    currentCategory.productCount
                                }
                                icon={
                                    categoryIconMap[
                                    currentCategory.slug
                                    ] ?? Package
                                }
                            />
                        ))}
                    </div>
                </Container>
            </section>

            <Footer />
        </main>
    );
}