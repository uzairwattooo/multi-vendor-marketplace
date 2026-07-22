import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { store } from "@/db/schema";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
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
                email: store.email,
                businessType: store.businessType,
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

        if (!sellerStore) {
            return NextResponse.json(
                { message: "Approved store not found" },
                { status: 403 },
            );
        }

        let stripeAccountId = sellerStore.stripeAccountId;

        if (!stripeAccountId) {
            const account = await stripe.accounts.create({
                type: "express",
                email: sellerStore.email || session.user.email,
                business_type:
                    sellerStore.businessType === "company"
                        ? "company"
                        : "individual",
                metadata: {
                    storeId: sellerStore.id,
                    ownerId: session.user.id,
                },
            });

            stripeAccountId = account.id;

            await db
                .update(store)
                .set({ stripeAccountId })
                .where(eq(store.id, sellerStore.id));
        }

        const origin = new URL(request.url).origin;
        const accountLink = await stripe.accountLinks.create({
            account: stripeAccountId,
            refresh_url: `${origin}/seller/settings?stripe=refresh`,
            return_url: `${origin}/seller/settings?stripe=success`,
            type: "account_onboarding",
        });

        return NextResponse.json({
            success: true,
            url: accountLink.url,
        });
    } catch (error) {
        console.error("STRIPE_CONNECT_ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Unable to connect Stripe",
            },
            { status: 500 },
        );
    }
}
