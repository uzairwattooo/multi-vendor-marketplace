import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { db } from "@/db";
import { checkoutSession, cart, cartItem } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createOrder } from "@/lib/order/create-order";
import type { ShippingFormValues } from "@/lib/validations/shipping-schema";

export async function POST(
    req: Request,
) {
    const body = await req.text();
    const signature = (await headers()).get("stripe-signature",);
    if (!signature) {
        return NextResponse.json(
            {
                message:
                    "Missing signature",
            },
            {
                status: 400,
            },
        );
    }
    let event: Stripe.Event;
    try {
        event =
            stripe.webhooks.constructEvent(
                body,
                signature,
                process.env
                    .STRIPE_WEBHOOK_SECRET!,
            );
    } catch {
        return NextResponse.json(
            {
                message:
                    "Invalid signature",
            },
            {
                status: 400,
            },
        );
    }
    if (
        event.type !== "payment_intent.succeeded"
    ) {
        return NextResponse.json({
            received: true,
        });
    }

    const paymentIntent = event.data.object;
    const session =
        await db.query.checkoutSession.findFirst({
            where: eq(
                checkoutSession.paymentIntentId,
                paymentIntent.id,
            ),
        });
    if (!session) {
        return NextResponse.json(
            {
                message:
                    "Checkout session not found",
            },
            {
                status: 404,
            },
        );
    }
    try {
        await createOrder({
            userId: session.userId,
            paymentMethod: "stripe",
            stripePaymentIntentId: paymentIntent.id,
            shipping: session.shipping as ShippingFormValues,
        });
    } catch (error) {
        console.error("Create Order Error:", error);
    }
    const userCart = await db.query.cart.findFirst({
        where: eq(cart.userId, session.userId),
    });
if (userCart) {
    await db.delete(cartItem).where(eq(cartItem.cartId, userCart.id));
    await db.delete(cart).where(eq(cart.userId, session.userId));
}
await db
    .delete(checkoutSession)
    .where(
        eq(
            checkoutSession.id,
            session.id,
        ),
    );
return NextResponse.json({
    received: true,
});

}

