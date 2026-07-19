import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { store } from "@/db/schema";

export async function getStripeStatus(userId: string) {
    const [sellerStore] = await db
        .select({
            connected: store.isStripeConnected,
            chargesEnabled: store.stripeChargesEnabled,
            payoutsEnabled: store.stripePayoutsEnabled,
            detailsSubmitted: store.stripeDetailsSubmitted,
            stripeAccountId: store.stripeAccountId,
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
        return {
            connected: false,
            chargesEnabled: false,
            payoutsEnabled: false,
            detailsSubmitted: false,
            stripeAccountId: null,
        };
    }

    return sellerStore;
}