
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import OrderStatus from "@/components/seller/analytics/OrderStatus";
import SalesChart from "@/components/seller/analytics/SalesChart";
import StatsCards from "@/components/seller/analytics/stats-cards";
import RevenueSummary from "@/components/seller/analytics/revenue-summary";
import TopProducts from "@/components/seller/analytics/TopProducts";
import LowStockProducts from "@/components/seller/analytics/LowStockProducts";
import RecentOrders from "@/components/seller/analytics/RecentOrders";
import { getSellerAnalytics } from "@/lib/seller/get-seller-analytics";

export default async function SellerAnalyticsPage() {
    const currentSession = await auth.api.getSession({
        headers: await headers(),
    });

    if (!currentSession?.user) {
        notFound();
    }

    const analytics = await getSellerAnalytics(currentSession.user.id);


    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">
                    Analytics
                </h1>

                <p className="text-muted-foreground mt-1">
                    Monitor your store performance.
                </p>
            </div>

            <StatsCards
                revenue={analytics.stats.revenue}
                orders={analytics.stats.orders}
                products={analytics.stats.products}
                customers={analytics.stats.customers}
            />

            <RevenueSummary
                today={analytics.revenueSummary.today}
                week={analytics.revenueSummary.week}
                month={analytics.revenueSummary.month}
                total={analytics.revenueSummary.total}
            />
            <OrderStatus
                pending={analytics.orderStatus.pending}
                processing={analytics.orderStatus.processing}
                shipped={analytics.orderStatus.shipped}
                delivered={analytics.orderStatus.delivered}
                cancelled={analytics.orderStatus.cancelled}
            />

            <SalesChart/>
            <div className="grid gap-6 xl:grid-cols-2">
                <TopProducts/>

                <LowStockProducts/>
            </div>

            <RecentOrders/>
        </div>
    );
}