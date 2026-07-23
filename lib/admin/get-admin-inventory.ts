import {
    and,
    asc,
    count,
    desc,
    eq,
    gt,
    ilike,
    lte,
    or,
    sql,
    type SQL,
} from "drizzle-orm";

import { db } from "@/db";
import {
    inventory,
    product,
    productImage,
    store,
} from "@/db/schema";

export const ADMIN_INVENTORY_PAGE_SIZE = 12;

export type AdminInventoryFilters = {
    query?: string;
    storeId?: string;
    state?: "all" | "healthy" | "low_stock" | "out_of_stock";
    tracking?: "all" | "tracked" | "not_tracked";
    sort?: "stock_low" | "stock_high" | "newest" | "name";
    page?: number;
};

const imageExpression = sql<string | null>`(
    SELECT ${productImage.url}
    FROM ${productImage}
    WHERE ${productImage.productId} = ${product.id}
    ORDER BY ${productImage.position} ASC, ${productImage.createdAt} ASC
    LIMIT 1
)`;

const quantityExpression = sql<number>`COALESCE(${inventory.quantity}, ${product.stock})`;
const reservedExpression = sql<number>`COALESCE(${inventory.reservedQuantity}, 0)`;
const thresholdExpression = sql<number>`COALESCE(${inventory.lowStockThreshold}, ${product.lowStockThreshold})`;
const availableExpression = sql<number>`GREATEST(COALESCE(${inventory.quantity}, ${product.stock}) - COALESCE(${inventory.reservedQuantity}, 0), 0)`;

export async function getAdminInventory(
    filters: AdminInventoryFilters,
) {
    const page = Math.max(1, filters.page ?? 1);
    const conditions: SQL<unknown>[] = [];

    if (filters.query) {
        const searchCondition = or(
            ilike(product.name, `%${filters.query}%`),
            ilike(product.sku, `%${filters.query}%`),
            ilike(store.name, `%${filters.query}%`),
        );

        if (searchCondition) {
            conditions.push(searchCondition);
        }
    }

    if (filters.storeId && filters.storeId !== "all") {
        conditions.push(eq(product.storeId, filters.storeId));
    }

    if (filters.state === "healthy") {
        conditions.push(gt(availableExpression, thresholdExpression));
    }

    if (filters.state === "low_stock") {
        conditions.push(
            and(
                gt(availableExpression, 0),
                lte(availableExpression, thresholdExpression),
            )!,
        );
    }

    if (filters.state === "out_of_stock") {
        conditions.push(lte(availableExpression, 0));
    }

    if (filters.tracking === "tracked") {
        conditions.push(eq(inventory.trackQuantity, true));
    }

    if (filters.tracking === "not_tracked") {
        conditions.push(
            or(
                eq(inventory.trackQuantity, false),
                sql`${inventory.id} IS NULL`,
            )!,
        );
    }

    const whereClause =
        conditions.length > 0 ? and(...conditions) : undefined;

    const orderBy =
        filters.sort === "stock_high"
            ? desc(availableExpression)
            : filters.sort === "newest"
              ? desc(product.updatedAt)
              : filters.sort === "name"
                ? asc(product.name)
                : asc(availableExpression);

    const [rows, totalRows, statsRows, stores] = await Promise.all([
        db
            .select({
                productId: product.id,
                name: product.name,
                sku: product.sku,
                status: product.status,
                storeId: store.id,
                storeName: store.name,
                image: imageExpression,
                productStock: product.stock,
                productThreshold: product.lowStockThreshold,
                inventoryId: inventory.id,
                quantity: quantityExpression,
                reservedQuantity: reservedExpression,
                availableQuantity: availableExpression,
                lowStockThreshold: thresholdExpression,
                trackQuantity: sql<boolean>`COALESCE(${inventory.trackQuantity}, false)`,
                updatedAt: sql<Date>`COALESCE(${inventory.updatedAt}, ${product.updatedAt})`,
            })
            .from(product)
            .innerJoin(store, eq(store.id, product.storeId))
            .leftJoin(inventory, eq(inventory.productId, product.id))
            .where(whereClause)
            .orderBy(orderBy)
            .limit(ADMIN_INVENTORY_PAGE_SIZE)
            .offset((page - 1) * ADMIN_INVENTORY_PAGE_SIZE),

        db
            .select({ total: count() })
            .from(product)
            .innerJoin(store, eq(store.id, product.storeId))
            .leftJoin(inventory, eq(inventory.productId, product.id))
            .where(whereClause),

        db
            .select({
                total: count(),
                healthy: sql<number>`COUNT(*) FILTER (WHERE ${availableExpression} > ${thresholdExpression})`,
                lowStock: sql<number>`COUNT(*) FILTER (WHERE ${availableExpression} > 0 AND ${availableExpression} <= ${thresholdExpression})`,
                outOfStock: sql<number>`COUNT(*) FILTER (WHERE ${availableExpression} <= 0)`,
                reserved: sql<number>`COALESCE(SUM(${reservedExpression}), 0)`,
                available: sql<number>`COALESCE(SUM(${availableExpression}), 0)`,
            })
            .from(product)
            .leftJoin(inventory, eq(inventory.productId, product.id)),

        db
            .select({
                id: store.id,
                name: store.name,
            })
            .from(store)
            .orderBy(asc(store.name)),
    ]);

    const total = Number(totalRows[0]?.total ?? 0);
    const stats = statsRows[0];

    return {
        inventory: rows.map((row) => ({
            ...row,
            quantity: Number(row.quantity ?? 0),
            reservedQuantity: Number(row.reservedQuantity ?? 0),
            availableQuantity: Number(row.availableQuantity ?? 0),
            lowStockThreshold: Number(row.lowStockThreshold ?? 0),
        })),
        stores,
        pagination: {
            page,
            pageCount: Math.max(
                1,
                Math.ceil(total / ADMIN_INVENTORY_PAGE_SIZE),
            ),
            total,
        },
        stats: {
            total: Number(stats?.total ?? 0),
            healthy: Number(stats?.healthy ?? 0),
            lowStock: Number(stats?.lowStock ?? 0),
            outOfStock: Number(stats?.outOfStock ?? 0),
            reserved: Number(stats?.reserved ?? 0),
            available: Number(stats?.available ?? 0),
        },
    };
}

export type AdminInventoryItem = Awaited<
    ReturnType<typeof getAdminInventory>
>["inventory"][number];
