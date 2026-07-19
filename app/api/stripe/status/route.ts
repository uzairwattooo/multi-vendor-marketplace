import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { db } from "@/db";
import { store } from "@/db/schema";

export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const [sellerStore] = await db
            .select()
            .from(store)
            .where(eq(store.ownerId, session.user.id))
            .limit(1);

        if (!sellerStore) {
            return NextResponse.json(
                { message: "Store not found" },
                { status: 404 }
            );
        }

        if (!sellerStore.stripeAccountId) {
            return NextResponse.json({
                connected: false,
                message: "Stripe account not connected.",
            });
        }

        const account = await stripe.accounts.retrieve(
            sellerStore.stripeAccountId
        );

        await db
            .update(store)
            .set({
                isStripeConnected:
                    account.details_submitted &&
                    account.charges_enabled &&
                    account.payouts_enabled,
                stripeChargesEnabled: account.charges_enabled,
                stripePayoutsEnabled: account.payouts_enabled,
                stripeDetailsSubmitted: account.details_submitted,
            })
            .where(eq(store.id, sellerStore.id));

        return NextResponse.json({
            connected: true,
            accountId: account.id,
            chargesEnabled: account.charges_enabled,
            payoutsEnabled: account.payouts_enabled,
            detailsSubmitted: account.details_submitted,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                message: "Unable to fetch Stripe status.",
            },
            {
                status: 500,
            }
        );
    }
}