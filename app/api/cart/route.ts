import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/db";

import {
    cart,
    cartItem,
    product,
    productImage,
    store,
} from "@/db/schema/";

export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json(
                {
                    items: [],
                    subtotal: 0,
                    totalItems: 0,
                },
                { status: 200 },
            );
        }

        const [userCart] = await db
            .select()
            .from(cart)
            .where(eq(cart.userId, session.user.id))
            .limit(1);

        if (!userCart) {
            return NextResponse.json({
                items: [],
                subtotal: 0,
                totalItems: 0,
            });
        }

        const items = await db
            .select({
                id: cartItem.id,

                quantity: cartItem.quantity,

                productId: product.id,
                name: product.name,
                slug: product.slug,
                image: productImage.url, 

                price: product.price,
                stock: product.stock,

                storeId: store.id,
                storeName: store.name,
            })
            .from(cartItem)
            .innerJoin(
                product,
                eq(product.id, cartItem.productId),
            )
            .innerJoin(
                store,
                eq(store.id, cartItem.storeId),
            )
            .leftJoin(productImage, eq(productImage.productId, product.id))

            .where(eq(cartItem.cartId, userCart.id));

        const subtotal = items.reduce(
            (sum, item) =>
                sum + item.price * item.quantity,
            0,
        );

        const totalItems = items.reduce(
            (sum, item) => sum + item.quantity,
            0,
        );

        return NextResponse.json({
            items,
            subtotal,
            totalItems,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                message: "Failed to load cart.",
            },
            {
                status: 500,
            },
        );
    }
}