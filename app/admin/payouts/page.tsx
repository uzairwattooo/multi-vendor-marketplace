import {
    CircleAlert,
    CircleCheckBig,
    Clock3,
    LoaderCircle,
} from "lucide-react";

import AdminPagination from "@/components/admin/AdminPagination";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminPayoutsTable from "@/components/admin/payouts/AdminPayoutsTable";
import { buttonVariants } from "@/components/ui/button";
import { getAdminPayouts } from "@/lib/admin/get-admin-payouts";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

type Props = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminPayoutsPage({
    searchParams,
}: Props) {
    const params = await searchParams;
    const query = readParam(params.q)?.trim() ?? "";
    const status = readParam(params.status) ?? "all";
    const connection = readParam(params.connection) ?? "all";
    const dateFrom = readParam(params.dateFrom) ?? "";
    const dateTo = readParam(params.dateTo) ?? "";
    const sort = readParam(params.sort) ?? "newest";
    const page = Number(readParam(params.page) ?? 1);

    const result = await getAdminPayouts({
        query,
        status:
            status === "pending" ||
                status === "processing" ||
                status === "paid"
                ? status
                : "all",
        connection:
            connection === "ready" || connection === "not_ready"
                ? connection
                : "all",
        dateFrom,
        dateTo,
        sort:
            sort === "oldest" ||
                sort === "amount_high" ||
                sort === "amount_low"
                ? sort
                : "newest",
        page: Number.isFinite(page) ? page : 1,
    });

    return (
        <div className="space-y-8 overflow-x-hidden">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                    Seller finance
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight">
                    Payouts
                </h1>
                <p className="mt-2 max-w-3xl text-muted-foreground">
                    Review seller balances, Stripe Connect readiness and
                    settlement progress for successfully paid orders.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <AdminStatCard
                    title="Pending balance"
                    value={money(result.stats.pendingAmount)}
                    description={`${result.stats.pendingCount.toLocaleString()} payouts awaiting settlement`}
                    icon={Clock3}
                    accent="warning"
                />
                <AdminStatCard
                    title="Processing"
                    value={money(result.stats.processingAmount)}
                    description={`${result.stats.processingCount.toLocaleString()} payouts in progress`}
                    icon={LoaderCircle}
                    accent="blue"
                />
                <AdminStatCard
                    title="Total paid out"
                    value={money(result.stats.paidAmount)}
                    description={`${result.stats.paidCount.toLocaleString()} completed payouts`}
                    icon={CircleCheckBig}
                    accent="success"
                />
                <AdminStatCard
                    title="Needs attention"
                    value={result.stats.blockedCount.toLocaleString()}
                    description="Pending payouts without Stripe readiness"
                    icon={CircleAlert}
                    accent="warning"
                />
            </div>

            <form className="grid gap-3 rounded-3xl border bg-card p-4 shadow-sm xl:grid-cols-[minmax(240px,1fr)_160px_170px_155px_155px_180px_auto] overflow-x-auto hide-scrollbar">
                <input
                    type="search"
                    name="q"
                    defaultValue={query}
                    placeholder="Seller, store, order or reference..."
                    className="h-10 rounded-xl border bg-background px-3 text-sm outline-none focus:border-primary/50 focus:ring-3 focus:ring-primary/10"
                />
                <select
                    name="status"
                    defaultValue={status}
                    className="h-10 rounded-xl border bg-background px-3 text-sm outline-none"
                >
                    <option value="all">All payouts</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="paid">Paid</option>
                </select>
                <select
                    name="connection"
                    defaultValue={connection}
                    className="h-10 rounded-xl border bg-background px-3 text-sm outline-none"
                >
                    <option value="all">All Stripe states</option>
                    <option value="ready">Payouts ready</option>
                    <option value="not_ready">Needs setup</option>
                </select>
                <input
                    type="date"
                    name="dateFrom"
                    defaultValue={dateFrom}
                    aria-label="Start date"
                    className="h-10 rounded-xl border bg-background px-3 text-sm outline-none"
                />
                <input
                    type="date"
                    name="dateTo"
                    defaultValue={dateTo}
                    aria-label="End date"
                    className="h-10 rounded-xl border bg-background px-3 text-sm outline-none"
                />
                <select
                    name="sort"
                    defaultValue={sort}
                    className="h-10 rounded-xl border bg-background px-3 text-sm outline-none"
                >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="amount_high">Highest amount</option>
                    <option value="amount_low">Lowest amount</option>
                </select>
                <button
                    type="submit"
                    className={cn(
                        buttonVariants(),
                        "h-10 rounded-xl px-5",
                    )}
                >
                    Apply
                </button>
            </form>

            <AdminPayoutsTable payouts={result.payouts} />

            <AdminPagination
                page={result.pagination.page}
                pageCount={result.pagination.pageCount}
                total={result.pagination.total}
                pathname="/admin/payouts"
                searchParams={{
                    q: query || undefined,
                    status,
                    connection,
                    dateFrom: dateFrom || undefined,
                    dateTo: dateTo || undefined,
                    sort,
                }}
            />
        </div>
    );
}