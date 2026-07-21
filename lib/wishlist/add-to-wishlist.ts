"use server";

import { headers } from "next/headers";
import { and, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { wishlist } from "@/db/schema";

export async function toggleWishlist(
    productId: string,
) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return {
            success: false,
            message: "Unauthorized",
        };
    }

    const existing =
        await db.query.wishlist.findFirst({
            where: and(
                eq(
                    wishlist.userId,
                    session.user.id,
                ),
                eq(
                    wishlist.productId,
                    productId,
                ),
            ),
        });

    if (existing) {
        await db
            .delete(wishlist)
            .where(eq(wishlist.id, existing.id));

        return {
            success: true,
            action: "removed",
        };
    }

    await db.insert(wishlist).values({
        userId: session.user.id,
        productId,
    });

    return {
        success: true,
        action: "added",
    };
}