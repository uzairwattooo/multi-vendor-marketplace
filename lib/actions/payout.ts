"use server";

import { and, desc, eq } from "drizzle-orm";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { order, payment, store } from "@/db/schema";
import { user } from "@/auth-schema";

export async function getPendingPayoutOrders() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return [];
    }

    return await db
        .select({
            id: order.id,
            orderNumber: order.orderNumber,
            customer: user.name,
            amount: payment.sellerAmount,
            status: payment.sellerPayoutStatus,
            expected: payment.sellerPaidAt,
            createdAt: order.createdAt,
        })
        .from(order)
        .innerJoin(
            payment,
            eq(payment.orderId, order.id),
        )
        .innerJoin(
            store,
            eq(store.id, order.storeId),
        )
        .innerJoin(
            user,
            eq(user.id, order.buyerId),
        )
        .where(
            and(
                eq(store.ownerId, session.user.id),
                eq(payment.status, "paid"),
                eq(payment.sellerPayoutStatus, "pending"),
            ),
        )
        .orderBy(desc(order.createdAt));
}