import Link from "next/link";
import {
    AlertTriangle,
    ArrowRight,
    BadgeDollarSign,
    Boxes,
    HandCoins,
    Package,
    ReceiptText,
    Store,
    Users,
    WalletCards,
} from "lucide-react";

import AdminStatCard from "@/components/admin/AdminStatCard";
import OrdersChart from "@/components/admin/OrdersChart";
import PendingStoreApplications from "@/components/admin/PendingStoreApplications";
import RecentOrders from "@/components/admin/RecentOrders";
import RevenueChart from "@/components/admin/RevenueChart";
import TopStores from "@/components/admin/TopStores";
import { buttonVariants } from "@/components/ui/button";
import { getAdminDashboard } from "@/lib/admin/get-admin-dashboard";
import { cn } from "@/lib/utils";
export const dynamic = "force-dynamic";
export const revalidate = 0;
function formatMoney(
    value: number,
    currency: string,
) {
    try {
        return new Intl.NumberFormat("en-PK", {
            style: "currency",
            currency: currency.toUpperCase(),
            maximumFractionDigits: 0,
        }).format(value);
    } catch {
        return `${currency.toUpperCase()} ${value.toLocaleString()}`;
    }
}

export default async function AdminDashboardPage() {
    const dashboard = await getAdminDashboard();
    const { stats, currency } = dashboard;

    const statCards = [
        {
            title: "Gross revenue",
            value: formatMoney(
                stats.grossRevenue,
                currency,
            ),
            description:
                "Total value of successfully paid marketplace orders.",
            icon: ReceiptText,
            accent: "primary" as const,
        },
        {
            title: "Platform revenue",
            value: formatMoney(
                stats.platformRevenue,
                currency,
            ),
            description:
                "Commission earned from paid marketplace transactions.",
            icon: BadgeDollarSign,
            accent: "success" as const,
        },
        {
            title: "Seller earnings",
            value: formatMoney(
                stats.sellerEarnings,
                currency,
            ),
            description:
                "Total seller amount recorded on paid payments.",
            icon: HandCoins,
            accent: "blue" as const,
        },
        {
            title: "Pending payouts",
            value: formatMoney(
                stats.pendingPayoutAmount,
                currency,
            ),
            description: `${stats.pendingPayoutOrders.toLocaleString()} paid orders waiting for seller payout.`,
            icon: WalletCards,
            accent: "warning" as const,
        },
        {
            title: "Total orders",
            value: stats.totalOrders.toLocaleString(),
            description: `${stats.deliveredOrders.toLocaleString()} delivered and ${stats.pendingOrders.toLocaleString()} currently pending.`,
            icon: Boxes,
            accent: "primary" as const,
        },
        {
            title: "Marketplace users",
            value: stats.totalUsers.toLocaleString(),
            description: `${stats.buyers.toLocaleString()} buyers and ${stats.sellers.toLocaleString()} sellers.`,
            icon: Users,
            accent: "blue" as const,
        },
        {
            title: "Approved stores",
            value: stats.approvedStores.toLocaleString(),
            description: `${stats.pendingStores.toLocaleString()} applications require admin review.`,
            icon: Store,
            accent: "success" as const,
        },
        {
            title: "Low stock alerts",
            value: stats.lowStockProducts.toLocaleString(),
            description: `${stats.activeProducts.toLocaleString()} active products across approved stores.`,
            icon: AlertTriangle,
            accent:
                stats.lowStockProducts > 0
                    ? ("danger" as const)
                    : ("success" as const),
        },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                        Marketplace administration
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                        Admin dashboard
                    </h1>

                    <p className="mt-2 max-w-2xl text-muted-foreground">
                        Monitor users, stores, products, orders,
                        revenue and seller payouts from one control
                        center.
                    </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                    <Link
                        href="/admin/stores"
                        className={cn(
                            buttonVariants({
                                variant: "outline",
                                size: "lg",
                            }),
                            "h-11 gap-2 rounded-xl px-5",
                        )}
                    >
                        Review Stores
                        <ArrowRight className="size-4" />
                    </Link>

                    <Link
                        href="/admin/products"
                        className={cn(
                            buttonVariants({
                                size: "lg",
                            }),
                            "h-11 gap-2 rounded-xl px-5",
                        )}
                    >
                        Manage Products
                        <Package className="size-4" />
                    </Link>
                </div>
            </div>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {statCards.map((card) => (
                    <AdminStatCard
                        key={card.title}
                        {...card}
                    />
                ))}
            </section>

            <section className="grid gap-5 xl:grid-cols-[1.45fr_0.85fr]">
                <RevenueChart
                    data={dashboard.revenueChart}
                    currency={currency}
                />

                <OrdersChart
                    data={dashboard.orderStatusChart}
                />
            </section>

            <section className="grid gap-5 2xl:grid-cols-[1.45fr_0.85fr]">
                <RecentOrders
                    orders={dashboard.recentOrders}
                    currency={currency}
                />

                <PendingStoreApplications
                    stores={dashboard.pendingStores}
                />
            </section>

            <TopStores
                stores={dashboard.topStores}
                currency={currency}
            />
        </div>
    );
}
