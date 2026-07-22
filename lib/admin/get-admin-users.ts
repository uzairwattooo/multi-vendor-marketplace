import {
    and,
    asc,
    count,
    desc,
    eq,
    ilike,
    isNull,
    or,
    sql,
    type SQL,
} from "drizzle-orm";

import { db } from "@/db";
import { order, session, store, user } from "@/db/schema";

export const ADMIN_USERS_PAGE_SIZE = 12;

export type AdminUsersFilters = {
    query?: string;
    role?: "all" | "buyer" | "seller" | "admin";
    status?: "all" | "active" | "banned";
    verification?: "all" | "verified" | "unverified";
    sort?: "newest" | "oldest" | "name";
    page?: number;
};

export async function getAdminUsers(
    filters: AdminUsersFilters,
) {
    const page = Math.max(1, filters.page ?? 1);
    const conditions: SQL<unknown>[] = [];

    if (filters.query) {
        const searchCondition = or(
            ilike(user.name, `%${filters.query}%`),
            ilike(user.email, `%${filters.query}%`),
            ilike(user.phone, `%${filters.query}%`),
        );

        if (searchCondition) {
            conditions.push(searchCondition);
        }
    }

    if (filters.role && filters.role !== "all") {
        conditions.push(eq(user.role, filters.role));
    }

    if (filters.status === "banned") {
        conditions.push(eq(user.banned, true));
    }

    if (filters.status === "active") {
        const activeCondition = or(
            eq(user.banned, false),
            isNull(user.banned),
        );

        if (activeCondition) {
            conditions.push(activeCondition);
        }
    }

    if (filters.verification === "verified") {
        conditions.push(eq(user.emailVerified, true));
    }

    if (filters.verification === "unverified") {
        conditions.push(eq(user.emailVerified, false));
    }

    const whereClause =
        conditions.length > 0 ? and(...conditions) : undefined;

    const orderBy =
        filters.sort === "oldest"
            ? asc(user.createdAt)
            : filters.sort === "name"
              ? asc(user.name)
              : desc(user.createdAt);

    const [rows, totalResult, statsResult] = await Promise.all([
        db
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
                storeId: store.id,
                storeName: store.name,
                storeStatus: store.status,
                orderCount: sql<number>`(
                    SELECT COUNT(*)
                    FROM ${order}
                    WHERE ${order.buyerId} = ${user.id}
                )`,
                activeSessions: sql<number>`(
                    SELECT COUNT(*)
                    FROM ${session}
                    WHERE ${session.userId} = ${user.id}
                    AND ${session.expiresAt} > NOW()
                )`,
            })
            .from(user)
            .leftJoin(store, eq(store.ownerId, user.id))
            .where(whereClause)
            .orderBy(orderBy)
            .limit(ADMIN_USERS_PAGE_SIZE)
            .offset((page - 1) * ADMIN_USERS_PAGE_SIZE),

        db
            .select({ total: count() })
            .from(user)
            .where(whereClause),

        db
            .select({
                total: count(),
                buyers: sql<number>`COUNT(*) FILTER (WHERE ${user.role} = 'buyer')`,
                sellers: sql<number>`COUNT(*) FILTER (WHERE ${user.role} = 'seller')`,
                admins: sql<number>`COUNT(*) FILTER (WHERE ${user.role} = 'admin')`,
                banned: sql<number>`COUNT(*) FILTER (WHERE ${user.banned} = true)`,
            })
            .from(user),
    ]);

    const total = Number(totalResult[0]?.total ?? 0);
    const stats = statsResult[0];

    return {
        users: rows.map((currentUser) => ({
            ...currentUser,
            orderCount: Number(currentUser.orderCount ?? 0),
            activeSessions: Number(currentUser.activeSessions ?? 0),
        })),
        pagination: {
            page,
            pageCount: Math.max(
                1,
                Math.ceil(total / ADMIN_USERS_PAGE_SIZE),
            ),
            total,
        },
        stats: {
            total: Number(stats?.total ?? 0),
            buyers: Number(stats?.buyers ?? 0),
            sellers: Number(stats?.sellers ?? 0),
            admins: Number(stats?.admins ?? 0),
            banned: Number(stats?.banned ?? 0),
        },
    };
}
