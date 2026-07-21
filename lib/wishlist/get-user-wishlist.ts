"use server";

import { headers } from "next/headers";
import { eq, sql } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { wishlist, product, store, productImage } from "@/db/schema";

export async function getUserWishlist() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return [];
    }

    return await db
        .select({
            id: product.id,
            name: product.name,
            slug: product.slug,
            description: product.description,
            category: product.category,
            brand: product.brand,
            price: product.price,
            salePrice: product.salePrice,
            stock: product.stock,
            storeId: product.storeId,
            storeName: store.name,
            storeSlug: store.slug,
            rating: sql<number>`0`,
            reviewCount: sql<number>`0`,
            isWishlisted: sql<boolean>`true`,
            image: sql<string | null>`
        (
            SELECT ${productImage.url}
            FROM ${productImage}
            WHERE ${productImage.productId} = ${product.id}
            LIMIT 1
        )
        `,
        })
        .from(wishlist)
        .innerJoin(product, eq(product.id, wishlist.productId))
        .innerJoin(store, eq(store.id, product.storeId))
        .where(eq(wishlist.userId, session.user.id));
}