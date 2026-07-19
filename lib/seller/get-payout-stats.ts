import { and, count, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { order, store } from "@/db/schema";

export async function getPayoutStats(userId: string) {
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
        return null;
    }

    const [stats] = await db
        .select({
            revenue:
                sql<number>`COALESCE(SUM(${order.totalAmount}),0)`,

            orders: count(order.id),
        })
        .from(order)
        .where(eq(order.storeId, sellerStore.id));

    return {
        available: Number(stats.revenue),
        pending: 0,
        totalPaid: Number(stats.revenue),
        lifetime: Number(stats.revenue),
        orders: stats.orders,
    };
}