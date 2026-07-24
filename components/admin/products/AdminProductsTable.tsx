import {
    ArrowUpRight,
    Box,
    PackageSearch,
    Star,
    Store as StoreIcon,
} from "lucide-react";
import Link from "next/link";

import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import AdminProductActions from "@/components/admin/products/AdminProductActions";
import { buttonVariants } from "@/components/ui/button";
import type { AdminProductListItem } from "@/lib/admin/get-admin-products";
import { cn } from "@/lib/utils";
import Image from "next/image";

function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        maximumFractionDigits: 0,
    }).format(value);
}

function formatDate(value: Date) {
    return new Intl.DateTimeFormat("en-PK", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(value);
}

export default function AdminProductsTable({
    products,
}: {
    products: AdminProductListItem[];
}) {
    if (products.length === 0) {
        return (
            <div className="rounded-3xl border border-dashed bg-card px-6 py-16 text-center shadow-sm">
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <PackageSearch className="size-6" />
                </div>
                <h2 className="mt-5 text-lg font-semibold">
                    No products match these filters
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                    Clear one or more filters, search by another term or review
                    a different store.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-3xl border bg-card shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[1120px] text-sm">
                    <thead className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                        <tr>
                            <th className="px-5 py-4 font-semibold">Product</th>
                            <th className="px-5 py-4 font-semibold">Store</th>
                            <th className="px-5 py-4 font-semibold">Pricing</th>
                            <th className="px-5 py-4 font-semibold">Inventory</th>
                            <th className="px-5 py-4 font-semibold">Sales</th>
                            <th className="px-5 py-4 font-semibold">Status</th>
                            <th className="px-5 py-4 text-right font-semibold">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y">
                        {products.map((currentProduct) => {
                            const lowStock =
                                currentProduct.stock > 0 &&
                                currentProduct.stock <=
                                currentProduct.lowStockThreshold;

                            return (
                                <tr
                                    key={currentProduct.id}
                                    className="transition-colors hover:bg-muted/25"
                                >
                                    <td className="px-5 py-4">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-muted/50">
                                                {currentProduct.image ? (
                                                    <Image
                                                        src={currentProduct.image}
                                                        alt={currentProduct.name}
                                                        width={56}
                                                        height={56}
                                                        sizes="56px"
                                                        className="size-full object-cover"
                                                    />
                                                ) : (
                                                    <Box className="size-5 text-muted-foreground" />
                                                )}
                                            </div>

                                            <div className="min-w-0 max-w-[260px]">
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={`/admin/products/${currentProduct.id}`}
                                                        className="truncate font-semibold hover:text-primary"
                                                    >
                                                        {currentProduct.name}
                                                    </Link>
                                                    {currentProduct.featured && (
                                                        <Star className="size-3.5 shrink-0 fill-amber-400 text-amber-500" />
                                                    )}
                                                </div>
                                                <p className="mt-1 truncate text-xs text-muted-foreground">
                                                    {currentProduct.sku} · {currentProduct.category}
                                                </p>
                                                {currentProduct.brand && (
                                                    <p className="mt-1 truncate text-xs text-muted-foreground">
                                                        {currentProduct.brand}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-5 py-4">
                                        <div className="max-w-[180px]">
                                            <Link
                                                href={`/admin/stores/${currentProduct.storeId}`}
                                                className="flex items-center gap-2 truncate font-medium hover:text-primary"
                                            >
                                                <StoreIcon className="size-3.5 shrink-0" />
                                                <span className="truncate">
                                                    {currentProduct.storeName}
                                                </span>
                                            </Link>
                                            <div className="mt-2">
                                                <AdminStatusBadge
                                                    value={currentProduct.storeStatus}
                                                />
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-5 py-4">
                                        <p className="font-semibold">
                                            {formatCurrency(
                                                currentProduct.salePrice ??
                                                currentProduct.price,
                                            )}
                                        </p>
                                        {currentProduct.salePrice !== null && (
                                            <p className="mt-1 text-xs text-muted-foreground line-through">
                                                {formatCurrency(currentProduct.price)}
                                            </p>
                                        )}
                                    </td>

                                    <td className="px-5 py-4">
                                        <p
                                            className={cn(
                                                "font-semibold",
                                                currentProduct.stock <= 0 &&
                                                "text-destructive",
                                                lowStock && "text-amber-600",
                                            )}
                                        >
                                            {currentProduct.stock.toLocaleString()} available
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Alert at {currentProduct.lowStockThreshold}
                                        </p>
                                    </td>

                                    <td className="px-5 py-4">
                                        <p className="font-semibold">
                                            {currentProduct.unitsSold.toLocaleString()} units
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Added {formatDate(currentProduct.createdAt)}
                                        </p>
                                    </td>

                                    <td className="px-5 py-4">
                                        <div className="flex flex-col items-start gap-2">
                                            <AdminStatusBadge
                                                value={currentProduct.status}
                                            />
                                            {lowStock && (
                                                <AdminStatusBadge
                                                    value="low_stock"
                                                    label="Low stock"
                                                />
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/products/${currentProduct.id}`}
                                                className={cn(
                                                    buttonVariants({
                                                        variant: "ghost",
                                                        size: "icon-sm",
                                                    }),
                                                    "rounded-xl",
                                                )}
                                                aria-label={`View ${currentProduct.name}`}
                                            >
                                                <ArrowUpRight className="size-4" />
                                            </Link>

                                            <AdminProductActions
                                                productId={currentProduct.id}
                                                productName={currentProduct.name}
                                                status={currentProduct.status}
                                                featured={currentProduct.featured}
                                                stock={currentProduct.stock}
                                                storeStatus={
                                                    currentProduct.storeStatus
                                                }
                                                compact
                                            />
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
