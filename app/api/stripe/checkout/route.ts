import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { db } from "@/db";
import { cart, cartItem, product } from "@/db/schema";
import { eq } from "drizzle-orm";

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
        const { shipping } =
            await req.json();

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
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity:
                    cartItem.quantity,
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
        const lineItems = items.map(
            (item) => ({
                quantity:
                    item.quantity,

                price_data: {
                    currency: "usd",

                    product_data: {
                        name: item.name,
                    },

                    unit_amount:
                        item.price * 100,
                },
            }),
        );
        const checkoutSession = await stripe.checkout.sessions.create({
                mode: "payment",
                customer_email: session.user.email,
                line_items: lineItems,
                success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
                metadata: {
                    userId: session.user.id,
                    paymentMethod:"stripe",
                    shipping: JSON.stringify(shipping,),
                },
            });
        return NextResponse.json({
            url: checkoutSession.url,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {message:
                "Checkout failed",
            },
            {
                status: 500,
            },
        );
    }
}