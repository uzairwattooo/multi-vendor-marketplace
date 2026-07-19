import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { cart, cartItem } from "@/db/schema";

export async function DELETE(request: Request) {
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

        const { productId } = await request.json();

        const [userCart] = await db
            .select()
            .from(cart)
            .where(eq(cart.userId, session.user.id))
            .limit(1);

        if (!userCart) {
            return NextResponse.json({
                success: true,
            });
        }

        await db
            .delete(cartItem)
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