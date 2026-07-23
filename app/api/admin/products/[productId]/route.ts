import { and, eq, ilike, ne } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/db";
import { category, product, store } from "@/db/schema";
import { requireAdminApi } from "@/lib/admin/admin-api";

const updateProductSchema = z.discriminatedUnion("action", [
    z.object({
        action: z.literal("set_status"),
        status: z.enum([
            "draft",
            "active",
            "out_of_stock",
            "archived",
        ]),
    }),
    z.object({
        action: z.literal("set_featured"),
        featured: z.boolean(),
    }),
    z.object({
        action: z.literal("update"),
        name: z.string().trim().min(2).max(160),
        description: z.string().trim().min(10).max(10000),
        category: z.string().trim().min(2).max(100),
        brand: z.string().trim().max(100).nullable(),
        sku: z.string().trim().min(2).max(100),
        price: z.number().int().min(0).max(1000000000),
        salePrice: z.number().int().min(0).max(1000000000).nullable(),
        lowStockThreshold: z.number().int().min(0).max(1000000),
    }),
]);

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
        const result = updateProductSchema.safeParse(
            await request.json(),
        );

        if (!result.success) {
            return NextResponse.json(
                {
                    message: "Invalid product management request",
                    errors: result.error.flatten().fieldErrors,
                },
                { status: 400 },
            );
        }

        const [existingProduct] = await db
            .select({
                id: product.id,
                storeId: product.storeId,
                name: product.name,
                sku: product.sku,
                stock: product.stock,
                status: product.status,
                featured: product.featured,
                storeStatus: store.status,
            })
            .from(product)
            .innerJoin(store, eq(store.id, product.storeId))
            .where(eq(product.id, productId))
            .limit(1);

        if (!existingProduct) {
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 },
            );
        }

        if (result.data.action === "set_status") {
            if (
                result.data.status === "active" &&
                existingProduct.storeStatus !== "approved"
            ) {
                return NextResponse.json(
                    {
                        message:
                            "Only products from approved stores can be activated",
                    },
                    { status: 409 },
                );
            }

            if (
                result.data.status === "active" &&
                existingProduct.stock <= 0
            ) {
                return NextResponse.json(
                    {
                        message:
                            "Add stock before activating this product",
                    },
                    { status: 409 },
                );
            }

            await db
                .update(product)
                .set({
                    status: result.data.status,
                    featured:
                        result.data.status === "active"
                            ? existingProduct.featured
                            : false,
                    updatedAt: new Date(),
                })
                .where(eq(product.id, productId));

            return NextResponse.json({
                message: `Product marked as ${result.data.status.replaceAll("_", " ")}`,
            });
        }

        if (result.data.action === "set_featured") {
            if (
                result.data.featured &&
                (existingProduct.status !== "active" ||
                    existingProduct.stock <= 0 ||
                    existingProduct.storeStatus !== "approved")
            ) {
                return NextResponse.json(
                    {
                        message:
                            "Only active, in-stock products from approved stores can be featured",
                    },
                    { status: 409 },
                );
            }

            await db
                .update(product)
                .set({
                    featured: result.data.featured,
                    updatedAt: new Date(),
                })
                .where(eq(product.id, productId));

            return NextResponse.json({
                message: result.data.featured
                    ? "Product added to featured placement"
                    : "Product removed from featured placement",
            });
        }

        if (
            result.data.salePrice !== null &&
            result.data.salePrice >= result.data.price
        ) {
            return NextResponse.json(
                {
                    message:
                        "Sale price must be lower than the regular price",
                },
                { status: 400 },
            );
        }

        const [matchingCategory] = await db
            .select({ id: category.id, name: category.name })
            .from(category)
            .where(ilike(category.name, result.data.category))
            .limit(1);

        if (!matchingCategory) {
            return NextResponse.json(
                {
                    message:
                        "Choose an existing marketplace category",
                },
                { status: 409 },
            );
        }

        const [duplicateSku] = await db
            .select({ id: product.id })
            .from(product)
            .where(
                and(
                    eq(product.storeId, existingProduct.storeId),
                    ilike(product.sku, result.data.sku),
                    ne(product.id, productId),
                ),
            )
            .limit(1);

        if (duplicateSku) {
            return NextResponse.json(
                {
                    message:
                        "This SKU is already used by another product in the same store",
                },
                { status: 409 },
            );
        }

        await db
            .update(product)
            .set({
                name: result.data.name,
                description: result.data.description,
                category: matchingCategory.name,
                brand: result.data.brand || null,
                sku: result.data.sku,
                price: result.data.price,
                salePrice: result.data.salePrice,
                lowStockThreshold: result.data.lowStockThreshold,
                updatedAt: new Date(),
            })
            .where(eq(product.id, productId));

        return NextResponse.json({
            message: "Product details updated successfully",
        });
    } catch (error) {
        console.error("ADMIN_UPDATE_PRODUCT_ERROR:", error);

        return NextResponse.json(
            {
                message:
                    error instanceof Error
                        ? error.message
                        : "Unable to update product",
            },
            { status: 500 },
        );
    }
}
