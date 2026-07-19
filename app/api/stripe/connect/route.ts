import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

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
                { message: "Unauthorized" },
                { status: 401 },
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
                { status: 404 },
            );
        }
        let stripeAccountId = sellerStore.stripeAccountId;
        if (!stripeAccountId) {
            const account = await stripe.accounts.create({
                type: "express",
                email: session.user.email,
                business_type: "individual",
            });

            stripeAccountId = account.id;

            await db
                .update(store)
                .set({
                    stripeAccountId,
                })
                .where(eq(store.id, sellerStore.id));
        }
        const accountLink =
            await stripe.accountLinks.create({
                account: stripeAccountId,
                refresh_url:
                    `${process.env.NEXT_PUBLIC_APP_URL}/seller/settings?refresh=true`,
                return_url:
                    `${process.env.NEXT_PUBLIC_APP_URL}/seller/settings?success=true`,
                type: "account_onboarding",
            });

        return NextResponse.json({
            success: true,
            url: accountLink.url,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: "Unable to connect Stripe.",
            },
            { status: 500 },
        );
    }
}