import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import {order,session,store,user,wishlist,} from "@/db/schema";

export async function getAdminUserDetails(userId: string) {
    const [profile] = await db
        .select({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            image: user.image,
            role: user.role,
            emailVerified: user.emailVerified,
            banned: user.banned,
            banReason: user.banReason,
            banExpires: user.banExpires,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            storeId: store.id,
            storeName: store.name,
            storeSlug: store.slug,
            storeStatus: store.status,
        })
        .from(user)
        .leftJoin(store, eq(store.ownerId, user.id))
        .where(eq(user.id, userId))
        .limit(1);

    if (!profile) {
        return null;
    }

    const [statsResult, sessions, recentOrders] = await Promise.all([
        db
            .select({
                orderCount: sql<number>`(
                    SELECT COUNT(*)
                    FROM ${order}
                    WHERE ${order.buyerId} = ${userId}
                )`,
                totalSpent: sql<string>`(
                    SELECT COALESCE(SUM(${order.totalAmount}), 0)
                    FROM ${order}
                    WHERE ${order.buyerId} = ${userId}
                    AND ${order.paymentStatus} = 'paid'
                )`,
                wishlistCount: sql<number>`(
                    SELECT COUNT(*)
                    FROM ${wishlist}
                    WHERE ${wishlist.userId} = ${userId}
                )`,
                sessionCount: sql<number>`(
                    SELECT COUNT(*)
                    FROM ${session}
                    WHERE ${session.userId} = ${userId}
                    AND ${session.expiresAt} > NOW()
                )`,
            })
            .from(user)
            .where(eq(user.id, userId)),

        db
            .select({
                id: session.id,
                ipAddress: session.ipAddress,
                userAgent: session.userAgent,
                createdAt: session.createdAt,
                updatedAt: session.updatedAt,
                expiresAt: session.expiresAt,
            })
            .from(session)
            .where(eq(session.userId, userId))
            .orderBy(desc(session.updatedAt))
            .limit(10),

        db
            .select({
                id: order.id,
                orderNumber: order.orderNumber,
                status: order.status,
                paymentStatus: order.paymentStatus,
                paymentMethod: order.paymentMethod,
                totalAmount: order.totalAmount,
                createdAt: order.createdAt,
                storeName: store.name,
            })
            .from(order)
            .innerJoin(store, eq(store.id, order.storeId))
            .where(eq(order.buyerId, userId))
            .orderBy(desc(order.createdAt))
            .limit(8),
    ]);

    const stats = statsResult[0];

    return {
        profile,
        stats: {
            orderCount: Number(stats?.orderCount ?? 0),
            totalSpent: Number(stats?.totalSpent ?? 0),
            wishlistCount: Number(stats?.wishlistCount ?? 0),
            sessionCount: Number(stats?.sessionCount ?? 0),
        },
        sessions,
        recentOrders,
    };
}
