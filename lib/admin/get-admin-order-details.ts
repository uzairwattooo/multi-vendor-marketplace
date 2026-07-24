import { asc, eq } from "drizzle-orm";

import { user } from "@/auth-schema";
import { db } from "@/db";
import {
    order,
    orderItem,
    payment,
    shippingAddress,
    store,
} from "@/db/schema";

export async function getAdminOrderDetails(orderId: string) {
    const [summary] = await db
        .select({
            id: order.id,
            orderNumber: order.orderNumber,
            status: order.status,
            paymentStatus: order.paymentStatus,
            paymentMethod: order.paymentMethod,
            stripePaymentIntentId: order.stripePaymentIntentId,
            currency: order.currency,
            subtotal: order.subtotal,
            shippingAmount: order.shippingAmount,
            taxAmount: order.taxAmount,
            discountAmount: order.discountAmount,
            totalAmount: order.totalAmount,
            customerNote: order.customerNote,
            cancelledReason: order.cancelledReason,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            buyerId: user.id,
            buyerName: user.name,
            buyerEmail: user.email,
            buyerPhone: user.phone,
            storeId: store.id,
            storeName: store.name,
            storeEmail: store.email,
            storePhone: store.phone,
            storeStatus: store.status,
            ownerId: store.ownerId,
            platformFee: payment.platformFee,
            sellerAmount: payment.sellerAmount,
            paymentTransactionId: payment.transactionId,
            paymentPaidAt: payment.paidAt,
            payoutStatus: payment.sellerPayoutStatus,
        })
        .from(order)
        .innerJoin(user, eq(user.id, order.buyerId))
        .innerJoin(store, eq(store.id, order.storeId))
        .leftJoin(payment, eq(payment.orderId, order.id))
        .where(eq(order.id, orderId))
        .limit(1);

    if (!summary) return null;

    const [items, addresses] = await Promise.all([
        db
            .select()
            .from(orderItem)
            .where(eq(orderItem.orderId, orderId))
            .orderBy(asc(orderItem.createdAt)),
        db
            .select()
            .from(shippingAddress)
            .where(eq(shippingAddress.orderId, orderId))
            .limit(1),
    ]);

    return {
        ...summary,
        subtotal: Number(summary.subtotal),
        shippingAmount: Number(summary.shippingAmount),
        taxAmount: Number(summary.taxAmount),
        discountAmount: Number(summary.discountAmount),
        totalAmount: Number(summary.totalAmount),
        platformFee:
            summary.platformFee === null ? null : Number(summary.platformFee),
        sellerAmount:
            summary.sellerAmount === null ? null : Number(summary.sellerAmount),
        items: items.map((item) => ({
            ...item,
            unitPrice: Number(item.unitPrice),
            totalPrice: Number(item.totalPrice),
        })),
        shippingAddress: addresses[0] ?? null,
    };
}

export type AdminOrderDetails = NonNullable<
    Awaited<ReturnType<typeof getAdminOrderDetails>>
>;
