import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import SalesChart from "@/components/seller/analytics/SalesChart";
import LowStockProducts from "@/components/seller/analytics/LowStockProducts";
import RecentOrders from "@/components/seller/analytics/RecentOrders";
import StatsCards from "@/components/seller/analytics/stats-cards";
import { getSellerAnalytics } from "@/lib/seller/get-seller-analytics";

export default async function SellerDashboardPage() {
    const currentSession = await auth.api.getSession({
        headers: await headers(),
    });

    if (!currentSession?.user) {
        notFound();
    }
    const analytics = await getSellerAnalytics(currentSession.user.id);
    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                        Seller Dashboard
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight">
                        Store Overview
                    </h1>

                    <p className="mt-2 text-muted-foreground">
                        Manage products, orders, inventory and payouts.
                    </p>
                </div>

                <Link
                    href="/seller/products/new"
                    className={cn(
                        buttonVariants({
                            size: "lg",
                        }),
                        "gap-2",
                    )}
                >
                    Add New Product
                    <ArrowRight className="size-4" />
                </Link>
            </div>

            <section >
                <StatsCards
                    revenue={analytics.stats.revenue}
                    orders={analytics.stats.orders}
                    products={analytics.stats.products}
                    customers={analytics.stats.customers}
                />
            </section>
            <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
                <div>
                    <SalesChart/>
                </div>
                <div>
                    <LowStockProducts/>
                </div>
            </section>

            <section>

                <RecentOrders />
            </section>
        </div>
    );
}