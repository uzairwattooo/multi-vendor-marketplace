import {
    Boxes,
    PackageCheck,
    PackageX,
    ShieldAlert,
    Warehouse,
} from "lucide-react";
import Link from "next/link";

import AdminPagination from "@/components/admin/AdminPagination";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminInventoryTable from "@/components/admin/inventory/AdminInventoryTable";
import { buttonVariants } from "@/components/ui/button";
import { getAdminInventory } from "@/lib/admin/get-admin-inventory";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function readParam(value: string | string[] | undefined) {
    return Array.isArray(value) ? value[0] : value;
}

type AdminInventoryPageProps = {
    searchParams: Promise<
        Record<string, string | string[] | undefined>
    >;
};

export default async function AdminInventoryPage({
    searchParams,
}: AdminInventoryPageProps) {
    const rawParams = await searchParams;
    const query = readParam(rawParams.q)?.trim() ?? "";
    const storeId = readParam(rawParams.store) ?? "all";
    const state = readParam(rawParams.state) ?? "all";
    const tracking = readParam(rawParams.tracking) ?? "all";
    const sort = readParam(rawParams.sort) ?? "stock_low";
    const page = Number(readParam(rawParams.page) ?? 1);

    const result = await getAdminInventory({
        query,
        storeId,
        state:
            state === "healthy" ||
            state === "low_stock" ||
            state === "out_of_stock"
                ? state
                : "all",
        tracking:
            tracking === "tracked" || tracking === "not_tracked"
                ? tracking
                : "all",
        sort:
            sort === "stock_high" ||
            sort === "newest" ||
            sort === "name"
                ? sort
                : "stock_low",
        page: Number.isFinite(page) ? page : 1,
    });

    const hasFilters =
        Boolean(query) ||
        storeId !== "all" ||
        state !== "all" ||
        tracking !== "all" ||
        sort !== "stock_low";

    return (
        <div className="space-y-8 overflow-x-hidden">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                        Stock monitoring
                    </p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight">
                        Marketplace inventory
                    </h1>
                    <p className="mt-2 max-w-2xl text-muted-foreground">
                        Monitor seller stock, reserved units, low-stock risk and
                        synchronize product availability.
                    </p>
                </div>

                <Link
                    href="/admin/products"
                    className={cn(
                        buttonVariants({ variant: "outline" }),
                        "w-fit rounded-xl",
                    )}
                >
                    <Boxes className="size-4" />
                    View Products
                </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <AdminStatCard
                    title="Tracked Products"
                    value={result.stats.total.toLocaleString()}
                    description="Products included in inventory view"
                    icon={Warehouse}
                />
                <AdminStatCard
                    title="Healthy Stock"
                    value={result.stats.healthy.toLocaleString()}
                    description="Above low-stock threshold"
                    icon={PackageCheck}
                    accent="success"
                />
                <AdminStatCard
                    title="Low Stock"
                    value={result.stats.lowStock.toLocaleString()}
                    description="Needs seller attention"
                    icon={ShieldAlert}
                    accent="warning"
                />
                <AdminStatCard
                    title="Out of Stock"
                    value={result.stats.outOfStock.toLocaleString()}
                    description="No available units"
                    icon={PackageX}
                    accent="danger"
                />
                <AdminStatCard
                    title="Available Units"
                    value={result.stats.available.toLocaleString()}
                    description={`${result.stats.reserved.toLocaleString()} units reserved`}
                    icon={Boxes}
                    accent="blue"
                />
            </div>

            <form className="rounded-3xl border bg-card p-4 shadow-sm overflow-x-auto hide-scrollbar">
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(260px,1fr)_220px_190px_180px_180px_auto]">
                    <input
                        type="search"
                        name="q"
                        defaultValue={query}
                        placeholder="Search product, SKU or store..."
                        className="h-10 rounded-xl border bg-background px-3 text-sm outline-none focus:border-primary/50 focus:ring-3 focus:ring-primary/10"
                    />

                    <select
                        name="store"
                        defaultValue={storeId}
                        className="h-10 rounded-xl border bg-background px-3 text-sm outline-none"
                    >
                        <option value="all">All stores</option>
                        {result.stores.map((currentStore) => (
                            <option
                                key={currentStore.id}
                                value={currentStore.id}
                            >
                                {currentStore.name}
                            </option>
                        ))}
                    </select>

                    <select
                        name="state"
                        defaultValue={state}
                        className="h-10 rounded-xl border bg-background px-3 text-sm outline-none"
                    >
                        <option value="all">All stock states</option>
                        <option value="healthy">Healthy</option>
                        <option value="low_stock">Low stock</option>
                        <option value="out_of_stock">Out of stock</option>
                    </select>

                    <select
                        name="tracking"
                        defaultValue={tracking}
                        className="h-10 rounded-xl border bg-background px-3 text-sm outline-none"
                    >
                        <option value="all">All tracking states</option>
                        <option value="tracked">Tracked</option>
                        <option value="not_tracked">Not tracked</option>
                    </select>

                    <select
                        name="sort"
                        defaultValue={sort}
                        className="h-10 rounded-xl border bg-background px-3 text-sm outline-none"
                    >
                        <option value="stock_low">Lowest stock</option>
                        <option value="stock_high">Highest stock</option>
                        <option value="newest">Recently updated</option>
                        <option value="name">Name A–Z</option>
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
                </div>

                {hasFilters && (
                    <div className="mt-3 border-t pt-3">
                        <Link
                            href="/admin/inventory"
                            className="text-sm font-medium text-primary hover:underline"
                        >
                            Clear all filters
                        </Link>
                    </div>
                )}
            </form>

            <AdminInventoryTable items={result.inventory} />

            <AdminPagination
                page={result.pagination.page}
                pageCount={result.pagination.pageCount}
                total={result.pagination.total}
                pathname="/admin/inventory"
                searchParams={{
                    q: query || undefined,
                    store: storeId,
                    state,
                    tracking,
                    sort,
                }}
            />
        </div>
    );
}
