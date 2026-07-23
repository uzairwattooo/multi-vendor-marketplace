import {
    Archive,
    Boxes,
    Package,
    PackageCheck,
    PackageX,
    Star,
} from "lucide-react";
import Link from "next/link";

import AdminPagination from "@/components/admin/AdminPagination";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminProductsTable from "@/components/admin/products/AdminProductsTable";
import { buttonVariants } from "@/components/ui/button";
import { getAdminProducts } from "@/lib/admin/get-admin-products";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function readParam(value: string | string[] | undefined) {
    return Array.isArray(value) ? value[0] : value;
}

type AdminProductsPageProps = {
    searchParams: Promise<
        Record<string, string | string[] | undefined>
    >;
};

export default async function AdminProductsPage({
    searchParams,
}: AdminProductsPageProps) {
    const rawParams = await searchParams;

    const query = readParam(rawParams.q)?.trim() ?? "";
    const status = readParam(rawParams.status) ?? "all";
    const storeId = readParam(rawParams.store) ?? "all";
    const category = readParam(rawParams.category) ?? "all";
    const stock = readParam(rawParams.stock) ?? "all";
    const featured = readParam(rawParams.featured) ?? "all";
    const sort = readParam(rawParams.sort) ?? "newest";
    const page = Number(readParam(rawParams.page) ?? 1);

    const result = await getAdminProducts({
        query,
        status:
            status === "draft" ||
            status === "active" ||
            status === "out_of_stock" ||
            status === "archived"
                ? status
                : "all",
        storeId,
        category,
        stock:
            stock === "in_stock" ||
            stock === "low_stock" ||
            stock === "out_of_stock"
                ? stock
                : "all",
        featured:
            featured === "featured" || featured === "not_featured"
                ? featured
                : "all",
        sort:
            sort === "oldest" ||
            sort === "name" ||
            sort === "price_high" ||
            sort === "price_low" ||
            sort === "stock_low" ||
            sort === "sales"
                ? sort
                : "newest",
        page: Number.isFinite(page) ? page : 1,
    });

    const hasFilters =
        Boolean(query) ||
        status !== "all" ||
        storeId !== "all" ||
        category !== "all" ||
        stock !== "all" ||
        featured !== "all" ||
        sort !== "newest";

    return (
        <div className="space-y-8 overflow-x-hidden">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                        Catalog moderation
                    </p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight">
                        Marketplace products
                    </h1>
                    <p className="mt-2 max-w-2xl text-muted-foreground">
                        Review every seller listing, control visibility,
                        featured placement, pricing and stock health.
                    </p>
                </div>

                <Link
                    href="/admin/inventory"
                    className={cn(
                        buttonVariants({ variant: "outline" }),
                        "w-fit rounded-xl",
                    )}
                >
                    <Boxes className="size-4" />
                    Open Inventory
                </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
                <AdminStatCard
                    title="All Products"
                    value={result.stats.total.toLocaleString()}
                    description="Every seller catalog listing"
                    icon={Package}
                />
                <AdminStatCard
                    title="Active"
                    value={result.stats.active.toLocaleString()}
                    description="Visible marketplace products"
                    icon={PackageCheck}
                    accent="success"
                />
                <AdminStatCard
                    title="Draft"
                    value={result.stats.draft.toLocaleString()}
                    description="Hidden editable listings"
                    icon={Archive}
                    accent="warning"
                />
                <AdminStatCard
                    title="Low Stock"
                    value={result.stats.lowStock.toLocaleString()}
                    description="At or below seller threshold"
                    icon={Boxes}
                    accent="warning"
                />
                <AdminStatCard
                    title="Out of Stock"
                    value={result.stats.outOfStock.toLocaleString()}
                    description="Unavailable for purchase"
                    icon={PackageX}
                    accent="danger"
                />
                <AdminStatCard
                    title="Featured"
                    value={result.stats.featured.toLocaleString()}
                    description="Promoted marketplace placement"
                    icon={Star}
                    accent="blue"
                />
            </div>

            <form className="rounded-3xl border bg-card p-4 shadow-sm overflow-x-auto hide-scrollbar">
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(240px,1.3fr)_170px_190px_180px_170px_170px_180px_auto]">
                    <input
                        type="search"
                        name="q"
                        defaultValue={query}
                        placeholder="Search product, SKU, brand or store..."
                        className="h-10 rounded-xl border bg-background px-3 text-sm outline-none focus:border-primary/50 focus:ring-3 focus:ring-primary/10"
                    />

                    <select
                        name="status"
                        defaultValue={status}
                        className="h-10 rounded-xl border bg-background px-3 text-sm outline-none"
                    >
                        <option value="all">All statuses</option>
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                        <option value="out_of_stock">Out of stock</option>
                        <option value="archived">Archived</option>
                    </select>

                    <select
                        name="store"
                        defaultValue={storeId}
                        className="h-10 rounded-xl border bg-background px-3 text-sm outline-none"
                    >
                        <option value="all">All stores</option>
                        {result.filters.stores.map((currentStore) => (
                            <option
                                key={currentStore.id}
                                value={currentStore.id}
                            >
                                {currentStore.name} ({currentStore.status})
                            </option>
                        ))}
                    </select>

                    <select
                        name="category"
                        defaultValue={category}
                        className="h-10 rounded-xl border bg-background px-3 text-sm outline-none"
                    >
                        <option value="all">All categories</option>
                        {result.filters.categories.map((currentCategory) => (
                            <option
                                key={currentCategory.id}
                                value={currentCategory.name}
                            >
                                {currentCategory.name}
                            </option>
                        ))}
                    </select>

                    <select
                        name="stock"
                        defaultValue={stock}
                        className="h-10 rounded-xl border bg-background px-3 text-sm outline-none"
                    >
                        <option value="all">All stock states</option>
                        <option value="in_stock">Healthy stock</option>
                        <option value="low_stock">Low stock</option>
                        <option value="out_of_stock">Out of stock</option>
                    </select>

                    <select
                        name="featured"
                        defaultValue={featured}
                        className="h-10 rounded-xl border bg-background px-3 text-sm outline-none"
                    >
                        <option value="all">All placements</option>
                        <option value="featured">Featured</option>
                        <option value="not_featured">Not featured</option>
                    </select>

                    <select
                        name="sort"
                        defaultValue={sort}
                        className="h-10 rounded-xl border bg-background px-3 text-sm outline-none"
                    >
                        <option value="newest">Newest first</option>
                        <option value="oldest">Oldest first</option>
                        <option value="name">Name A–Z</option>
                        <option value="price_high">Highest price</option>
                        <option value="price_low">Lowest price</option>
                        <option value="stock_low">Lowest stock</option>
                        <option value="sales">Best selling</option>
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
                            href="/admin/products"
                            className="text-sm font-medium text-primary hover:underline"
                        >
                            Clear all filters
                        </Link>
                    </div>
                )}
            </form>

            <AdminProductsTable products={result.products} />

            <AdminPagination
                page={result.pagination.page}
                pageCount={result.pagination.pageCount}
                total={result.pagination.total}
                pathname="/admin/products"
                searchParams={{
                    q: query || undefined,
                    status,
                    store: storeId,
                    category,
                    stock,
                    featured,
                    sort,
                }}
            />
        </div>
    );
}
