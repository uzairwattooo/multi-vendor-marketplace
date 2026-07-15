import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/db";
import { product, store } from "@/db/schema";
import { auth } from "@/lib/auth";

const updateInventorySchema = z.object({
    stock: z.coerce
        .number()
        .int("Stock must be a whole number")
        .min(0, "Stock cannot be negative"),

    lowStockThreshold: z.coerce
        .number()
        .int("Low stock threshold must be a whole number")
        .min(0, "Low stock threshold cannot be negative"),
});

type RouteContext = {
    params: Promise<{
        productId: string;
    }>;
};

export async function PATCH(
    request: Request,
    context: RouteContext,
) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json(
                {
                    message: "Authentication required",
                },
                {
                    status: 401,
                },
            );
        }

        const [sellerStore] = await db
            .select({
                id: store.id,
            })
            .from(store)
            .where(
                and(
                    eq(store.ownerId, session.user.id),
                    eq(store.status, "approved"),
                ),
            )
            .limit(1);

        if (!sellerStore) {
            return NextResponse.json(
                {
                    message: "Approved store not found",
                },
                {
                    status: 403,
                },
            );
        }

        const { productId } = await context.params;
        const body = await request.json();

        const result = updateInventorySchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    message: "Please check the inventory values",
                    errors: result.error.flatten().fieldErrors,
                },
                {
                    status: 400,
                },
            );
        }

        const [existingProduct] = await db
            .select({
                id: product.id,
            })
            .from(product)
            .where(
                and(
                    eq(product.id, productId),
                    eq(product.storeId, sellerStore.id),
                ),
            )
            .limit(1);

        if (!existingProduct) {
            return NextResponse.json(
                {
                    message: "Product not found",
                },
                {
                    status: 404,
                },
            );
        }

        const [updatedProduct] = await db
            .update(product)
            .set({
                stock: result.data.stock,
                lowStockThreshold:
                    result.data.lowStockThreshold,
                updatedAt: new Date(),
            })
            .where(
                and(
                    eq(product.id, productId),
                    eq(product.storeId, sellerStore.id),
                ),
            )
            .returning({
                id: product.id,
                name: product.name,
                stock: product.stock,
                lowStockThreshold: product.lowStockThreshold,
            });

        return NextResponse.json({
            message: "Inventory updated successfully",
            product: updatedProduct,
        });
    } catch (error) {
        console.error("UPDATE_INVENTORY_ERROR:", error);

        return NextResponse.json(
            {
                message: "Unable to update inventory",
            },
            {
                status: 500,
            },
        );
    }
}