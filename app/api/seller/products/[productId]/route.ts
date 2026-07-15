import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { product, store } from "@/db/schema";
import { createProductSchema } from "@/lib/validations/product";

async function getCurrentSeller() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return {
            error: NextResponse.json(
                { message: "Authentication required" },
                { status: 401 }
            ),
        };
    }

    const [sellerStore] = await db
        .select({
            id: store.id,
        })
        .from(store)
        .where(
            and(
                eq(store.ownerId, session.user.id),
                eq(store.status, "approved")
            )
        )
        .limit(1);

    if (!sellerStore) {
        return {
            error: NextResponse.json(
                { message: "Approved store not found" },
                { status: 403 }
            ),
        };
    }

    return {
        session,
        sellerStore,
    };
}

export async function GET(
    request: Request,
    {
        params,
    }: {
        params: Promise<{ productId: string }>;
    }
) {
    try {
        const seller = await getCurrentSeller();

        if ("error" in seller) {
            return seller.error;
        }

        const { productId } = await params;

        const [currentProduct] = await db
            .select()
            .from(product)
            .where(
                and(
                    eq(product.id, productId),
                    eq(product.storeId, seller.sellerStore.id)
                )
            )
            .limit(1);

        if (!currentProduct) {
            return NextResponse.json(
                {
                    message: "Product not found",
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json(currentProduct);
    } catch (error) {
        console.error("GET_PRODUCT_ERROR:", error);

        return NextResponse.json(
            {
                message: "Unable to fetch product",
            },
            {
                status: 500,
            }
        );
    }
}
export async function PATCH(
    request: Request,
    {
        params,
    }: {
        params: Promise<{ productId: string }>;
    }
) {
    try {
        const seller = await getCurrentSeller();

        if ("error" in seller) {
            return seller.error;
        }

        const { productId } = await params;

        const [existingProduct] = await db
            .select()
            .from(product)
            .where(
                and(
                    eq(product.id, productId),
                    eq(product.storeId, seller.sellerStore.id)
                )
            )
            .limit(1);

        if (!existingProduct) {
            return NextResponse.json(
                {
                    message: "Product not found",
                },
                {
                    status: 404,
                }
            );
        }

        const body = await request.json();

        const result = createProductSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    message: "Validation failed",
                    errors: result.error.flatten().fieldErrors,
                },
                {
                    status: 400,
                }
            );
        }

        await db
            .update(product)
            .set({
                name: result.data.name,
                slug: existingProduct.slug,
                description: result.data.description,
                category: body.category,
                sku: result.data.sku,
                price: String(result.data.price),
                salePrice:
                    result.data.comparePrice === "" ||
                        result.data.comparePrice === undefined
                        ? null
                        : String(result.data.comparePrice),
                stock: result.data.quantity,
                lowStockThreshold:
                    result.data.lowStockThreshold,
                status: result.data.status,
                updatedAt: new Date(),
            })
            .where(eq(product.id, productId));

        return NextResponse.json({
            message: "Product updated successfully",
        });
    } catch (error) {
        console.error("UPDATE_PRODUCT_ERROR:", error);

        return NextResponse.json(
            {
                message: "Unable to update product",
            },
            {
                status: 500,
            }
        );
    }
}
export async function DELETE(
    request: Request,
    {
        params,
    }: {
        params: Promise<{ productId: string }>;
    }
) {
    try {
        const seller = await getCurrentSeller();

        if ("error" in seller) {
            return seller.error;
        }

        const { productId } = await params;

        const [existingProduct] = await db
            .select({
                id: product.id,
            })
            .from(product)
            .where(
                and(
                    eq(product.id, productId),
                    eq(product.storeId, seller.sellerStore.id)
                )
            )
            .limit(1);

        if (!existingProduct) {
            return NextResponse.json(
                {
                    message: "Product not found",
                },
                {
                    status: 404,
                }
            );
        }

        await db
            .delete(product)
            .where(eq(product.id, productId));

        return NextResponse.json({
            message: "Product deleted successfully",
        });
    } catch (error) {
        console.error("DELETE_PRODUCT_ERROR:", error);

        return NextResponse.json(
            {
                message: "Unable to delete product",
            },
            {
                status: 500,
            }
        );
    }
}