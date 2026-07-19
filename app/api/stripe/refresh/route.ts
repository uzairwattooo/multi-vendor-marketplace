import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { and, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

import { db } from "@/db";
import { store } from "@/db/schema";

export async function POST() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json(
                {
                    error: "Unauthorized",
                },
                {
                    status: 401,
                },
            );
        }

        const [sellerStore] = await db
            .select({
                id: store.id,
                stripeAccountId:
                    store.stripeAccountId,
            })
            .from(store)
            .where(
                and(
                    eq(
                        store.ownerId,
                        session.user.id,
                    ),
                    eq(
                        store.status,
                        "approved",
                    ),
                ),
            )
            .limit(1);

        if (
            !sellerStore?.stripeAccountId
        ) {
            return NextResponse.json(
                {
                    error:
                        "Stripe account not connected.",
                },
                {
                    status: 400,
                },
            );
        }

        const account =
            await stripe.accounts.retrieve(
                sellerStore.stripeAccountId,
            );

        await db
            .update(store)
            .set({
                isStripeConnected:
                    true,

                stripeChargesEnabled:
                    account.charges_enabled,

                stripePayoutsEnabled:
                    account.payouts_enabled,

                stripeDetailsSubmitted:
                    account.details_submitted,
            })
            .where(
                eq(
                    store.id,
                    sellerStore.id,
                ),
            );

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                error:
                    "Unable to refresh Stripe status.",
            },
            {
                status: 500,
            },
        );
    }
}