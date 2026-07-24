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
import { order, orderItem, payment, store } from "@/db/schema";

export const ADMIN_ORDERS_PAGE_SIZE = 10;

export type OrderStatus =
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded";

export type AdminOrderFilters = {
    query?: string;
    status?: "all" | OrderStatus;
    paymentMethod?: "all" | "stripe" | "cod";
    paymentStatus?: "all" | "pending" | "paid" | "failed" | "refunded";
    storeId?: string;
    dateFrom?: string;
    dateTo?: string;
    sort?: "newest" | "oldest" | "amount_high" | "amount_low";
    page?: number;
};

function parseStartDate(value?: string) {
    if (!value) return null;
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
}

function parseEndDate(value?: string) {
    if (!value) return null;
    const date = new Date(`${value}T23:59:59.999`);
    return Number.isNaN(date.getTime()) ? null : date;
}

export async function getAdminOrders(filters: AdminOrderFilters) {
    const page = Math.max(1, filters.page ?? 1);
    const conditions: SQL<unknown>[] = [];

    if (filters.query) {
        const query = `%${filters.query}%`;
        const search = or(
            ilike(order.orderNumber, query),
            ilike(user.name, query),
            ilike(user.email, query),
            ilike(store.name, query),
        );
        if (search) conditions.push(search);
    }

    if (filters.status && filters.status !== "all") {
        conditions.push(eq(order.status, filters.status));
    }
    if (filters.paymentMethod && filters.paymentMethod !== "all") {
        conditions.push(eq(order.paymentMethod, filters.paymentMethod));
    }
    if (filters.paymentStatus && filters.paymentStatus !== "all") {
        conditions.push(eq(order.paymentStatus, filters.paymentStatus));
    }
    if (filters.storeId && filters.storeId !== "all") {
        conditions.push(eq(order.storeId, filters.storeId));
    }

    const dateFrom = parseStartDate(filters.dateFrom);
    const dateTo = parseEndDate(filters.dateTo);
    if (dateFrom) conditions.push(gte(order.createdAt, dateFrom));
    if (dateTo) conditions.push(lte(order.createdAt, dateTo));

    const whereClause =
        conditions.length > 0 ? and(...conditions) : undefined;
    const orderBy =
        filters.sort === "oldest"
            ? asc(order.createdAt)
            : filters.sort === "amount_high"
              ? desc(order.totalAmount)
              : filters.sort === "amount_low"
                ? asc(order.totalAmount)
                : desc(order.createdAt);

    const [rows, totalRows, statusRows, storeOptions] = await Promise.all([
        db
            .select({
                id: order.id,
                orderNumber: order.orderNumber,
                status: order.status,
                paymentMethod: order.paymentMethod,
                paymentStatus: order.paymentStatus,
                totalAmount: order.totalAmount,
                currency: order.currency,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
                buyerId: user.id,
                buyerName: user.name,
                buyerEmail: user.email,
                storeId: store.id,
                storeName: store.name,
                itemCount: sql<number>`COALESCE((
                    SELECT SUM(${orderItem.quantity})
                    FROM ${orderItem}
                    WHERE ${orderItem.orderId} = ${order.id}
                ), 0)`,
                platformFee: payment.platformFee,
                sellerAmount: payment.sellerAmount,
            })
            .from(order)
            .innerJoin(user, eq(user.id, order.buyerId))
            .innerJoin(store, eq(store.id, order.storeId))
            .leftJoin(payment, eq(payment.orderId, order.id))
            .where(whereClause)
            .orderBy(orderBy)
            .limit(ADMIN_ORDERS_PAGE_SIZE)
            .offset((page - 1) * ADMIN_ORDERS_PAGE_SIZE),
        db
            .select({ value: count() })
            .from(order)
            .innerJoin(user, eq(user.id, order.buyerId))
            .innerJoin(store, eq(store.id, order.storeId))
            .where(whereClause),
        db
            .select({ status: order.status, value: count() })
            .from(order)
            .groupBy(order.status),
        db
            .select({ id: store.id, name: store.name })
            .from(store)
            .orderBy(asc(store.name)),
    ]);

    const statusMap = new Map(
        statusRows.map((row) => [row.status, Number(row.value)]),
    );
    const total = Number(totalRows[0]?.value ?? 0);

    return {
        orders: rows.map((row) => ({
            ...row,
            totalAmount: Number(row.totalAmount),
            itemCount: Number(row.itemCount),
            platformFee:
                row.platformFee === null ? null : Number(row.platformFee),
            sellerAmount:
                row.sellerAmount === null ? null : Number(row.sellerAmount),
        })),
        stats: {
            total: statusRows.reduce(
                (sum, current) => sum + Number(current.value),
                0,
            ),
            pending: statusMap.get("pending") ?? 0,
            processing:
                (statusMap.get("confirmed") ?? 0) +
                (statusMap.get("processing") ?? 0),
            shipped: statusMap.get("shipped") ?? 0,
            delivered: statusMap.get("delivered") ?? 0,
            cancelled: statusMap.get("cancelled") ?? 0,
            refunded: statusMap.get("refunded") ?? 0,
        },
        stores: storeOptions,
        pagination: {
            page,
            pageCount: Math.max(1, Math.ceil(total / ADMIN_ORDERS_PAGE_SIZE)),
            total,
        },
    };
}

export type AdminOrderListItem = Awaited<
    ReturnType<typeof getAdminOrders>
>["orders"][number];
