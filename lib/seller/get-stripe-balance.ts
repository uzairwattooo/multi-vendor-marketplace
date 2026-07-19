import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { store } from "@/db/schema";
import { stripe } from "@/lib/stripe";

export async function getStripeBalance(
    userId: string,
) {
    const [sellerStore] = await db
        .select({
            stripeAccountId:
                store.stripeAccountId,
        })
        .from(store)
        .where(
            and(
                eq(store.ownerId, userId),
                eq(store.status, "approved"),
            ),
        )
        .limit(1);

    if (
        !sellerStore?.stripeAccountId
    ) {
        return {
            available: 0,
            pending: 0,
        };
    }

    const balance = await stripe.balance.retrieve(
        {},
        {
            stripeAccount: sellerStore.stripeAccountId,
        },
    );

    return {
        available:
            (balance.available[0]?.amount ?? 0) /
            100,

        pending:
            (balance.pending[0]?.amount ?? 0) /
            100,
    };
}