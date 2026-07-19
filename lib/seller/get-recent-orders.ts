import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import {
    order,
    payment,
    store,
    user,
} from "@/db/schema";

export async function getRecentOrders(userId: string) {
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
            id: order.id,
            orderNumber: order.orderNumber,
            customer: user.name,
            total: order.totalAmount,
            status: order.status,
            paymentStatus: order.paymentStatus,
            createdAt: order.createdAt,
        })
        .from(order)
        .innerJoin(
            user,
            eq(order.buyerId, user.id),
        )
        .where(eq(order.storeId, sellerStore.id))
        .orderBy(desc(order.createdAt))
        .limit(5);
}