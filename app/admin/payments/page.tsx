import {CircleDollarSign,Clock3,HandCoins,ReceiptText,RotateCcw,TriangleAlert,} from "lucide-react";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminPaymentsTable from "@/components/admin/payments/AdminPaymentsTable";
import { buttonVariants } from "@/components/ui/button";
import { getAdminPayments } from "@/lib/admin/get-admin-payments";
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

export default async function AdminPaymentsPage({
    searchParams,
}: Props) {
    const params = await searchParams;
    const query = readParam(params.q)?.trim() ?? "";
    const provider = readParam(params.provider) ?? "all";
    const status = readParam(params.status) ?? "all";
    const dateFrom = readParam(params.dateFrom) ?? "";
    const dateTo = readParam(params.dateTo) ?? "";
    const sort = readParam(params.sort) ?? "newest";
    const page = Number(readParam(params.page) ?? 1);

    const result = await getAdminPayments({
        query,
        provider:
            provider === "stripe" || provider === "cod"
                ? provider
                : "all",
        status:
            status === "pending" ||
                status === "paid" ||
                status === "failed" ||
                status === "refunded"
                ? status
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
                    Financial operations
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight">
                    Payments
                </h1>
                <p className="mt-2 max-w-3xl text-muted-foreground">
                    Track Stripe and Cash on Delivery collections, marketplace
                    commission and seller earnings from one ledger.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <AdminStatCard
                    title="Processed volume"
                    value={money(result.stats.totalProcessed)}
                    description={`${result.stats.paidCount.toLocaleString()} successful payments`}
                    icon={CircleDollarSign}
                    accent="success"
                />
                <AdminStatCard
                    title="Platform revenue"
                    value={money(result.stats.platformRevenue)}
                    description="Commission from paid orders"
                    icon={ReceiptText}
                />
                <AdminStatCard
                    title="Seller share"
                    value={money(result.stats.sellerShare)}
                    description="Earnings allocated to sellers"
                    icon={HandCoins}
                    accent="blue"
                />
                <AdminStatCard
                    title="Pending amount"
                    value={money(result.stats.pendingAmount)}
                    description={`${result.stats.pendingCount.toLocaleString()} awaiting payments`}
                    icon={Clock3}
                    accent="warning"
                />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-sm">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                        <TriangleAlert className="size-5" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Failed payments
                        </p>
                        <p className="text-xl font-bold">
                            {result.stats.failedCount.toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-sm">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600">
                        <RotateCcw className="size-5" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Refunded payments
                        </p>
                        <p className="text-xl font-bold">
                            {result.stats.refundedCount.toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            <form className="grid gap-3 rounded-3xl border bg-card p-4 shadow-sm xl:grid-cols-[minmax(260px,1fr)_170px_160px_160px_160px_180px_auto] overflow-x-auto hide-scrollbar">
                <input
                    type="search"
                    name="q"
                    defaultValue={query}
                    placeholder="Transaction, order, buyer or store..."
                    className="h-10 rounded-xl border bg-background px-3 text-sm outline-none focus:border-primary/50 focus:ring-3 focus:ring-primary/10"
                />
                <select
                    name="provider"
                    defaultValue={provider}
                    className="h-10 rounded-xl border bg-background px-3 text-sm outline-none"
                >
                    <option value="all">All methods</option>
                    <option value="stripe">Stripe</option>
                    <option value="cod">Cash on delivery</option>
                </select>
                <select
                    name="status"
                    defaultValue={status}
                    className="h-10 rounded-xl border bg-background px-3 text-sm outline-none"
                >
                    <option value="all">All statuses</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
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

            <AdminPaymentsTable payments={result.payments} />

            <AdminPagination
                page={result.pagination.page}
                pageCount={result.pagination.pageCount}
                total={result.pagination.total}
                pathname="/admin/payments"
                searchParams={{
                    q: query || undefined,
                    provider,
                    status,
                    dateFrom: dateFrom || undefined,
                    dateTo: dateTo || undefined,
                    sort,
                }}
            />
        </div>
    );
}