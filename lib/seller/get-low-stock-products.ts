import { and, asc, eq, lte } from "drizzle-orm";

import { db } from "@/db";
import { product, store } from "@/db/schema";

export async function getLowStockProducts(userId: string) {
    const [sellerStore] = await db
        .select({
            id: store.id,
        })
        .from(store)
        .where(
            and(
                eq(store.ownerId, userId),
                eq(store.status, "approved"),
            ),
        )
        .limit(1);

    if (!sellerStore) {
        return [];
    }

    return await db
        .select({
            id: product.id,
            name: product.name,
            sku: product.sku,
            stock: product.stock,
            threshold: product.lowStockThreshold,
        })
        .from(product)
        .where(
            and(
                eq(product.storeId, sellerStore.id),
                lte(
                    product.stock,
                    product.lowStockThreshold,
                ),
            ),
        )
        .orderBy(asc(product.stock))
        .limit(5);
}