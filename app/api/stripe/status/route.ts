import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { store } from "@/db/schema";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

export async function GET() {
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
            .where(eq(store.ownerId, session.user.id))
            .limit(1);

        if (!sellerStore) {
            return NextResponse.json(
                { message: "Store not found" },
                { status: 404 },
            );
        }

        if (!sellerStore.stripeAccountId) {
            return NextResponse.json({
                hasAccount: false,
                connected: false,
                accountId: null,
                chargesEnabled: false,
                payoutsEnabled: false,
                detailsSubmitted: false,
            });
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

        return NextResponse.json({
            hasAccount: true,
            connected,
            accountId: account.id,
            chargesEnabled: account.charges_enabled,
            payoutsEnabled: account.payouts_enabled,
            detailsSubmitted: account.details_submitted,
        });
    } catch (error) {
        console.error("STRIPE_STATUS_ERROR:", error);

        return NextResponse.json(
            { message: "Unable to fetch Stripe status" },
            { status: 500 },
        );
    }
}
