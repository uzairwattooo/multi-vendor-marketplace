import { asc } from "drizzle-orm";

import ProductForm from "@/components/seller/ProductForm";
import { category } from "@/db/schema";
import { db } from "@/db";

export default async function NewProductPage() {
    const categories = await db
        .select({
            id: category.id,
            name: category.name,
        })
        .from(category)
        .orderBy(asc(category.name));

    return (
        <main className="min-h-screen bg-muted/30 p-4 sm:p-8">
            <div className="mx-auto max-w-5xl">
                <div className="mb-8">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                        Product Management
                    </p>

                    <h1 className="mt-2 text-3xl font-bold">
                        Add New Product
                    </h1>

                    <p className="mt-2 text-muted-foreground">
                        Add product details, pricing and stock
                        information.
                    </p>
                </div>

                <ProductForm categories={categories} />
            </div>
        </main>
    );
}