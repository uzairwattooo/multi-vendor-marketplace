import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/db";

import {
    cart,
    cartItem,
    product,
} from "@/db/schema";

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

        const body = await request.json();

        const {
            productId,
            quantity = 1,
        } = body;

        if (!productId) {
            return NextResponse.json(
                { message: "Product ID is required." },
                { status: 400 },
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

        if (selectedProduct.stock <= 0) {
            return NextResponse.json(
                { message: "Product is out of stock." },
                { status: 400 },
            );
        }
        let [userCart] = await db
            .select()
            .from(cart)
            .where(eq(cart.userId, session.user.id))
            .limit(1);
        if (!userCart) {
            const [newCart] = await db
                .insert(cart)
                .values({
                    userId: session.user.id,
                })
                .returning();

            userCart = newCart;
        }
        const [existingItem] = await db
            .select()
            .from(cartItem)
            .where(
                and(
                    eq(cartItem.cartId, userCart.id),
                    eq(cartItem.productId, productId),
                ),
            )
            .limit(1);

        if (existingItem) {
            const newQuantity = Math.min(
                existingItem.quantity + quantity,
                selectedProduct.stock,
            );

            await db
                .update(cartItem)
                .set({
                    quantity: newQuantity,
                })
                .where(eq(cartItem.id, existingItem.id));

            return NextResponse.json({
                success: true,
                message: "Cart updated.",
            });
        }

        await db.insert(cartItem).values({
            cartId: userCart.id,
            productId,
            storeId: selectedProduct.storeId,
            quantity: Math.min(
                quantity,
                selectedProduct.stock,
            ),
        });

        return NextResponse.json({
            success: true,
            message: "Added to cart.",
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                message: "Something went wrong.",
            },
            {
                status: 500,
            },
        );
    }
}