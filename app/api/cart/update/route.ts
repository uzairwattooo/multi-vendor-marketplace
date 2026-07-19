import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { cart, cartItem, product } from "@/db/schema";

export async function PATCH(request: Request) {
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

        const { productId, quantity } = await request.json();

        if (!productId || quantity < 1) {
            return NextResponse.json(
                { message: "Invalid request." },
                { status: 400 },
            );
        }

        const [userCart] = await db
            .select()
            .from(cart)
            .where(eq(cart.userId, session.user.id))
            .limit(1);

        if (!userCart) {
            return NextResponse.json(
                { message: "Cart not found." },
                { status: 404 },
            );
        }

        const [selectedProduct] = await db
            .select()
            .from(product)
            .where(eq(product.id, productId))
            .limit(1);

        if (!selectedProduct) {
            return NextResponse.json(
                { message: "Product not found." },
                { status: 404 },
            );
        }

        await db
            .update(cartItem)
            .set({
                quantity: Math.min(
                    quantity,
                    selectedProduct.stock,
                ),
            })
            .where(
                and(
                    eq(cartItem.cartId, userCart.id),
                    eq(cartItem.productId, productId),
                ),
            );

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { message: "Something went wrong." },
            { status: 500 },
        );
    }
}