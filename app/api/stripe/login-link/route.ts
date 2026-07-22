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

        const loginLink = await stripe.accounts.createLoginLink(
            sellerStore.stripeAccountId,
        );

        return NextResponse.json({ url: loginLink.url });
    } catch (error) {
        console.error("STRIPE_LOGIN_LINK_ERROR:", error);

        return NextResponse.json(
            { message: "Unable to open Stripe dashboard" },
            { status: 500 },
        );
    }
}
