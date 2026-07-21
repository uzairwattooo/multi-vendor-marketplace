"use server";

import { and, desc, eq, count } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { order, wishlist } from "@/db/schema";
import { headers } from "next/headers";

export async function getBuyerDashboard() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new Error("Unauthorized");
    }

    const buyerId = session.user.id;

    const [
        totalOrders,
        pendingOrders,
        deliveredOrders,
        recentOrders,
        [wishlistResult],
    ] = await Promise.all([
        db.$count(order, eq(order.buyerId, buyerId)),

        db.$count(
            order,
            and(
                eq(order.buyerId, buyerId),
                eq(order.status, "pending")
            )
        ),

        db.$count(
            order,
            and(
                eq(order.buyerId, buyerId),
                eq(order.status, "delivered")
            )
        ),

        db.query.order.findMany({
            where: eq(order.buyerId, buyerId),

            columns: {
                id: true,
                orderNumber: true,
                totalAmount: true,
                status: true,
                createdAt: true,
            },

            orderBy: [desc(order.createdAt)],

            limit: 5,
        }),

        db
            .select({
                total: count(),
            })
            .from(wishlist)
            .where(eq(wishlist.userId, buyerId)),
    ]);

    return {
        totalOrders,
        pendingOrders,
        deliveredOrders,
        wishlist: Number(wishlistResult.total),
        recentOrders,
    };
}