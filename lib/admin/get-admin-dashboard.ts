import "server-only";
import { and, count, desc, eq, gte, sql, } from "drizzle-orm";
import { user } from "@/auth-schema";
import { db } from "@/db";
import { order, payment, product, store, } from "@/db/schema";

const orderStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded",] as const;

function toNumber(value: unknown) {
    const result = Number(value ?? 0);

    return Number.isFinite(result) ? result : 0;
}

function getMonthKey(date: Date) {
    return `${date.getUTCFullYear()}-${String(
        date.getUTCMonth() + 1,
    ).padStart(2, "0")}`;
}

function getLastSixMonths() {
    const currentDate = new Date();
    const months: Array<{
        key: string;
        label: string;
    }> = [];

    for (let index = 5; index >= 0; index -= 1) {
        const monthDate = new Date(
            Date.UTC(
                currentDate.getUTCFullYear(),
                currentDate.getUTCMonth() - index,
                1,
            ),
        );

        months.push({
            key: getMonthKey(monthDate),
            label: new Intl.DateTimeFormat("en", {
                month: "short",
            }).format(monthDate),
        });
    }

    return months;
}

async function loadAdminDashboard() {
    const sixMonths = getLastSixMonths();

    const chartStartDate = new Date(
        `${sixMonths[0].key}-01T00:00:00.000Z`,
    );

    const [
        userSummaryRows,
        storeSummaryRows,
        productSummaryRows,
        orderSummaryRows,
        financialSummaryRows,
        currencyRows,
        monthlyRevenueRows,
        orderStatusRows,
        recentOrders,
        pendingStores,
        topStoreRows,
    ] = await Promise.all([
        db
            .select({
                totalUsers: count(),
                buyers: sql<string>`
                    COUNT(*) FILTER (
                        WHERE ${user.role} = 'buyer'
                    )
                `,
                sellers: sql<string>`
                    COUNT(*) FILTER (
                        WHERE ${user.role} = 'seller'
                    )
                `,
                bannedUsers: sql<string>`
                    COUNT(*) FILTER (
                        WHERE ${user.banned} = true
                    )
                `,
            })
            .from(user),

        db
            .select({
                totalStores: count(),
                approvedStores: sql<string>`
                    COUNT(*) FILTER (
                        WHERE ${store.status} = 'approved'
                    )
                `,
                pendingStores: sql<string>`
                    COUNT(*) FILTER (
                        WHERE ${store.status} = 'pending'
                    )
                `,
                suspendedStores: sql<string>`
                    COUNT(*) FILTER (
                        WHERE ${store.status} = 'suspended'
                    )
                `,
            })
            .from(store),

        db
            .select({
                totalProducts: count(),
                activeProducts: sql<string>`
                    COUNT(*) FILTER (
                        WHERE ${product.status} = 'active'
                    )
                `,
                featuredProducts: sql<string>`
                    COUNT(*) FILTER (
                        WHERE ${product.featured} = true
                    )
                `,
                lowStockProducts: sql<string>`
                    COUNT(*) FILTER (
                        WHERE
                            ${product.status} = 'active'
                            AND ${product.stock} <= ${product.lowStockThreshold}
                    )
                `,
            })
            .from(product),

        db
            .select({
                totalOrders: count(),
                deliveredOrders: sql<string>`
                    COUNT(*) FILTER (
                        WHERE ${order.status} = 'delivered'
                    )
                `,
                paidOrders: sql<string>`
                    COUNT(*) FILTER (
                        WHERE ${order.paymentStatus} = 'paid'
                    )
                `,
                pendingOrders: sql<string>`
                    COUNT(*) FILTER (
                        WHERE ${order.status} = 'pending'
                    )
                `,
            })
            .from(order),

        db
            .select({
                grossRevenue: sql<string>`
                    COALESCE(
                        SUM(
                            CASE
                                WHEN ${payment.status} = 'paid'
                                THEN ${payment.amount}
                                ELSE 0
                            END
                        ),
                        0
                    )
                `,
                platformRevenue: sql<string>`
                    COALESCE(
                        SUM(
                            CASE
                                WHEN ${payment.status} = 'paid'
                                THEN ${payment.platformFee}
                                ELSE 0
                            END
                        ),
                        0
                    )
                `,
                sellerEarnings: sql<string>`
                    COALESCE(
                        SUM(
                            CASE
                                WHEN ${payment.status} = 'paid'
                                THEN ${payment.sellerAmount}
                                ELSE 0
                            END
                        ),
                        0
                    )
                `,
                pendingPayoutAmount: sql<string>`
                    COALESCE(
                        SUM(
                            CASE
                                WHEN
                                    ${payment.status} = 'paid'
                                    AND ${payment.sellerPayoutStatus} = 'pending'
                                THEN ${payment.sellerAmount}
                                ELSE 0
                            END
                        ),
                        0
                    )
                `,
                pendingPayoutOrders: sql<string>`
                    COUNT(*) FILTER (
                        WHERE
                            ${payment.status} = 'paid'
                            AND ${payment.sellerPayoutStatus} = 'pending'
                    )
                `,
            })
            .from(payment),

        db
            .select({
                currency: order.currency,
                total: count(),
            })
            .from(order)
            .groupBy(order.currency)
            .orderBy(desc(count()))
            .limit(1),

        db
            .select({
                month: sql<string>`
                    TO_CHAR(
                        DATE_TRUNC(
                            'month',
                            ${payment.createdAt}
                        ),
                        'YYYY-MM'
                    )
                `,
                revenue: sql<string>`
                    COALESCE(SUM(${payment.amount}), 0)
                `,
                platformFee: sql<string>`
                    COALESCE(SUM(${payment.platformFee}), 0)
                `,
            })
            .from(payment)
            .where(
                and(
                    eq(payment.status, "paid"),
                    gte(payment.createdAt, chartStartDate),
                ),
            )
            .groupBy(
                sql`
                    DATE_TRUNC(
                        'month',
                        ${payment.createdAt}
                    )
                `,
            )
            .orderBy(
                sql`
                    DATE_TRUNC(
                        'month',
                        ${payment.createdAt}
                    )
                `,
            ),

        db
            .select({
                status: order.status,
                total: count(),
            })
            .from(order)
            .groupBy(order.status),

        db
            .select({
                id: order.id,
                orderNumber: order.orderNumber,
                buyerName: user.name,
                storeName: store.name,
                totalAmount: order.totalAmount,
                status: order.status,
                paymentStatus: order.paymentStatus,
                paymentMethod: order.paymentMethod,
                createdAt: order.createdAt,
            })
            .from(order)
            .innerJoin(
                user,
                eq(order.buyerId, user.id),
            )
            .innerJoin(
                store,
                eq(order.storeId, store.id),
            )
            .orderBy(desc(order.createdAt))
            .limit(6),

        db
            .select({
                id: store.id,
                name: store.name,
                category: store.category,
                ownerName: user.name,
                ownerEmail: user.email,
                city: store.city,
                createdAt: store.createdAt,
            })
            .from(store)
            .innerJoin(
                user,
                eq(store.ownerId, user.id),
            )
            .where(eq(store.status, "pending"))
            .orderBy(desc(store.createdAt))
            .limit(5),

        db
            .select({
                id: store.id,
                name: store.name,
                slug: store.slug,
                orderCount: count(order.id),
                revenue: sql<string>`
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
            .from(store)
            .leftJoin(
                order,
                eq(order.storeId, store.id),
            )
            .where(eq(store.status, "approved"))
            .groupBy(
                store.id,
                store.name,
                store.slug,
            )
            .orderBy(
                desc(
                    sql`
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
                ),
            )
            .limit(5),
    ]);

    const userSummary = userSummaryRows[0];
    const storeSummary = storeSummaryRows[0];
    const productSummary = productSummaryRows[0];
    const orderSummary = orderSummaryRows[0];
    const financialSummary = financialSummaryRows[0];

    const monthlyRevenueMap = new Map(
        monthlyRevenueRows.map((row) => [
            row.month,
            {
                revenue: toNumber(row.revenue),
                platformFee: toNumber(row.platformFee),
            },
        ]),
    );

    const orderStatusMap = new Map(
        orderStatusRows.map((row) => [
            row.status,
            Number(row.total),
        ]),
    );

    const currency =
        currencyRows[0]?.currency?.toUpperCase() ??
        "PKR";

    return {
        currency,

        stats: {
            totalUsers: Number(
                userSummary?.totalUsers ?? 0,
            ),
            buyers: toNumber(userSummary?.buyers),
            sellers: toNumber(userSummary?.sellers),
            bannedUsers: toNumber(
                userSummary?.bannedUsers,
            ),

            totalStores: Number(
                storeSummary?.totalStores ?? 0,
            ),
            approvedStores: toNumber(
                storeSummary?.approvedStores,
            ),
            pendingStores: toNumber(
                storeSummary?.pendingStores,
            ),
            suspendedStores: toNumber(
                storeSummary?.suspendedStores,
            ),

            totalProducts: Number(
                productSummary?.totalProducts ?? 0,
            ),
            activeProducts: toNumber(
                productSummary?.activeProducts,
            ),
            featuredProducts: toNumber(
                productSummary?.featuredProducts,
            ),
            lowStockProducts: toNumber(
                productSummary?.lowStockProducts,
            ),

            totalOrders: Number(
                orderSummary?.totalOrders ?? 0,
            ),
            deliveredOrders: toNumber(
                orderSummary?.deliveredOrders,
            ),
            paidOrders: toNumber(
                orderSummary?.paidOrders,
            ),
            pendingOrders: toNumber(
                orderSummary?.pendingOrders,
            ),

            grossRevenue: toNumber(
                financialSummary?.grossRevenue,
            ),
            platformRevenue: toNumber(
                financialSummary?.platformRevenue,
            ),
            sellerEarnings: toNumber(
                financialSummary?.sellerEarnings,
            ),
            pendingPayoutAmount: toNumber(
                financialSummary?.pendingPayoutAmount,
            ),
            pendingPayoutOrders: toNumber(
                financialSummary?.pendingPayoutOrders,
            ),
        },

        revenueChart: sixMonths.map((month) => {
            const values = monthlyRevenueMap.get(
                month.key,
            );

            return {
                month: month.label,
                revenue: values?.revenue ?? 0,
                platformFee:
                    values?.platformFee ?? 0,
            };
        }),

        orderStatusChart: orderStatuses.map(
            (status) => ({
                status,
                label: status
                    .replaceAll("_", " ")
                    .replace(
                        /\b\w/g,
                        (character) =>
                            character.toUpperCase(),
                    ),
                total:
                    orderStatusMap.get(status) ?? 0,
            }),
        ),

        recentOrders,

        pendingStores,

        topStores: topStoreRows.map(
            (currentStore) => ({
                id: currentStore.id,
                name: currentStore.name,
                slug: currentStore.slug,
                orderCount: Number(
                    currentStore.orderCount,
                ),
                revenue: toNumber(
                    currentStore.revenue,
                ),
            }),
        ),
    };
}

export type AdminDashboardData = Awaited<
    ReturnType<typeof getAdminDashboard>
>;
function getDatabaseErrorCode(
    error: unknown,
) {
    if (
        typeof error !== "object" ||
        error === null
    ) {
        return null;
    }

    const currentError = error as {
        code?: string;
        cause?: {
            code?: string;
        };
    };

    return (
        currentError.cause?.code ??
        currentError.code ??
        null
    );
}

function isTemporaryDatabaseError(
    error: unknown,
) {
    const code =
        getDatabaseErrorCode(error);

    return [
        "ECONNRESET",
        "ETIMEDOUT",
        "ECONNREFUSED",
        "EPIPE",
        "57P01",
        "57P02",
        "57P03",
    ].includes(code ?? "");
}

function wait(milliseconds: number) {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}

export async function getAdminDashboard() {
    const maximumAttempts = 3;

    for (
        let attempt = 1;
        attempt <= maximumAttempts;
        attempt += 1
    ) {
        try {
            return await loadAdminDashboard();
        } catch (error) {
            const shouldRetry =
                isTemporaryDatabaseError(
                    error,
                ) &&
                attempt < maximumAttempts;

            if (!shouldRetry) {
                console.error(
                    "ADMIN_DASHBOARD_QUERY_ERROR:",
                    error,
                );

                throw error;
            }

            console.warn(
                `Database connection reset. Retrying admin dashboard (${attempt}/${maximumAttempts})...`,
            );

            await wait(attempt * 500);
        }
    }

    throw new Error(
        "Unable to load admin dashboard",
    );
}