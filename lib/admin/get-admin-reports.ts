import { and, asc, desc, eq, gte, lte, sql } from "drizzle-orm";

import { db } from "@/db";
import { order, orderItem, payment, store } from "@/db/schema";

type ReportFilters = {
    days: number;
    dateFrom?: string;
    dateTo?: string;
};

function parseDate(value: string | undefined, endOfDay = false) {
    if (!value) return null;
    const date = new Date(`${value}T${endOfDay ? "23:59:59.999" : "00:00:00"}`);
    return Number.isNaN(date.getTime()) ? null : date;
}

export async function getAdminReports(filters: ReportFilters) {
    const now = new Date();
    const customFrom = parseDate(filters.dateFrom);
    const customTo = parseDate(filters.dateTo, true);
    const from = customFrom ?? new Date(now.getTime() - (filters.days - 1) * 86_400_000);
    from.setHours(0, 0, 0, 0);
    const to = customTo ?? now;

    const orderPeriod = and(gte(order.createdAt, from), lte(order.createdAt, to));
    const paidPeriod = and(
        eq(payment.status, "paid"),
        gte(payment.createdAt, from),
        lte(payment.createdAt, to),
    );

    const [summaryRows, statusRows, trendRows, storeRows, productRows] =
        await Promise.all([
            db
                .select({
                    totalOrders: sql<number>`COUNT(DISTINCT ${order.id})`,
                    deliveredOrders: sql<number>`COUNT(DISTINCT ${order.id}) FILTER (WHERE ${order.status} = 'delivered')`,
                    paidOrders: sql<number>`COUNT(DISTINCT ${payment.orderId}) FILTER (WHERE ${payment.status} = 'paid')`,
                    paidSales: sql<string>`COALESCE(SUM(CASE WHEN ${payment.status} = 'paid' THEN ${payment.amount} ELSE 0 END), 0)`,
                    platformRevenue: sql<string>`COALESCE(SUM(CASE WHEN ${payment.status} = 'paid' THEN ${payment.platformFee} ELSE 0 END), 0)`,
                })
                .from(order)
                .leftJoin(payment, eq(payment.orderId, order.id))
                .where(orderPeriod),
            db
                .select({
                    status: order.status,
                    value: sql<number>`COUNT(*)`,
                })
                .from(order)
                .where(orderPeriod)
                .groupBy(order.status)
                .orderBy(asc(order.status)),
            db
                .select({
                    date: sql<string>`TO_CHAR(DATE(${payment.createdAt}), 'YYYY-MM-DD')`,
                    sales: sql<string>`COALESCE(SUM(${payment.amount}), 0)`,
                    orders: sql<number>`COUNT(*)`,
                })
                .from(payment)
                .where(paidPeriod)
                .groupBy(sql`DATE(${payment.createdAt})`)
                .orderBy(asc(sql`DATE(${payment.createdAt})`)),
            db
                .select({
                    id: store.id,
                    name: store.name,
                    sales: sql<string>`COALESCE(SUM(${payment.amount}), 0)`,
                    orders: sql<number>`COUNT(DISTINCT ${order.id})`,
                })
                .from(payment)
                .innerJoin(order, eq(order.id, payment.orderId))
                .innerJoin(store, eq(store.id, order.storeId))
                .where(paidPeriod)
                .groupBy(store.id, store.name)
                .orderBy(desc(sql`SUM(${payment.amount})`))
                .limit(5),
            db
                .select({
                    id: orderItem.productId,
                    name: orderItem.productName,
                    storeName: store.name,
                    units: sql<number>`COALESCE(SUM(${orderItem.quantity}), 0)`,
                    revenue: sql<string>`COALESCE(SUM(${orderItem.totalPrice}), 0)`,
                })
                .from(orderItem)
                .innerJoin(order, eq(order.id, orderItem.orderId))
                .innerJoin(payment, eq(payment.orderId, order.id))
                .innerJoin(store, eq(store.id, orderItem.storeId))
                .where(paidPeriod)
                .groupBy(orderItem.productId, orderItem.productName, store.name)
                .orderBy(desc(sql`SUM(${orderItem.quantity})`))
                .limit(5),
        ]);

    const summary = summaryRows[0];
    const paidSales = Number(summary?.paidSales ?? 0);
    const paidOrders = Number(summary?.paidOrders ?? 0);

    return {
        period: {
            from,
            to,
            label: `${from.toLocaleDateString("en-PK")} – ${to.toLocaleDateString("en-PK")}`,
        },
        stats: {
            paidSales,
            platformRevenue: Number(summary?.platformRevenue ?? 0),
            totalOrders: Number(summary?.totalOrders ?? 0),
            deliveredOrders: Number(summary?.deliveredOrders ?? 0),
            paidOrders,
            averageOrderValue: paidOrders > 0 ? paidSales / paidOrders : 0,
        },
        salesTrend: trendRows.map((row) => ({
            date: row.date,
            sales: Number(row.sales),
            orders: Number(row.orders),
        })),
        orderStatuses: statusRows.map((row) => ({
            status: row.status,
            value: Number(row.value),
        })),
        topStores: storeRows.map((row) => ({
            ...row,
            sales: Number(row.sales),
            orders: Number(row.orders),
        })),
        topProducts: productRows.map((row) => ({
            ...row,
            units: Number(row.units),
            revenue: Number(row.revenue),
        })),
    };
}
