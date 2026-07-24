import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/db";
import { order, orderItem, payment, product } from "@/db/schema";
import { requireAdminApi } from "@/lib/admin/admin-api";
import { stripe } from "@/lib/stripe";

const schema = z.discriminatedUnion("action", [
    z.object({
        action: z.literal("set_status"),
        status: z.enum(["pending", "confirmed", "processing", "shipped", "delivered"]),
    }),
    z.object({ action: z.literal("cancel"), reason: z.string().trim().min(3).max(500) }),
    z.object({ action: z.literal("refund"), reason: z.string().trim().min(3).max(500) }),
]);

type Context = { params: Promise<{ orderId: string }> };

export async function PATCH(request: Request, context: Context) {
    try {
        const authorization = await requireAdminApi(request);
        if (authorization.response) return authorization.response;

        const { orderId } = await context.params;
        const parsed = schema.safeParse(await request.json());
        if (!parsed.success) {
            return NextResponse.json({ message: "Invalid order management request", errors: parsed.error.flatten().fieldErrors }, { status: 400 });
        }

        const [existing] = await db
            .select({
                id: order.id,
                status: order.status,
                paymentMethod: order.paymentMethod,
                paymentStatus: order.paymentStatus,
                paymentIntentId: order.stripePaymentIntentId,
                transactionId: payment.transactionId,
            })
            .from(order)
            .leftJoin(payment, eq(payment.orderId, order.id))
            .where(eq(order.id, orderId))
            .limit(1);
        if (!existing) return NextResponse.json({ message: "Order not found" }, { status: 404 });
        if (existing.status === "refunded" || existing.status === "cancelled") {
            return NextResponse.json({ message: "Terminal orders cannot be changed" }, { status: 409 });
        }

        if (parsed.data.action === "set_status") {
            await db.transaction(async (tx) => {
                await tx.update(order).set({ status: parsed.data.status, updatedAt: new Date() }).where(eq(order.id, orderId));
                if (parsed.data.status === "delivered" && existing.paymentMethod === "cod") {
                    await tx.update(order).set({ paymentStatus: "paid" }).where(eq(order.id, orderId));
                    await tx.update(payment).set({ status: "paid", paidAt: new Date(), updatedAt: new Date() }).where(eq(payment.orderId, orderId));
                }
            });
            return NextResponse.json({ message: "Order status updated successfully" });
        }

        if (parsed.data.action === "cancel") {
            if (existing.status === "delivered") {
                return NextResponse.json({ message: "Delivered orders cannot be cancelled" }, { status: 409 });
            }
            await db.transaction(async (tx) => {
                const items = await tx
                    .select({
                        productId: orderItem.productId,
                        quantity: orderItem.quantity,
                    })
                    .from(orderItem)
                    .where(eq(orderItem.orderId, orderId));

                await tx
                    .update(order)
                    .set({
                        status: "cancelled",
                        cancelledReason: parsed.data.reason,
                        updatedAt: new Date(),
                    })
                    .where(eq(order.id, orderId));

                for (const item of items) {
                    await tx
                        .update(product)
                        .set({
                            stock: sql`${product.stock} + ${item.quantity}`,
                            updatedAt: new Date(),
                        })
                        .where(eq(product.id, item.productId));
                }
            });
            return NextResponse.json({ message: "Order cancelled successfully" });
        }

        if (existing.paymentMethod !== "stripe" || existing.paymentStatus !== "paid") {
            return NextResponse.json({ message: "Only paid Stripe orders can be refunded here" }, { status: 409 });
        }
        const paymentIntent = existing.paymentIntentId ?? existing.transactionId;
        if (!paymentIntent) {
            return NextResponse.json({ message: "Stripe Payment Intent is missing" }, { status: 409 });
        }

        await stripe.refunds.create(
            { payment_intent: paymentIntent, reason: "requested_by_customer", metadata: { orderId, adminReason: parsed.data.reason } },
            { idempotencyKey: `admin-order-refund-${orderId}` },
        );
        await db.transaction(async (tx) => {
            await tx.update(order).set({ status: "refunded", paymentStatus: "refunded", cancelledReason: parsed.data.reason, updatedAt: new Date() }).where(eq(order.id, orderId));
            await tx.update(payment).set({ status: "refunded", updatedAt: new Date() }).where(eq(payment.orderId, orderId));
        });
        return NextResponse.json({ message: "Stripe payment refunded successfully" });
    } catch (error) {
        console.error("ADMIN_ORDER_ACTION_ERROR:", error);
        return NextResponse.json({ message: "Unable to complete order action" }, { status: 500 });
    }
}
