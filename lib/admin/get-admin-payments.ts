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

export const ADMIN_PAYMENTS_PAGE_SIZE = 10;

export type AdminPaymentFilters = {
    query?: string;
    provider?: "all" | "stripe" | "cod";
    status?: "all" | "pending" | "paid" | "failed" | "refunded";
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

export async function getAdminPayments(filters: AdminPaymentFilters) {
    const page = Math.max(1, filters.page ?? 1);
    const conditions: SQL<unknown>[] = [];

    if (filters.query) {
        const query = `%${filters.query}%`;
        const search = or(
            ilike(order.orderNumber, query),
            ilike(payment.transactionId, query),
            ilike(user.name, query),
            ilike(user.email, query),
            ilike(store.name, query),
        );

        if (search) conditions.push(search);
    }

    if (filters.provider && filters.provider !== "all") {
        conditions.push(eq(payment.provider, filters.provider));
    }

    if (filters.status && filters.status !== "all") {
        conditions.push(eq(payment.status, filters.status));
    }

    const dateFrom = parseDate(filters.dateFrom);
    const dateTo = parseDate(filters.dateTo, true);

    if (dateFrom) conditions.push(gte(payment.createdAt, dateFrom));
    if (dateTo) conditions.push(lte(payment.createdAt, dateTo));

    const whereClause =
        conditions.length > 0 ? and(...conditions) : undefined;
    const orderBy =
        filters.sort === "oldest"
            ? asc(payment.createdAt)
            : filters.sort === "amount_high"
                ? desc(payment.amount)
                : filters.sort === "amount_low"
                    ? asc(payment.amount)
                    : desc(payment.createdAt);

    const [rows, totalRows, totals] = await Promise.all([
        db
            .select({
                id: payment.id,
                orderId: order.id,
                orderNumber: order.orderNumber,
                buyerName: user.name,
                buyerEmail: user.email,
                storeId: store.id,
                storeName: store.name,
                provider: payment.provider,
                transactionId: payment.transactionId,
                amount: payment.amount,
                platformFee: payment.platformFee,
                sellerAmount: payment.sellerAmount,
                status: payment.status,
                paidAt: payment.paidAt,
                createdAt: payment.createdAt,
            })
            .from(payment)
            .innerJoin(order, eq(order.id, payment.orderId))
            .innerJoin(user, eq(user.id, order.buyerId))
            .innerJoin(store, eq(store.id, order.storeId))
            .where(whereClause)
            .orderBy(orderBy)
            .limit(ADMIN_PAYMENTS_PAGE_SIZE)
            .offset((page - 1) * ADMIN_PAYMENTS_PAGE_SIZE),
        db
            .select({ value: count() })
            .from(payment)
            .innerJoin(order, eq(order.id, payment.orderId))
            .innerJoin(user, eq(user.id, order.buyerId))
            .innerJoin(store, eq(store.id, order.storeId))
            .where(whereClause),
        db
            .select({
                totalProcessed: sql<string>`COALESCE(SUM(CASE WHEN ${payment.status} = 'paid' THEN ${payment.amount} ELSE 0 END), 0)`,
                platformRevenue: sql<string>`COALESCE(SUM(CASE WHEN ${payment.status} = 'paid' THEN ${payment.platformFee} ELSE 0 END), 0)`,
                sellerShare: sql<string>`COALESCE(SUM(CASE WHEN ${payment.status} = 'paid' THEN ${payment.sellerAmount} ELSE 0 END), 0)`,
                pendingAmount: sql<string>`COALESCE(SUM(CASE WHEN ${payment.status} = 'pending' THEN ${payment.amount} ELSE 0 END), 0)`,
                paidCount: sql<number>`COUNT(*) FILTER (WHERE ${payment.status} = 'paid')`,
                pendingCount: sql<number>`COUNT(*) FILTER (WHERE ${payment.status} = 'pending')`,
                failedCount: sql<number>`COUNT(*) FILTER (WHERE ${payment.status} = 'failed')`,
                refundedCount: sql<number>`COUNT(*) FILTER (WHERE ${payment.status} = 'refunded')`,
            })
            .from(payment),
    ]);

    const total = Number(totalRows[0]?.value ?? 0);
    const summary = totals[0];

    return {
        payments: rows.map((row) => ({
            ...row,
            amount: Number(row.amount),
            platformFee: Number(row.platformFee),
            sellerAmount: Number(row.sellerAmount),
        })),
        stats: {
            totalProcessed: Number(summary?.totalProcessed ?? 0),
            platformRevenue: Number(summary?.platformRevenue ?? 0),
            sellerShare: Number(summary?.sellerShare ?? 0),
            pendingAmount: Number(summary?.pendingAmount ?? 0),
            paidCount: Number(summary?.paidCount ?? 0),
            pendingCount: Number(summary?.pendingCount ?? 0),
            failedCount: Number(summary?.failedCount ?? 0),
            refundedCount: Number(summary?.refundedCount ?? 0),
        },
        pagination: {
            page,
            pageCount: Math.max(
                1,
                Math.ceil(total / ADMIN_PAYMENTS_PAGE_SIZE),
            ),
            total,
        },
    };
}

export type AdminPaymentListItem = Awaited<
    ReturnType<typeof getAdminPayments>
>["payments"][number];