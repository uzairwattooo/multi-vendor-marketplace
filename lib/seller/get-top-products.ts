import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { orderItem, product, store } from "@/db/schema";

export async function getTopProducts(userId: string) {
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
            sold: sql<number>`COALESCE(SUM(${orderItem.quantity}),0)`,
            revenue: sql<number>`COALESCE(SUM(${orderItem.totalPrice}),0)`,
        })
        .from(orderItem)
        .innerJoin(
            product,
            eq(orderItem.productId, product.id),
        )
        .where(eq(product.storeId, sellerStore.id))
        .groupBy(product.id, product.name)
        .orderBy(
            desc(sql`SUM(${orderItem.quantity})`)
        )
        .limit(5);
}