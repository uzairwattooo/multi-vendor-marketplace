import {
    BadgeDollarSign,
    Boxes,
    CircleDollarSign,
    ReceiptText,
} from "lucide-react";

import AdminReportCharts from "@/components/admin/reports/AdminReportCharts";
import AdminStatCard from "@/components/admin/AdminStatCard";
import { buttonVariants } from "@/components/ui/button";
import { getAdminReports } from "@/lib/admin/get-admin-reports";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function readParam(value: string | string[] | undefined) {
    return Array.isArray(value) ? value[0] : value;
}

function money(value: number) {
    return new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        maximumFractionDigits: 0,
    }).format(value);
}

export default async function AdminReportsPage({ searchParams }: Props) {
    const params = await searchParams;
    const range = readParam(params.range) ?? "30";
    const dateFrom = readParam(params.dateFrom) ?? "";
    const dateTo = readParam(params.dateTo) ?? "";
    const days = range === "7" || range === "90" ? Number(range) : 30;

    const report = await getAdminReports({
        days,
        dateFrom,
        dateTo,
    });

    return (
        <div className="space-y-8 overflow-x-hidden">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                        Marketplace insights
                    </p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                        Reports
                    </h1>
                    <p className="mt-2 max-w-3xl text-muted-foreground">
                        Analyze paid sales, platform commission, order trends
                        and seller and product performance.
                    </p>
                </div>

                <form className="grid gap-2 rounded-2xl border bg-card p-3 shadow-sm sm:grid-cols-[150px_160px_160px_auto]">
                    <select
                        name="range"
                        defaultValue={range}
                        className="h-10 rounded-xl border bg-background px-3 text-sm outline-none"
                    >
                        <option value="7">Last 7 days</option>
                        <option value="30">Last 30 days</option>
                        <option value="90">Last 90 days</option>
                    </select>
                    <input
                        type="date"
                        name="dateFrom"
                        defaultValue={dateFrom}
                        aria-label="Report start date"
                        className="h-10 rounded-xl border bg-background px-3 text-sm outline-none"
                    />
                    <input
                        type="date"
                        name="dateTo"
                        defaultValue={dateTo}
                        aria-label="Report end date"
                        className="h-10 rounded-xl border bg-background px-3 text-sm outline-none"
                    />
                    <button
                        type="submit"
                        className={cn(buttonVariants(), "h-10 rounded-xl px-5")}
                    >
                        Generate
                    </button>
                </form>
            </div>

            <p className="-mt-5 text-sm text-muted-foreground">
                Reporting period: {report.period.label}
            </p>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <AdminStatCard
                    title="Paid sales"
                    value={money(report.stats.paidSales)}
                    description={`${report.stats.paidOrders.toLocaleString()} successfully paid orders`}
                    icon={CircleDollarSign}
                    accent="success"
                />
                <AdminStatCard
                    title="Platform revenue"
                    value={money(report.stats.platformRevenue)}
                    description="Commission earned in this period"
                    icon={BadgeDollarSign}
                />
                <AdminStatCard
                    title="Total orders"
                    value={report.stats.totalOrders.toLocaleString()}
                    description={`${report.stats.deliveredOrders.toLocaleString()} delivered orders`}
                    icon={Boxes}
                    accent="blue"
                />
                <AdminStatCard
                    title="Average order value"
                    value={money(report.stats.averageOrderValue)}
                    description="Average across paid orders"
                    icon={ReceiptText}
                    accent="warning"
                />
            </section>

            <AdminReportCharts
                salesTrend={report.salesTrend}
                orderStatuses={report.orderStatuses}
            />

            <section className="grid gap-5 xl:grid-cols-2">
                <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
                    <div className="border-b px-5 py-4">
                        <h2 className="font-semibold">Top stores</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Ranked by paid sales in this period
                        </p>
                    </div>
                    <div className="divide-y">
                        {report.topStores.map((item, index) => (
                            <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold">
                                    {index + 1}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-medium">{item.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {item.orders.toLocaleString()} paid orders
                                    </p>
                                </div>
                                <p className="font-semibold">{money(item.sales)}</p>
                            </div>
                        ))}
                        {report.topStores.length === 0 && (
                            <p className="px-5 py-10 text-center text-sm text-muted-foreground">
                                No paid store sales in this period.
                            </p>
                        )}
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
                    <div className="border-b px-5 py-4">
                        <h2 className="font-semibold">Top products</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Ranked by units sold from paid orders
                        </p>
                    </div>
                    <div className="divide-y">
                        {report.topProducts.map((item, index) => (
                            <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold">
                                    {index + 1}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-medium">{item.name}</p>
                                    <p className="truncate text-xs text-muted-foreground">
                                        {item.storeName} · {item.units.toLocaleString()} units
                                    </p>
                                </div>
                                <p className="font-semibold">{money(item.revenue)}</p>
                            </div>
                        ))}
                        {report.topProducts.length === 0 && (
                            <p className="px-5 py-10 text-center text-sm text-muted-foreground">
                                No paid product sales in this period.
                            </p>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}