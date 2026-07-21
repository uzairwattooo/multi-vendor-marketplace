"use server";

import { headers } from "next/headers";
import { eq, count } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { wishlist } from "@/db/schema";

export async function getWishlistCount() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return 0;
    }

    const [result] = await db
        .select({
            total: count(),
        })
        .from(wishlist)
        .where(eq(wishlist.userId, session.user.id));

    return Number(result.total);
}