"use server";

import { headers } from "next/headers";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { order } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function getBuyerOrderById(orderId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) {
        throw new Error("Unauthorized");
    }
    const orderData = await db.query.order.findFirst({
        where: and(
            eq(order.id, orderId),
            eq(order.buyerId, session.user.id)
        ),
        with: {
            shippingAddress: true,
            items: {
                with: {
                    product: {
                        with: {
                            images: {
                                orderBy: (images, { asc }) => [
                                    asc(images.position),
                                ],
                            },
                        },
                    },
                },
            },
        },
    });
    if (!orderData) {
        throw new Error("Order not found");
    }
    return orderData;
}

export async function deleteBuyerOrder(orderId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new Error("Unauthorized");
    }

    const existingOrder = await db.query.order.findFirst({
        where: and(
            eq(order.id, orderId),
            eq(order.buyerId, session.user.id)
        ),
    });

    if (!existingOrder) {
        throw new Error("Order not found");
    }

    if (existingOrder.status !== "pending") {
        throw new Error("Only pending orders can be deleted.");
    }

    await db.delete(order).where(eq(order.id, orderId));

    revalidatePath("/dashboard/orders");
}