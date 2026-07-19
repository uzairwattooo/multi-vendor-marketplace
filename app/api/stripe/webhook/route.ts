
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createOrder } from "@/lib/order/create-order";
import { createSellerTransfers } from "@/lib/stripe/create-seller-transfers";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("stripe-signature");
    if (!signature) {
        return NextResponse.json(
            { message: "Missing stripe signature" },
            { status: 400 }
        );
    }
    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error) {
        console.error("Webhook signature failed:", error);
        return NextResponse.json(
            { message: "Invalid signature" },
            { status: 400 }
        );
    }
    try {
        if (event.type === "payment_intent.succeeded") {
            const paymentIntent =
                event.data.object as Stripe.PaymentIntent;

            await createOrder({
                userId: paymentIntent.metadata.userId,
                paymentMethod: "stripe",
                stripePaymentIntentId: paymentIntent.id,
                shipping: JSON.parse(
                    paymentIntent.metadata.shipping
                ),
            });
            await createSellerTransfers(
                paymentIntent.metadata.userId
            );
        }
        console.log("EVENT:", event.type);

        console.log("Creating Order...");
        return NextResponse.json({
            received: true,
        });
    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json(
            {
                message: "Webhook processing failed",
            },
            {
                status: 500,
            }
        );
    }
}
