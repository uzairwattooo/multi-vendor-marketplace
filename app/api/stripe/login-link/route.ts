import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { db } from "@/db";
import { store } from "@/db/schema";

export async function POST() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 },
        );
    }

    const [sellerStore] = await db
        .select({
            stripeAccountId:
                store.stripeAccountId,
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
            {
                error:
                    "Stripe account not connected.",
            },
            { status: 400 },
        );
    }

    const loginLink =
        await stripe.accounts.createLoginLink(
            sellerStore.stripeAccountId,
        );

    return NextResponse.json({
        url: loginLink.url,
    });
}