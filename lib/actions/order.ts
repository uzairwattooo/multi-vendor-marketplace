"use server";

import { headers } from "next/headers";
import { desc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { order } from "@/db/schema";

export async function getBuyerOrders() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new Error("Unauthorized");
    }

    const orders = await db.query.order.findMany({
        where: eq(order.buyerId, session.user.id),
        orderBy: [desc(order.createdAt)],
        columns: {
            id: true,
            orderNumber: true,
            totalAmount: true,
            status: true,
            paymentStatus: true,
            createdAt: true,
        },
    });
    return orders;
}