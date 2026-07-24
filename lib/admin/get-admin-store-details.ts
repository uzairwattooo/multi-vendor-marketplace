import {
    and,
    count,
    desc,
    eq,
    sql,
} from "drizzle-orm";
import { db } from "@/db";
import { order, payment, product, store, user, } from "@/db/schema";

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

    const [
        productMetricsRows,
        orderMetricsRows,
        paymentMetricsRows,
        recentOrders,
        recentProducts,
    ] = await Promise.all([
        db
            .select({
                products: count(),

                activeProducts: sql<string>`
                COUNT(*) FILTER (
                    WHERE ${product.status} = 'active'
                )
            `,

                lowStockProducts: sql<string>`
                COUNT(*) FILTER (
                    WHERE
                        ${product.stock} <= ${product.lowStockThreshold}
                        AND ${product.status} != 'archived'
                )
            `,
            })
            .from(product)
            .where(eq(product.storeId, storeId)),

        db
            .select({
                orders: count(),

                deliveredOrders: sql<string>`
                COUNT(*) FILTER (
                    WHERE ${order.status} = 'delivered'
                )
            `,

                grossRevenue: sql<string>`
                COALESCE(
                    SUM(
                        CASE
                            WHEN ${order.paymentStatus} = 'paid'
                            THEN ${order.totalAmount}
                            ELSE 0
                        END
                    ),
                    0
                )
            `,
            })
            .from(order)
            .where(eq(order.storeId, storeId)),

        db
            .select({
                platformFees: sql<string>`
                COALESCE(
                    SUM(${payment.platformFee}),
                    0
                )
            `,

                sellerEarnings: sql<string>`
                COALESCE(
                    SUM(${payment.sellerAmount}),
                    0
                )
            `,

                pendingPayout: sql<string>`
                COALESCE(
                    SUM(
                        CASE
                            WHEN ${payment.sellerPayoutStatus} = 'pending'
                            THEN ${payment.sellerAmount}
                            ELSE 0
                        END
                    ),
                    0
                )
            `,
            })
            .from(payment)
            .innerJoin(
                order,
                eq(payment.orderId, order.id),
            )
            .where(
                and(
                    eq(order.storeId, storeId),
                    eq(payment.status, "paid"),
                ),
            ),

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
            .innerJoin(
                user,
                eq(user.id, order.buyerId),
            )
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
                lowStockThreshold:
                    product.lowStockThreshold,
                status: product.status,
                featured: product.featured,
                createdAt: product.createdAt,
            })
            .from(product)
            .where(eq(product.storeId, storeId))
            .orderBy(desc(product.createdAt))
            .limit(8),
    ]);

    const productMetrics =
        productMetricsRows[0];

    const orderMetrics =
        orderMetricsRows[0];

    const paymentMetrics =
        paymentMetricsRows[0];

    return {
        store: storeProfile,
        metrics: {
            products: Number(
                productMetrics?.products ?? 0,
            ),

            activeProducts: Number(
                productMetrics?.activeProducts ?? 0,
            ),

            lowStockProducts: Number(
                productMetrics?.lowStockProducts ?? 0,
            ),

            orders: Number(
                orderMetrics?.orders ?? 0,
            ),

            deliveredOrders: Number(
                orderMetrics?.deliveredOrders ?? 0,
            ),

            grossRevenue: Number(
                orderMetrics?.grossRevenue ?? 0,
            ),

            platformFees: Number(
                paymentMetrics?.platformFees ?? 0,
            ),

            sellerEarnings: Number(
                paymentMetrics?.sellerEarnings ?? 0,
            ),

            pendingPayout: Number(
                paymentMetrics?.pendingPayout ?? 0,
            ),
        },
        recentOrders,
        recentProducts,
    };
}
