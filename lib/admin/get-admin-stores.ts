import {and,asc,count,desc,eq,ilike,or,sql,type SQL,} from "drizzle-orm";
import { db } from "@/db";
import { order, payment, product, store,user,} from "@/db/schema";

export const ADMIN_STORES_PAGE_SIZE = 10;

export type AdminStoreFilters = {
    query?: string;
    status?:
        | "all"
        | "pending"
        | "approved"
        | "rejected"
        | "suspended";
    stripe?: "all" | "connected" | "not_connected";
    sort?: "newest" | "oldest" | "name" | "revenue";
    page?: number;
};

const productCountExpression = sql<number>`(
    SELECT COUNT(*)
    FROM ${product}
    WHERE ${product.storeId} = ${store.id}
)`;

const activeProductCountExpression = sql<number>`(
    SELECT COUNT(*)
    FROM ${product}
    WHERE ${product.storeId} = ${store.id}
    AND ${product.status} = 'active'
)`;

const orderCountExpression = sql<number>`(
    SELECT COUNT(*)
    FROM ${order}
    WHERE ${order.storeId} = ${store.id}
)`;

const grossRevenueExpression = sql<string>`(
    SELECT COALESCE(SUM(${order.totalAmount}), 0)
    FROM ${order}
    WHERE ${order.storeId} = ${store.id}
    AND ${order.paymentStatus} = 'paid'
)`;

const pendingPayoutExpression = sql<string>`(
    SELECT COALESCE(SUM(${payment.sellerAmount}), 0)
    FROM ${payment}
    INNER JOIN ${order}
        ON ${order.id} = ${payment.orderId}
    WHERE ${order.storeId} = ${store.id}
    AND ${payment.status} = 'paid'
    AND ${payment.sellerPayoutStatus} = 'pending'
)`;

export async function getAdminStores(
    filters: AdminStoreFilters,
) {
    const page = Math.max(1, filters.page ?? 1);
    const conditions: SQL<unknown>[] = [];

    if (filters.query) {
        const searchCondition = or(
            ilike(store.name, `%${filters.query}%`),
            ilike(store.email, `%${filters.query}%`),
            ilike(store.phone, `%${filters.query}%`),
            ilike(user.name, `%${filters.query}%`),
            ilike(user.email, `%${filters.query}%`),
        );

        if (searchCondition) {
            conditions.push(searchCondition);
        }
    }

    if (filters.status && filters.status !== "all") {
        conditions.push(eq(store.status, filters.status));
    }

    if (filters.stripe === "connected") {
        conditions.push(eq(store.isStripeConnected, true));
    }

    if (filters.stripe === "not_connected") {
        conditions.push(eq(store.isStripeConnected, false));
    }

    const whereClause =
        conditions.length > 0 ? and(...conditions) : undefined;

    const orderBy =
        filters.sort === "oldest"
            ? asc(store.createdAt)
            : filters.sort === "name"
              ? asc(store.name)
              : filters.sort === "revenue"
                ? desc(grossRevenueExpression)
                : desc(store.createdAt);

    const [rows, totalResult, statsResult] = await Promise.all([
        db
            .select({
                id: store.id,
                ownerId: store.ownerId,
                name: store.name,
                slug: store.slug,
                category: store.category,
                description: store.description,
                email: store.email,
                phone: store.phone,
                city: store.city,
                country: store.country,
                status: store.status,
                rejectionReason: store.rejectionReason,
                isStripeConnected: store.isStripeConnected,
                stripeChargesEnabled: store.stripeChargesEnabled,
                stripePayoutsEnabled: store.stripePayoutsEnabled,
                stripeDetailsSubmitted: store.stripeDetailsSubmitted,
                createdAt: store.createdAt,
                ownerName: user.name,
                ownerEmail: user.email,
                ownerBanned: user.banned,
                products: productCountExpression,
                activeProducts: activeProductCountExpression,
                orders: orderCountExpression,
                grossRevenue: grossRevenueExpression,
                pendingPayout: pendingPayoutExpression,
            })
            .from(store)
            .innerJoin(user, eq(user.id, store.ownerId))
            .where(whereClause)
            .orderBy(orderBy)
            .limit(ADMIN_STORES_PAGE_SIZE)
            .offset((page - 1) * ADMIN_STORES_PAGE_SIZE),

        db
            .select({ total: count() })
            .from(store)
            .innerJoin(user, eq(user.id, store.ownerId))
            .where(whereClause),

        db
            .select({
                total: count(),
                pending: sql<number>`COUNT(*) FILTER (WHERE ${store.status} = 'pending')`,
                approved: sql<number>`COUNT(*) FILTER (WHERE ${store.status} = 'approved')`,
                rejected: sql<number>`COUNT(*) FILTER (WHERE ${store.status} = 'rejected')`,
                suspended: sql<number>`COUNT(*) FILTER (WHERE ${store.status} = 'suspended')`,
                stripeConnected: sql<number>`COUNT(*) FILTER (WHERE ${store.isStripeConnected} = true)`,
            })
            .from(store),
    ]);

    const total = Number(totalResult[0]?.total ?? 0);
    const stats = statsResult[0];

    return {
        stores: rows.map((currentStore) => ({
            ...currentStore,
            products: Number(currentStore.products ?? 0),
            activeProducts: Number(
                currentStore.activeProducts ?? 0,
            ),
            orders: Number(currentStore.orders ?? 0),
            grossRevenue: Number(currentStore.grossRevenue ?? 0),
            pendingPayout: Number(currentStore.pendingPayout ?? 0),
        })),
        pagination: {
            page,
            pageCount: Math.max(
                1,
                Math.ceil(total / ADMIN_STORES_PAGE_SIZE),
            ),
            total,
        },
        stats: {
            total: Number(stats?.total ?? 0),
            pending: Number(stats?.pending ?? 0),
            approved: Number(stats?.approved ?? 0),
            rejected: Number(stats?.rejected ?? 0),
            suspended: Number(stats?.suspended ?? 0),
            stripeConnected: Number(stats?.stripeConnected ?? 0),
        },
    };
}
