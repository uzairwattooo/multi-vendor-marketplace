import { asc, desc, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import {
    category,
    inventory,
    order,
    orderItem,
    product,
    productImage,
    store,
    user,
} from "@/db/schema";

export async function getAdminProductDetails(productId: string) {
    const [productRows, images, inventoryRows, metricsRows, recentOrders, categories] =
        await Promise.all([
            db
                .select({
                    id: product.id,
                    storeId: product.storeId,
                    name: product.name,
                    slug: product.slug,
                    description: product.description,
                    category: product.category,
                    brand: product.brand,
                    sku: product.sku,
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
                    ownerId: user.id,
                    ownerName: user.name,
                    ownerEmail: user.email,
                    ownerBanned: user.banned,
                })
                .from(product)
                .innerJoin(store, eq(store.id, product.storeId))
                .innerJoin(user, eq(user.id, store.ownerId))
                .where(eq(product.id, productId))
                .limit(1),

            db
                .select({
                    id: productImage.id,
                    url: productImage.url,
                    altText: productImage.altText,
                    position: productImage.position,
                })
                .from(productImage)
                .where(eq(productImage.productId, productId))
                .orderBy(asc(productImage.position), asc(productImage.createdAt)),

            db
                .select({
                    id: inventory.id,
                    quantity: inventory.quantity,
                    reservedQuantity: inventory.reservedQuantity,
                    lowStockThreshold: inventory.lowStockThreshold,
                    trackQuantity: inventory.trackQuantity,
                    updatedAt: inventory.updatedAt,
                })
                .from(inventory)
                .where(eq(inventory.productId, productId))
                .limit(1),

            db
                .select({
                    orderCount: sql<number>`COUNT(DISTINCT CASE WHEN ${order.status} NOT IN ('cancelled', 'refunded') THEN ${order.id} END)`,
                    unitsSold: sql<number>`COALESCE(SUM(CASE WHEN ${order.status} NOT IN ('cancelled', 'refunded') THEN ${orderItem.quantity} ELSE 0 END), 0)`,
                    paidRevenue: sql<string>`COALESCE(SUM(CASE WHEN ${order.paymentStatus} = 'paid' THEN ${orderItem.totalPrice} ELSE 0 END), 0)`,
                })
                .from(orderItem)
                .innerJoin(order, eq(order.id, orderItem.orderId))
                .where(eq(orderItem.productId, productId)),

            db
                .select({
                    id: order.id,
                    orderNumber: order.orderNumber,
                    status: order.status,
                    paymentStatus: order.paymentStatus,
                    currency: order.currency,
                    totalAmount: order.totalAmount,
                    createdAt: order.createdAt,
                    buyerName: user.name,
                    quantity: orderItem.quantity,
                    lineTotal: orderItem.totalPrice,
                })
                .from(orderItem)
                .innerJoin(order, eq(order.id, orderItem.orderId))
                .innerJoin(user, eq(user.id, order.buyerId))
                .where(eq(orderItem.productId, productId))
                .orderBy(desc(order.createdAt))
                .limit(8),

            db
                .select({
                    id: category.id,
                    name: category.name,
                })
                .from(category)
                .orderBy(asc(category.name)),
        ]);

    const currentProduct = productRows[0];

    if (!currentProduct) {
        return null;
    }

    const metrics = metricsRows[0];
    const inventoryRecord = inventoryRows[0] ?? null;

    return {
        product: currentProduct,
        images,
        inventory: inventoryRecord,
        metrics: {
            orderCount: Number(metrics?.orderCount ?? 0),
            unitsSold: Number(metrics?.unitsSold ?? 0),
            paidRevenue: Number(metrics?.paidRevenue ?? 0),
            availableStock: inventoryRecord
                ? Math.max(
                      0,
                      inventoryRecord.quantity -
                          inventoryRecord.reservedQuantity,
                  )
                : currentProduct.stock,
        },
        recentOrders: recentOrders.map((currentOrder) => ({
            ...currentOrder,
            totalAmount: Number(currentOrder.totalAmount),
            lineTotal: Number(currentOrder.lineTotal),
        })),
        categories,
    };
}

export type AdminProductDetails = NonNullable<
    Awaited<ReturnType<typeof getAdminProductDetails>>
>;
