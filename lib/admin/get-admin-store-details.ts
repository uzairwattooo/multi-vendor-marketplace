import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { order, payment, product, store, user,} from "@/db/schema";

export async function getAdminStoreDetails(storeId: string) {
    const [storeProfile] = await db
        .select({
            id: store.id,
            ownerId: store.ownerId,
            name: store.name,
            slug: store.slug,
            description: store.description,
            category: store.category,
            email: store.email,
            phone: store.phone,
            businessType: store.businessType,
            businessName: store.businessName,
            registrationNumber: store.registrationNumber,
            ntn: store.ntn,
            strn: store.strn,
            logo: store.logo,
            banner: store.banner,
            address: store.address,
            city: store.city,
            state: store.state,
            postalCode: store.postalCode,
            landmark: store.landmark,
            mapsUrl: store.mapsUrl,
            country: store.country,
            status: store.status,
            rejectionReason: store.rejectionReason,
            stripeAccountId: store.stripeAccountId,
            isStripeConnected: store.isStripeConnected,
            stripeChargesEnabled: store.stripeChargesEnabled,
            stripePayoutsEnabled: store.stripePayoutsEnabled,
            stripeDetailsSubmitted: store.stripeDetailsSubmitted,
            createdAt: store.createdAt,
            updatedAt: store.updatedAt,
            ownerName: user.name,
            ownerEmail: user.email,
            ownerPhone: user.phone,
            ownerRole: user.role,
            ownerBanned: user.banned,
            ownerEmailVerified: user.emailVerified,
        })
        .from(store)
        .innerJoin(user, eq(user.id, store.ownerId))
        .where(eq(store.id, storeId))
        .limit(1);

    if (!storeProfile) {
        return null;
    }

    const [metricsResult, recentOrders, recentProducts] =
        await Promise.all([
            db
                .select({
                    products: sql<number>`(
                        SELECT COUNT(*)
                        FROM ${product}
                        WHERE ${product.storeId} = ${storeId}
                    )`,
                    activeProducts: sql<number>`(
                        SELECT COUNT(*)
                        FROM ${product}
                        WHERE ${product.storeId} = ${storeId}
                        AND ${product.status} = 'active'
                    )`,
                    lowStockProducts: sql<number>`(
                        SELECT COUNT(*)
                        FROM ${product}
                        WHERE ${product.storeId} = ${storeId}
                        AND ${product.stock} <= ${product.lowStockThreshold}
                        AND ${product.status} != 'archived'
                    )`,
                    orders: sql<number>`(
                        SELECT COUNT(*)
                        FROM ${order}
                        WHERE ${order.storeId} = ${storeId}
                    )`,
                    deliveredOrders: sql<number>`(
                        SELECT COUNT(*)
                        FROM ${order}
                        WHERE ${order.storeId} = ${storeId}
                        AND ${order.status} = 'delivered'
                    )`,
                    grossRevenue: sql<string>`(
                        SELECT COALESCE(SUM(${order.totalAmount}), 0)
                        FROM ${order}
                        WHERE ${order.storeId} = ${storeId}
                        AND ${order.paymentStatus} = 'paid'
                    )`,
                    platformFees: sql<string>`(
                        SELECT COALESCE(SUM(${payment.platformFee}), 0)
                        FROM ${payment}
                        INNER JOIN ${order}
                            ON ${order.id} = ${payment.orderId}
                        WHERE ${order.storeId} = ${storeId}
                        AND ${payment.status} = 'paid'
                    )`,
                    sellerEarnings: sql<string>`(
                        SELECT COALESCE(SUM(${payment.sellerAmount}), 0)
                        FROM ${payment}
                        INNER JOIN ${order}
                            ON ${order.id} = ${payment.orderId}
                        WHERE ${order.storeId} = ${storeId}
                        AND ${payment.status} = 'paid'
                    )`,
                    pendingPayout: sql<string>`(
                        SELECT COALESCE(SUM(${payment.sellerAmount}), 0)
                        FROM ${payment}
                        INNER JOIN ${order}
                            ON ${order.id} = ${payment.orderId}
                        WHERE ${order.storeId} = ${storeId}
                        AND ${payment.status} = 'paid'
                        AND ${payment.sellerPayoutStatus} = 'pending'
                    )`,
                })
                .from(store)
                .where(eq(store.id, storeId)),

            db
                .select({
                    id: order.id,
                    orderNumber: order.orderNumber,
                    buyerName: user.name,
                    status: order.status,
                    paymentStatus: order.paymentStatus,
                    paymentMethod: order.paymentMethod,
                    totalAmount: order.totalAmount,
                    createdAt: order.createdAt,
                })
                .from(order)
                .innerJoin(user, eq(user.id, order.buyerId))
                .where(eq(order.storeId, storeId))
                .orderBy(desc(order.createdAt))
                .limit(8),

            db
                .select({
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    sku: product.sku,
                    category: product.category,
                    price: product.price,
                    salePrice: product.salePrice,
                    stock: product.stock,
                    lowStockThreshold: product.lowStockThreshold,
                    status: product.status,
                    featured: product.featured,
                    createdAt: product.createdAt,
                })
                .from(product)
                .where(eq(product.storeId, storeId))
                .orderBy(desc(product.createdAt))
                .limit(8),
        ]);

    const metrics = metricsResult[0];

    return {
        store: storeProfile,
        metrics: {
            products: Number(metrics?.products ?? 0),
            activeProducts: Number(metrics?.activeProducts ?? 0),
            lowStockProducts: Number(
                metrics?.lowStockProducts ?? 0,
            ),
            orders: Number(metrics?.orders ?? 0),
            deliveredOrders: Number(
                metrics?.deliveredOrders ?? 0,
            ),
            grossRevenue: Number(metrics?.grossRevenue ?? 0),
            platformFees: Number(metrics?.platformFees ?? 0),
            sellerEarnings: Number(metrics?.sellerEarnings ?? 0),
            pendingPayout: Number(metrics?.pendingPayout ?? 0),
        },
        recentOrders,
        recentProducts,
    };
}
