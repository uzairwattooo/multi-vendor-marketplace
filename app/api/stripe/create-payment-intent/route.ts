import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { db } from "@/db";
import {cart,cartItem,checkoutSession,product,} from "@/db/schema";


export async function POST(
    req: Request,
) {
    try {
        const session =
            await auth.api.getSession({
                headers: await headers(),
            });
        if (!session) {
            return NextResponse.json(
                {
                    message:
                        "Unauthorized",
                },
                {
                    status: 401,
                },
            );
        }
        const { shipping } = await req.json();
        const userCart =
            await db.query.cart.findFirst({
                where: eq(
                    cart.userId,
                    session.user.id,
                ),
            });
        if (!userCart) {
            return NextResponse.json(
                {
                    message:
                        "Cart not found",
                },
                {
                    status: 404,
                },
            );
        }
        const items = await db
            .select({
                quantity:
                    cartItem.quantity,
                price:
                    product.price,
                name:
                    product.name,
            })
            .from(cartItem)
            .innerJoin(
                product,
                eq(
                    product.id,
                    cartItem.productId,
                ),
            )
            .where(
                eq(
                    cartItem.cartId,
                    userCart.id,
                ),
            );

        if (!items.length) {
            return NextResponse.json(
                {
                    message:
                        "Cart is empty",
                },
                {
                    status: 400,
                },
            );
        }
        let total = 0;

        for (const item of items) {
            total +=
                item.price * item.quantity;
        }
        const paymentIntent =
            await stripe.paymentIntents.create({
                amount: total * 100,

                currency: "usd",

                automatic_payment_methods: {
                    enabled: true,
                },

                metadata: {
                    userId: session.user.id,
                    cartId: userCart.id,
                },
            });
        await db.insert(checkoutSession).values({
            userId: session.user.id,

            paymentIntentId:
                paymentIntent.id,

            shipping,
        });
        return NextResponse.json({
            clientSecret:
                paymentIntent.client_secret,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                message:
                    "Failed to create payment intent",
            },
            {
                status: 500,
            },
        );
    }
}