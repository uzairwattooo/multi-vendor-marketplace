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
    category,
    order,
    orderItem,
    product,
    productImage,
    store,
} from "@/db/schema";

export const ADMIN_PRODUCTS_PAGE_SIZE = 10;

export type AdminProductFilters = {
    query?: string;
    status?:
        | "all"
        | "draft"
        | "active"
        | "out_of_stock"
        | "archived";
    storeId?: string;
    category?: string;
    stock?: "all" | "in_stock" | "low_stock" | "out_of_stock";
    featured?: "all" | "featured" | "not_featured";
    sort?:
        | "newest"
        | "oldest"
        | "name"
        | "price_high"
        | "price_low"
        | "stock_low"
        | "sales";
    page?: number;
};

const imageExpression = sql<string | null>`(
    SELECT ${productImage.url}
    FROM ${productImage}
    WHERE ${productImage.productId} = ${product.id}
    ORDER BY ${productImage.position} ASC, ${productImage.createdAt} ASC
    LIMIT 1
)`;

const unitsSoldExpression = sql<number>`(
    SELECT COALESCE(SUM(${orderItem.quantity}), 0)
    FROM ${orderItem}
    INNER JOIN ${order}
        ON ${order.id} = ${orderItem.orderId}
    WHERE ${orderItem.productId} = ${product.id}
      AND ${order.status} NOT IN ('cancelled', 'refunded')
)`;

export async function getAdminProducts(
    filters: AdminProductFilters,
) {
    const page = Math.max(1, filters.page ?? 1);
    const conditions: SQL<unknown>[] = [];

    if (filters.query) {
        const searchCondition = or(
            ilike(product.name, `%${filters.query}%`),
            ilike(product.sku, `%${filters.query}%`),
            ilike(product.brand, `%${filters.query}%`),
            ilike(product.category, `%${filters.query}%`),
            ilike(store.name, `%${filters.query}%`),
        );

        if (searchCondition) {
            conditions.push(searchCondition);
        }
    }

    if (filters.status && filters.status !== "all") {
        conditions.push(eq(product.status, filters.status));
    }

    if (filters.storeId && filters.storeId !== "all") {
        conditions.push(eq(product.storeId, filters.storeId));
    }

    if (filters.category && filters.category !== "all") {
        conditions.push(eq(product.category, filters.category));
    }

    if (filters.featured === "featured") {
        conditions.push(eq(product.featured, true));
    }

    if (filters.featured === "not_featured") {
        conditions.push(eq(product.featured, false));
    }

    if (filters.stock === "in_stock") {
        conditions.push(gt(product.stock, product.lowStockThreshold));
    }

    if (filters.stock === "low_stock") {
        conditions.push(
            and(
                gt(product.stock, 0),
                lte(product.stock, product.lowStockThreshold),
            )!,
        );
    }

    if (filters.stock === "out_of_stock") {
        conditions.push(
            or(
                lte(product.stock, 0),
                eq(product.status, "out_of_stock"),
            )!,
        );
    }

    const whereClause =
        conditions.length > 0 ? and(...conditions) : undefined;

    const orderBy =
        filters.sort === "oldest"
            ? asc(product.createdAt)
            : filters.sort === "name"
              ? asc(product.name)
              : filters.sort === "price_high"
                ? desc(sql`COALESCE(${product.salePrice}, ${product.price})`)
                : filters.sort === "price_low"
                  ? asc(sql`COALESCE(${product.salePrice}, ${product.price})`)
                  : filters.sort === "stock_low"
                    ? asc(product.stock)
                    : filters.sort === "sales"
                      ? desc(unitsSoldExpression)
                      : desc(product.createdAt);

    const [
        rows,
        totalResult,
        statsResult,
        storeOptions,
        categoryRows,
        productCategoryRows,
    ] = await Promise.all([
            db
                .select({
                    id: product.id,
                    storeId: product.storeId,
                    name: product.name,
                    slug: product.slug,
                    sku: product.sku,
                    category: product.category,
                    brand: product.brand,
                    price: product.price,
                    salePrice: product.salePrice,
                    stock: product.stock,
                    lowStockThreshold: product.lowStockThreshold,
                    status: product.status,
                    featured: product.featured,
                    createdAt: product.createdAt,
                    updatedAt: product.updatedAt,
                    storeName: store.name,
                    storeSlug: store.slug,
                    storeStatus: store.status,
                    image: imageExpression,
                    unitsSold: unitsSoldExpression,
                })
                .from(product)
                .innerJoin(store, eq(store.id, product.storeId))
                .where(whereClause)
                .orderBy(orderBy)
                .limit(ADMIN_PRODUCTS_PAGE_SIZE)
                .offset((page - 1) * ADMIN_PRODUCTS_PAGE_SIZE),

            db
                .select({ total: count() })
                .from(product)
                .innerJoin(store, eq(store.id, product.storeId))
                .where(whereClause),

            db
                .select({
                    total: count(),
                    active: sql<number>`COUNT(*) FILTER (WHERE ${product.status} = 'active')`,
                    draft: sql<number>`COUNT(*) FILTER (WHERE ${product.status} = 'draft')`,
                    outOfStock: sql<number>`COUNT(*) FILTER (WHERE ${product.stock} <= 0 OR ${product.status} = 'out_of_stock')`,
                    archived: sql<number>`COUNT(*) FILTER (WHERE ${product.status} = 'archived')`,
                    featured: sql<number>`COUNT(*) FILTER (WHERE ${product.featured} = true)`,
                    lowStock: sql<number>`COUNT(*) FILTER (WHERE ${product.stock} > 0 AND ${product.stock} <= ${product.lowStockThreshold})`,
                })
                .from(product),

            db
                .select({
                    id: store.id,
                    name: store.name,
                    status: store.status,
                })
                .from(store)
                .orderBy(asc(store.name)),

            db
                .select({
                    id: category.id,
                    name: category.name,
                })
                .from(category)
                .orderBy(asc(category.name)),

            db
                .selectDistinct({ name: product.category })
                .from(product)
                .orderBy(asc(product.category)),
        ]);

    const total = Number(totalResult[0]?.total ?? 0);
    const stats = statsResult[0];

    const categoryOptionMap = new Map<
        string,
        { id: string; name: string }
    >();

    categoryRows.forEach((currentCategory) => {
        categoryOptionMap.set(currentCategory.name, currentCategory);
    });

    productCategoryRows.forEach((currentCategory) => {
        if (!categoryOptionMap.has(currentCategory.name)) {
            categoryOptionMap.set(currentCategory.name, {
                id: currentCategory.name,
                name: currentCategory.name,
            });
        }
    });

    const categoryOptions = Array.from(
        categoryOptionMap.values(),
    ).sort((first, second) => first.name.localeCompare(second.name));

    return {
        products: rows.map((currentProduct) => ({
            ...currentProduct,
            unitsSold: Number(currentProduct.unitsSold ?? 0),
        })),
        filters: {
            stores: storeOptions,
            categories: categoryOptions,
        },
        pagination: {
            page,
            pageCount: Math.max(
                1,
                Math.ceil(total / ADMIN_PRODUCTS_PAGE_SIZE),
            ),
            total,
        },
        stats: {
            total: Number(stats?.total ?? 0),
            active: Number(stats?.active ?? 0),
            draft: Number(stats?.draft ?? 0),
            outOfStock: Number(stats?.outOfStock ?? 0),
            archived: Number(stats?.archived ?? 0),
            featured: Number(stats?.featured ?? 0),
            lowStock: Number(stats?.lowStock ?? 0),
        },
    };
}

export type AdminProductListItem = Awaited<
    ReturnType<typeof getAdminProducts>
>["products"][number];
