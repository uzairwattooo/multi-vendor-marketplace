"use server";

import { headers } from "next/headers";
import { and, desc, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { payment, order, store } from "@/db/schema";

export async function getPayoutHistory() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return [];
    }

    return await db
        .select({
            id: payment.id,
            stripeId: payment.transactionId,
            amount: payment.sellerAmount,
            method: payment.provider,
            status: payment.sellerPayoutStatus,
            date: payment.sellerPaidAt,
        })
        .from(payment)
        .innerJoin(
            order,
            eq(order.id, payment.orderId),
        )
        .innerJoin(
            store,
            eq(store.id, order.storeId),
        )
        .where(
            and(
                eq(store.ownerId, session.user.id),
                eq(payment.sellerPayoutStatus, "paid"),
            ),
        )
        .orderBy(desc(payment.sellerPaidAt));
}