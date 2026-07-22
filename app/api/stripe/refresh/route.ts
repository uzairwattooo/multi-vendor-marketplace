import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { store } from "@/db/schema";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

export async function POST() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 },
            );
        }

        const [sellerStore] = await db
            .select({
                id: store.id,
                stripeAccountId: store.stripeAccountId,
            })
            .from(store)
            .where(
                and(
                    eq(store.ownerId, session.user.id),
                    eq(store.status, "approved"),
                ),
            )
            .limit(1);

        if (!sellerStore?.stripeAccountId) {
            return NextResponse.json(
                { message: "Stripe account not connected" },
                { status: 400 },
            );
        }

        const account = await stripe.accounts.retrieve(
            sellerStore.stripeAccountId,
        );
        const connected =
            account.details_submitted &&
            account.charges_enabled &&
            account.payouts_enabled;

        await db
            .update(store)
            .set({
                isStripeConnected: connected,
                stripeChargesEnabled: account.charges_enabled,
                stripePayoutsEnabled: account.payouts_enabled,
                stripeDetailsSubmitted: account.details_submitted,
            })
            .where(eq(store.id, sellerStore.id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("STRIPE_REFRESH_ERROR:", error);

        return NextResponse.json(
            { message: "Unable to refresh Stripe status" },
            { status: 500 },
        );
    }
}
