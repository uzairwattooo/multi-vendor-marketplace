import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/db";
import { inventory, product } from "@/db/schema";
import { requireAdminApi } from "@/lib/admin/admin-api";

const updateInventorySchema = z
    .object({
        quantity: z.number().int().min(0).max(100000000),
        reservedQuantity: z.number().int().min(0).max(100000000),
        lowStockThreshold: z.number().int().min(0).max(1000000),
        trackQuantity: z.boolean(),
    })
    .refine(
        (data) => data.reservedQuantity <= data.quantity,
        {
            message: "Reserved quantity cannot exceed total quantity",
            path: ["reservedQuantity"],
        },
    );

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
        const authorization = await requireAdminApi(request);

        if (authorization.response) {
            return authorization.response;
        }

        const { productId } = await context.params;
        const result = updateInventorySchema.safeParse(
            await request.json(),
        );

        if (!result.success) {
            return NextResponse.json(
                {
                    message: "Invalid inventory values",
                    errors: result.error.flatten().fieldErrors,
                },
                { status: 400 },
            );
        }

        const [existingProduct] = await db
            .select({
                id: product.id,
                status: product.status,
            })
            .from(product)
            .where(eq(product.id, productId))
            .limit(1);

        if (!existingProduct) {
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 },
            );
        }

        const availableQuantity =
            result.data.quantity - result.data.reservedQuantity;

        const nextStatus =
            availableQuantity <= 0 && existingProduct.status === "active"
                ? "out_of_stock"
                : availableQuantity > 0 &&
                    existingProduct.status === "out_of_stock"
                  ? "draft"
                  : existingProduct.status;

        await db.transaction(async (tx) => {
            await tx
                .insert(inventory)
                .values({
                    productId,
                    quantity: result.data.quantity,
                    reservedQuantity: result.data.reservedQuantity,
                    lowStockThreshold: result.data.lowStockThreshold,
                    trackQuantity: result.data.trackQuantity,
                })
                .onConflictDoUpdate({
                    target: inventory.productId,
                    set: {
                        quantity: result.data.quantity,
                        reservedQuantity: result.data.reservedQuantity,
                        lowStockThreshold: result.data.lowStockThreshold,
                        trackQuantity: result.data.trackQuantity,
                        updatedAt: new Date(),
                    },
                });

            await tx
                .update(product)
                .set({
                    stock: availableQuantity,
                    lowStockThreshold: result.data.lowStockThreshold,
                    status: nextStatus,
                    ...(nextStatus === "active"
                        ? {}
                        : { featured: false }),
                    updatedAt: new Date(),
                })
                .where(eq(product.id, productId));
        });

        return NextResponse.json({
            message: "Inventory updated successfully",
            inventory: {
                quantity: result.data.quantity,
                reservedQuantity: result.data.reservedQuantity,
                availableQuantity,
                lowStockThreshold: result.data.lowStockThreshold,
                trackQuantity: result.data.trackQuantity,
                status: nextStatus,
            },
        });
    } catch (error) {
        console.error("ADMIN_UPDATE_INVENTORY_ERROR:", error);

        return NextResponse.json(
            {
                message:
                    error instanceof Error
                        ? error.message
                        : "Unable to update inventory",
            },
            { status: 500 },
        );
    }
}
