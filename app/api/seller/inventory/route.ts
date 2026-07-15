import { and, asc, eq, ilike, or, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { product, store } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
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

        const { searchParams } = new URL(request.url);

        const search = searchParams.get("search")?.trim() || "";
        const status = searchParams.get("status") || "all";

        const conditions = [
            eq(product.storeId, sellerStore.id),
        ];

        if (search) {
            conditions.push(
                or(
                    ilike(product.name, `%${search}%`),
                    ilike(product.sku, `%${search}%`),
                )!,
            );
        }

        if (status === "in-stock") {
            conditions.push(
                sql`${product.stock} > ${product.lowStockThreshold}`,
            );
        }

        if (status === "low-stock") {
            conditions.push(
                and(
                    sql`${product.stock} > 0`,
                    sql`${product.stock} <= ${product.lowStockThreshold}`,
                )!,
            );
        }

        if (status === "out-of-stock") {
            conditions.push(eq(product.stock, 0));
        }

        const inventoryProducts = await db
            .select({
                id: product.id,
                name: product.name,
                sku: product.sku,
                stock: product.stock,
                lowStockThreshold: product.lowStockThreshold,
                status: product.status,
                price: product.price,
                updatedAt: product.updatedAt,
            })
            .from(product)
            .where(and(...conditions))
            .orderBy(asc(product.name));

        return NextResponse.json(inventoryProducts);
    } catch (error) {
        console.error("GET_INVENTORY_ERROR:", error);

        return NextResponse.json(
            {
                message: "Unable to fetch inventory",
                error:
                    error instanceof Error
                        ? error.message
                        : "Unknown server error",
            },
            {
                status: 500,
            },
        );
    }
}