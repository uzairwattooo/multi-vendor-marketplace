import {
    Ban,
    CheckCircle2,
    Clock3,
    PackageCheck,
    ReceiptText,
    RotateCcw,
    Truck,
} from "lucide-react";

import AdminPagination from "@/components/admin/AdminPagination";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminOrdersTable from "@/components/admin/orders/AdminOrdersTable";
import { buttonVariants } from "@/components/ui/button";
import { getAdminOrders } from "@/lib/admin/get-admin-orders";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function readParam(value: string | string[] | undefined) {
    return Array.isArray(value) ? value[0] : value;
}

type Props = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminOrdersPage({ searchParams }: Props) {
    const params = await searchParams;
    const query = readParam(params.q)?.trim() ?? "";
    const status = readParam(params.status) ?? "all";
    const paymentMethod = readParam(params.paymentMethod) ?? "all";
    const paymentStatus = readParam(params.paymentStatus) ?? "all";
    const storeId = readParam(params.store) ?? "all";
    const dateFrom = readParam(params.dateFrom) ?? "";
    const dateTo = readParam(params.dateTo) ?? "";
    const sort = readParam(params.sort) ?? "newest";
    const page = Number(readParam(params.page) ?? 1);

    const validStatuses = [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
    ] as const;
    const result = await getAdminOrders({
        query,
        status: validStatuses.includes(status as (typeof validStatuses)[number])
            ? (status as (typeof validStatuses)[number])
            : "all",
        paymentMethod:
            paymentMethod === "stripe" || paymentMethod === "cod"
                ? paymentMethod
                : "all",
        paymentStatus:
            paymentStatus === "pending" ||
                paymentStatus === "paid" ||
                paymentStatus === "failed" ||
                paymentStatus === "refunded"
                ? paymentStatus
                : "all",
        storeId,
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
                    Order operations
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight">
                    Marketplace orders
                </h1>
                <p className="mt-2 max-w-3xl text-muted-foreground">
                    Track buyer orders, seller fulfilment, payments and
                    commission from one operational view.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-7">
                <AdminStatCard title="Total orders" value={result.stats.total.toLocaleString()} description="All marketplace orders" icon={ReceiptText} />
                <AdminStatCard title="Pending" value={result.stats.pending.toLocaleString()} description="Awaiting confirmation" icon={Clock3} accent="warning" />
                <AdminStatCard title="Processing" value={result.stats.processing.toLocaleString()} description="Confirmed or processing" icon={PackageCheck} accent="blue" />
                <AdminStatCard title="Shipped" value={result.stats.shipped.toLocaleString()} description="In transit" icon={Truck} accent="blue" />
                <AdminStatCard title="Delivered" value={result.stats.delivered.toLocaleString()} description="Successfully fulfilled" icon={CheckCircle2} accent="success" />
                <AdminStatCard title="Cancelled" value={result.stats.cancelled.toLocaleString()} description="Cancelled orders" icon={Ban} accent="danger" />
                <AdminStatCard title="Refunded" value={result.stats.refunded.toLocaleString()} description="Returned payments" icon={RotateCcw} accent="warning" />
            </div>

            <form className="grid gap-3 rounded-3xl border bg-card p-4 shadow-sm xl:grid-cols-[minmax(240px,1fr)_150px_160px_160px_180px_150px_150px_170px_auto] overflow-x-auto hide-scrollbar">
                <input type="search" name="q" defaultValue={query} placeholder="Order, buyer, email or store..." className="h-10 rounded-xl border bg-background px-3 text-sm outline-none focus:border-primary/50 focus:ring-3 focus:ring-primary/10" />
                <select name="status" defaultValue={status} className="h-10 rounded-xl border bg-background px-3 text-sm outline-none">
                    <option value="all">All statuses</option>
                    {validStatuses.map((value) => <option key={value} value={value}>{value.replaceAll("_", " ")}</option>)}
                </select>
                <select name="paymentMethod" defaultValue={paymentMethod} className="h-10 rounded-xl border bg-background px-3 text-sm outline-none">
                    <option value="all">All methods</option><option value="stripe">Stripe</option><option value="cod">Cash on delivery</option>
                </select>
                <select name="paymentStatus" defaultValue={paymentStatus} className="h-10 rounded-xl border bg-background px-3 text-sm outline-none">
                    <option value="all">All payment states</option><option value="pending">Pending</option><option value="paid">Paid</option><option value="failed">Failed</option><option value="refunded">Refunded</option>
                </select>
                <select name="store" defaultValue={storeId} className="h-10 rounded-xl border bg-background px-3 text-sm outline-none">
                    <option value="all">All stores</option>
                    {result.stores.map((store) => <option key={store.id} value={store.id}>{store.name}</option>)}
                </select>
                <input type="date" name="dateFrom" defaultValue={dateFrom} aria-label="Start date" className="h-10 rounded-xl border bg-background px-3 text-sm outline-none" />
                <input type="date" name="dateTo" defaultValue={dateTo} aria-label="End date" className="h-10 rounded-xl border bg-background px-3 text-sm outline-none" />
                <select name="sort" defaultValue={sort} className="h-10 rounded-xl border bg-background px-3 text-sm outline-none">
                    <option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="amount_high">Highest amount</option><option value="amount_low">Lowest amount</option>
                </select>
                <button type="submit" className={cn(buttonVariants(), "h-10 rounded-xl px-5")}>Apply</button>
            </form>

            <AdminOrdersTable orders={result.orders} />
            <AdminPagination
                page={result.pagination.page}
                pageCount={result.pagination.pageCount}
                total={result.pagination.total}
                pathname="/admin/orders"
                searchParams={{ q: query || undefined, status, paymentMethod, paymentStatus, store: storeId, dateFrom: dateFrom || undefined, dateTo: dateTo || undefined, sort }}
            />
        </div>
    );
}
