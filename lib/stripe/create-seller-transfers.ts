import { db } from "@/db";
import { order, store, } from "@/db/schema";
import { eq } from "drizzle-orm";
import { stripe } from "@/lib/stripe";

export async function createSellerTransfers(
    userId: string
) {
    const orders =
        await db
            .select({
                orderId:
                    order.id,
                storeId:
                    order.storeId,
                stripeAccountId:
                    store.stripeAccountId,
                totalAmount:
                    order.totalAmount,
            })
            .from(order)
            .innerJoin(
                store,
                eq(
                    store.id,
                    order.storeId
                )
            )
            .where(
                eq(
                    order.buyerId,
                    userId
                )
            );
    for (const sellerOrder of orders) {
        if (!sellerOrder.stripeAccountId) {
            continue;
        }
        const totalAmount =
            Number(
                sellerOrder.totalAmount
            );
        const platformFee =
            Math.round(
                totalAmount * 0.10
            );
        const sellerAmount =
            totalAmount - platformFee;
        await stripe.transfers.create({
            amount:
                sellerAmount * 100,
            currency:
                "usd",
            destination:
                sellerOrder.stripeAccountId,
            transfer_group:
                sellerOrder.orderId,
        });
    }
}