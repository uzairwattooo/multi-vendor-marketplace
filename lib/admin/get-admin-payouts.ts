import {
    and,
    asc,
    count,
    desc,
    eq,
    gte,
    ilike,
    lte,
    or,
    sql,
    type SQL,
} from "drizzle-orm";

import { user } from "@/auth-schema";
import { db } from "@/db";
import { order, payment, store } from "@/db/schema";

export const ADMIN_PAYOUTS_PAGE_SIZE = 10;

export type AdminPayoutFilters = {
    query?: string;
    status?: "all" | "pending" | "processing" | "paid";
    connection?: "all" | "ready" | "not_ready";
    dateFrom?: string;
    dateTo?: string;
    sort?: "newest" | "oldest" | "amount_high" | "amount_low";
    page?: number;
};

function parseDate(value: string | undefined, endOfDay = false) {
    if (!value) return null;

    const date = new Date(
        `${value}T${endOfDay ? "23:59:59.999" : "00:00:00"}`,
    );

    return Number.isNaN(date.getTime()) ? null : date;
}

export async function getAdminPayouts(filters: AdminPayoutFilters) {
    const page = Math.max(1, filters.page ?? 1);
    const conditions: SQL<unknown>[] = [eq(payment.status, "paid")];

    if (filters.query) {
        const query = `%${filters.query}%`;
        const search = or(
            ilike(order.orderNumber, query),
            ilike(store.name, query),
            ilike(user.name, query),
            ilike(user.email, query),
            ilike(payment.transactionId, query),
        );

        if (search) conditions.push(search);
    }

    if (filters.status && filters.status !== "all") {
        conditions.push(
            eq(payment.sellerPayoutStatus, filters.status),
        );
    }

    if (filters.connection === "ready") {
        conditions.push(eq(store.stripePayoutsEnabled, true));
    } else if (filters.connection === "not_ready") {
        conditions.push(eq(store.stripePayoutsEnabled, false));
    }

    const dateFrom = parseDate(filters.dateFrom);
    const dateTo = parseDate(filters.dateTo, true);

    if (dateFrom) conditions.push(gte(payment.createdAt, dateFrom));
    if (dateTo) conditions.push(lte(payment.createdAt, dateTo));

    const whereClause = and(...conditions);
    const orderBy =
        filters.sort === "oldest"
            ? asc(payment.createdAt)
            : filters.sort === "amount_high"
                ? desc(payment.sellerAmount)
                : filters.sort === "amount_low"
                    ? asc(payment.sellerAmount)
                    : desc(payment.createdAt);

    const [rows, totalRows, totals] = await Promise.all([
        db
            .select({
                id: payment.id,
                orderId: order.id,
                orderNumber: order.orderNumber,
                storeId: store.id,
                storeName: store.name,
                sellerName: user.name,
                sellerEmail: user.email,
                sellerAmount: payment.sellerAmount,
                platformFee: payment.platformFee,
                payoutStatus: payment.sellerPayoutStatus,
                sellerPaidAt: payment.sellerPaidAt,
                paymentReference: payment.transactionId,
                stripeAccountId: store.stripeAccountId,
                stripePayoutsEnabled: store.stripePayoutsEnabled,
                createdAt: payment.createdAt,
            })
            .from(payment)
            .innerJoin(order, eq(order.id, payment.orderId))
            .innerJoin(store, eq(store.id, order.storeId))
            .innerJoin(user, eq(user.id, store.ownerId))
            .where(whereClause)
            .orderBy(orderBy)
            .limit(ADMIN_PAYOUTS_PAGE_SIZE)
            .offset((page - 1) * ADMIN_PAYOUTS_PAGE_SIZE),
        db
            .select({ value: count() })
            .from(payment)
            .innerJoin(order, eq(order.id, payment.orderId))
            .innerJoin(store, eq(store.id, order.storeId))
            .innerJoin(user, eq(user.id, store.ownerId))
            .where(whereClause),
        db
            .select({
                pendingAmount: sql<string>`COALESCE(SUM(CASE WHEN ${payment.status} = 'paid' AND ${payment.sellerPayoutStatus} = 'pending' THEN ${payment.sellerAmount} ELSE 0 END), 0)`,
                processingAmount: sql<string>`COALESCE(SUM(CASE WHEN ${payment.status} = 'paid' AND ${payment.sellerPayoutStatus} = 'processing' THEN ${payment.sellerAmount} ELSE 0 END), 0)`,
                paidAmount: sql<string>`COALESCE(SUM(CASE WHEN ${payment.status} = 'paid' AND ${payment.sellerPayoutStatus} = 'paid' THEN ${payment.sellerAmount} ELSE 0 END), 0)`,
                pendingCount: sql<number>`COUNT(*) FILTER (WHERE ${payment.status} = 'paid' AND ${payment.sellerPayoutStatus} = 'pending')`,
                processingCount: sql<number>`COUNT(*) FILTER (WHERE ${payment.status} = 'paid' AND ${payment.sellerPayoutStatus} = 'processing')`,
                paidCount: sql<number>`COUNT(*) FILTER (WHERE ${payment.status} = 'paid' AND ${payment.sellerPayoutStatus} = 'paid')`,
                blockedCount: sql<number>`COUNT(*) FILTER (WHERE ${payment.status} = 'paid' AND ${payment.sellerPayoutStatus} = 'pending' AND ${store.stripePayoutsEnabled} = false)`,
            })
            .from(payment)
            .innerJoin(order, eq(order.id, payment.orderId))
            .innerJoin(store, eq(store.id, order.storeId)),
    ]);

    const total = Number(totalRows[0]?.value ?? 0);
    const summary = totals[0];

    return {
        payouts: rows.map((row) => ({
            ...row,
            sellerAmount: Number(row.sellerAmount),
            platformFee: Number(row.platformFee),
        })),
        stats: {
            pendingAmount: Number(summary?.pendingAmount ?? 0),
            processingAmount: Number(summary?.processingAmount ?? 0),
            paidAmount: Number(summary?.paidAmount ?? 0),
            pendingCount: Number(summary?.pendingCount ?? 0),
            processingCount: Number(summary?.processingCount ?? 0),
            paidCount: Number(summary?.paidCount ?? 0),
            blockedCount: Number(summary?.blockedCount ?? 0),
        },
        pagination: {
            page,
            pageCount: Math.max(
                1,
                Math.ceil(total / ADMIN_PAYOUTS_PAGE_SIZE),
            ),
            total,
        },
    };
}

export type AdminPayoutListItem = Awaited<
    ReturnType<typeof getAdminPayouts>
>["payouts"][number];