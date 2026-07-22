import {
    Ban,
    CheckCircle2,
    Clock3,
    CreditCard,
    Store,
    XCircle,
} from "lucide-react";

import AdminPagination from "@/components/admin/AdminPagination";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminStoresTable from "@/components/admin/stores/AdminStoresTable";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAdminStores } from "@/lib/admin/get-admin-stores";

function readParam(
    value: string | string[] | undefined,
) {
    return Array.isArray(value) ? value[0] : value;
}

type AdminStoresPageProps = {
    searchParams: Promise<
        Record<string, string | string[] | undefined>
    >;
};

export default async function AdminStoresPage({
    searchParams,
}: AdminStoresPageProps) {
    const rawParams = await searchParams;

    const query = readParam(rawParams.q)?.trim() ?? "";
    const status = readParam(rawParams.status) ?? "all";
    const stripe = readParam(rawParams.stripe) ?? "all";
    const sort = readParam(rawParams.sort) ?? "newest";
    const page = Number(readParam(rawParams.page) ?? 1);

    const result = await getAdminStores({
        query,
        status:
            status === "pending" ||
            status === "approved" ||
            status === "rejected" ||
            status === "suspended"
                ? status
                : "all",
        stripe:
            stripe === "connected" ||
            stripe === "not_connected"
                ? stripe
                : "all",
        sort:
            sort === "oldest" ||
            sort === "name" ||
            sort === "revenue"
                ? sort
                : "newest",
        page: Number.isFinite(page) ? page : 1,
    });

    return (
        <div className="space-y-8">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                    Store management
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight">
                    Marketplace stores
                </h1>
                <p className="mt-2 max-w-2xl text-muted-foreground">
                    Review applications, monitor seller performance,
                    inspect Stripe readiness and suspend or restore stores.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
                <AdminStatCard
                    title="All Stores"
                    value={result.stats.total.toLocaleString()}
                    description="Every store application"
                    icon={Store}
                />
                <AdminStatCard
                    title="Pending"
                    value={result.stats.pending.toLocaleString()}
                    description="Waiting for review"
                    icon={Clock3}
                    accent="warning"
                />
                <AdminStatCard
                    title="Approved"
                    value={result.stats.approved.toLocaleString()}
                    description="Live marketplace stores"
                    icon={CheckCircle2}
                    accent="success"
                />
                <AdminStatCard
                    title="Rejected"
                    value={result.stats.rejected.toLocaleString()}
                    description="Declined applications"
                    icon={XCircle}
                    accent="danger"
                />
                <AdminStatCard
                    title="Suspended"
                    value={result.stats.suspended.toLocaleString()}
                    description="Hidden by moderation"
                    icon={Ban}
                    accent="danger"
                />
                <AdminStatCard
                    title="Stripe Connected"
                    value={result.stats.stripeConnected.toLocaleString()}
                    description="Connected seller accounts"
                    icon={CreditCard}
                    accent="blue"
                />
            </div>

            <form className="grid gap-3 rounded-3xl border bg-card p-4 shadow-sm lg:grid-cols-[minmax(260px,1fr)_190px_190px_190px_auto]">
                <input
                    type="search"
                    name="q"
                    defaultValue={query}
                    placeholder="Search store, owner, email or phone..."
                    className="h-10 rounded-xl border bg-background px-3 text-sm outline-none focus:border-primary/50 focus:ring-3 focus:ring-primary/10"
                />

                <select
                    name="status"
                    defaultValue={status}
                    className="h-10 rounded-xl border bg-background px-3 text-sm outline-none"
                >
                    <option value="all">All statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="suspended">Suspended</option>
                </select>

                <select
                    name="stripe"
                    defaultValue={stripe}
                    className="h-10 rounded-xl border bg-background px-3 text-sm outline-none"
                >
                    <option value="all">All Stripe states</option>
                    <option value="connected">Connected</option>
                    <option value="not_connected">Not connected</option>
                </select>

                <select
                    name="sort"
                    defaultValue={sort}
                    className="h-10 rounded-xl border bg-background px-3 text-sm outline-none"
                >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="name">Name A–Z</option>
                    <option value="revenue">Highest revenue</option>
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

            <AdminStoresTable stores={result.stores} />

            <AdminPagination
                page={result.pagination.page}
                pageCount={result.pagination.pageCount}
                total={result.pagination.total}
                pathname="/admin/stores"
                searchParams={{
                    q: query || undefined,
                    status,
                    stripe,
                    sort,
                }}
            />
        </div>
    );
}
