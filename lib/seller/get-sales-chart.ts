import { and, eq, gte, sql } from "drizzle-orm";
import { db } from "@/db";
import { order, store } from "@/db/schema";

export async function getSalesChart(userId: string) {
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

    if (!sellerStore) return [];

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 11);
    startDate.setDate(1);

    const rows = await db
        .select({
            month: sql<string>`
                TO_CHAR(
                    DATE_TRUNC('month', ${order.createdAt}),
                    'Mon'
                )
            `,
            revenue: sql<number>`
                COALESCE(SUM(${order.totalAmount}),0)
            `,
        })
        .from(order)
        .where(
            and(
                eq(order.storeId, sellerStore.id),
                gte(order.createdAt, startDate),
            ),
        )
        .groupBy(sql`DATE_TRUNC('month', ${order.createdAt})`)
        .orderBy(sql`DATE_TRUNC('month', ${order.createdAt})`);

    return rows;
}