import { and, count, eq, gte, sql, or, desc, sum } from "drizzle-orm";
import { db } from "@/db";
import { order, product, store } from "@/db/schema";
import { orderItem } from "@/db/schema/order";


export async function getSellerAnalytics(userId: string) {
    const [sellerStore] = await db
        .select({
            id: store.id,
        })
        .from(store)
        .where(
            and(
                eq(store.ownerId, userId),
                eq(store.status, "approved"),
            ),
        )
        .limit(1);

    if (!sellerStore) {
        throw new Error("Seller store not found");
    }
    const storeId = sellerStore.id;
    const now = new Date();
    const startOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
    );
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 7);
    const startOfMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        1,
    );
    const [stats] = await db
        .select({
            revenue:
                sql<number>`COALESCE(SUM(${order.totalAmount}),0)`,
            orders: count(order.id),
            customers:
                sql<number>`COUNT(DISTINCT ${order.buyerId})`,
        })
        .from(order)
        .where(eq(order.storeId, storeId));

    const [productStats] = await db
        .select({
            products: count(product.id),
        })
        .from(product)
        .where(eq(product.storeId, storeId));
    const [today] = await db
        .select({
            revenue:
                sql<number>`COALESCE(SUM(${order.totalAmount}),0)`,
        })
        .from(order)
        .where(
            and(
                eq(order.storeId, storeId),
                gte(order.createdAt, startOfToday),
            ),
        );
    const [week] = await db
        .select({
            revenue:
                sql<number>`COALESCE(SUM(${order.totalAmount}),0)`,
        })
        .from(order)
        .where(
            and(
                eq(order.storeId, storeId),
                gte(order.createdAt, startOfWeek),
            ),
        );
    const [month] = await db
        .select({
            revenue:
                sql<number>`COALESCE(SUM(${order.totalAmount}),0)`,
        })
        .from(order)
        .where(
            and(
                eq(order.storeId, storeId),
                gte(order.createdAt, startOfMonth),
            ),
        );
    const [pending] = await db
        .select({
            count: count(),
        })
        .from(order)
        .where(
            and(
                eq(order.storeId, storeId),
                eq(order.status, "pending"),
            ),
        );
    const [processing] = await db
        .select({
            count: count(),
        })
        .from(order)
        .where(
            and(
                eq(order.storeId, storeId),
                eq(order.status, "processing"),
            ),
        );
    const [shipped] = await db
        .select({
            count: count(),
        })
        .from(order)
        .where(
            and(
                eq(order.storeId, storeId),
                eq(order.status, "shipped"),
            ),
        );
    const [delivered] = await db
        .select({
            count: count(),
        })
        .from(order)
        .where(
            and(
                eq(order.storeId, storeId),
                eq(order.status, "delivered"),
            ),
        );
    const [cancelled] = await db
        .select({
            count: count(),
        })
        .from(order)
        .where(
            and(
                eq(order.storeId, storeId),
                eq(order.status, "cancelled"),
            ),
        );

    const topProducts = await db
        .select({
            id: product.id,
            name: product.name,
            sold: sql<number>`COALESCE(SUM(${orderItem.quantity}),0)`,
            revenue: sql<number>`COALESCE(SUM(${orderItem.totalPrice}),0)`,
        })
        .from(orderItem)
        .innerJoin(
            product,
            eq(orderItem.productId, product.id),
        )
        .where(eq(product.storeId, storeId))
        .groupBy(product.id, product.name)
        .orderBy(
            desc(sql`SUM(${orderItem.quantity})`)
        )
        .limit(5);
    return {
        stats: {
            revenue: Number(stats.revenue),
            orders: stats.orders,
            customers: Number(stats.customers),
            products: productStats.products,
        },
        revenueSummary: {
            today: Number(today.revenue),
            week: Number(week.revenue),
            month: Number(month.revenue),
            total: Number(stats.revenue),
        },
        orderStatus: {
            pending: pending.count,
            processing: processing.count,
            shipped: shipped.count,
            delivered: delivered.count,
            cancelled: cancelled.count,
        },
        topProducts: topProducts.map((item) => ({
            id: item.id,
            name: item.name,
            sold: Number(item.sold),
            revenue: Number(item.revenue),
        })),
    };
}