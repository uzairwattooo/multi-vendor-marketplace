import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { db } from "@/db";
import {
    cart,
    cartItem,
    product,
} from "@/db/schema";

export async function POST(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        const { shipping, notes } = await req.json();
        if (!session?.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 },
            );
        }

        const [userCart] = await db
            .select()
            .from(cart)
            .where(eq(cart.userId, session.user.id))
            .limit(1);

        if (!userCart) {
            return NextResponse.json(
                { message: "Cart not found" },
                { status: 404 },
            );
        }

        const items = await db
            .select({
                quantity: cartItem.quantity,
                price: product.price,
                productId: product.id,
            })
            .from(cartItem)
            .innerJoin(
                product,
                eq(product.id, cartItem.productId)
            )
            .where(eq(cartItem.cartId, userCart.id));
        if (items.length === 0) {
            return NextResponse.json(
                { message: "Cart is empty" },
                { status: 400 },
            );
        }

        const subtotal = items.reduce(
            (sum, item) =>
                sum + Number(item.price) * item.quantity,
            0,
        );

        const shippingCost = 0;

        const tax = 0;

        const total =
            subtotal +
            shippingCost +
            tax;

        const paymentIntent =
            await stripe.paymentIntents.create({
                amount: Math.round(total * 100),
                currency: "usd",
                automatic_payment_methods: {
                    enabled: true,
                },
                metadata: {
                    userId: session.user.id,
                    cartId: userCart.id,
                    shipping: JSON.stringify(shipping),
                    notes: notes ?? "",
                },
            });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        });
    } catch (error) {
        console.error("PAYMENT INTENT ERROR:", error);

        return NextResponse.json(
            {
                message:
                    "Unable to create payment intent.",
            },
            {
                status: 500,
            },
        );
    }
}