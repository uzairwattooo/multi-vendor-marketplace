import {
    ArrowLeft,
    Boxes,
    CalendarDays,
    CircleDollarSign,
    ExternalLink,
    ImageIcon,
    PackageCheck,
    ReceiptText,
    ShoppingCart,
    Store as StoreIcon,
    UserRound,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import AdminProductActions from "@/components/admin/products/AdminProductActions";
import AdminStatCard from "@/components/admin/AdminStatCard";
import { buttonVariants } from "@/components/ui/button";
import { getAdminProductDetails } from "@/lib/admin/get-admin-product-details";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function formatCurrency(value: number, currency = "PKR") {
    return new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: currency.toUpperCase(),
        maximumFractionDigits: 2,
    }).format(value);
}

function formatDate(value: Date) {
    return new Intl.DateTimeFormat("en-PK", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(value);
}

type AdminProductDetailsPageProps = {
    params: Promise<{
        productId: string;
    }>;
};

export default async function AdminProductDetailsPage({
    params,
}: AdminProductDetailsPageProps) {
    const { productId } = await params;
    const result = await getAdminProductDetails(productId);

    if (!result) {
        notFound();
    }

    const { product, images, inventory, metrics, recentOrders } = result;
    const primaryImage = images[0] ?? null;
    const isLowStock =
        product.stock > 0 && product.stock <= product.lowStockThreshold;

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                <div>
                    <Link
                        href="/admin/products"
                        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="size-4" />
                        Back to products
                    </Link>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            {product.name}
                        </h1>
                        <AdminStatusBadge value={product.status} />
                        {product.featured && (
                            <AdminStatusBadge
                                value="featured"
                                label="Featured"
                            />
                        )}
                        {isLowStock && (
                            <AdminStatusBadge
                                value="low_stock"
                                label="Low stock"
                            />
                        )}
                    </div>

                    <p className="mt-2 text-sm text-muted-foreground">
                        SKU {product.sku} · {product.category} · Last updated{" "}
                        {formatDate(product.updatedAt)}
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Link
                        href={`/products/${product.slug}`}
                        target="_blank"
                        className={cn(
                            buttonVariants({ variant: "outline" }),
                            "rounded-xl",
                        )}
                    >
                        <ExternalLink className="size-4" />
                        Public Listing
                    </Link>

                    <AdminProductActions
                        productId={product.id}
                        productName={product.name}
                        status={product.status}
                        featured={product.featured}
                        stock={product.stock}
                        storeStatus={product.storeStatus}
                    />
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <AdminStatCard
                    title="Paid Revenue"
                    value={formatCurrency(metrics.paidRevenue)}
                    description="Paid order-item revenue"
                    icon={CircleDollarSign}
                    accent="success"
                />
                <AdminStatCard
                    title="Units Sold"
                    value={metrics.unitsSold.toLocaleString()}
                    description="Non-cancelled order quantity"
                    icon={ShoppingCart}
                    accent="blue"
                />
                <AdminStatCard
                    title="Orders"
                    value={metrics.orderCount.toLocaleString()}
                    description="Distinct orders containing product"
                    icon={ReceiptText}
                />
                <AdminStatCard
                    title="Available Stock"
                    value={metrics.availableStock.toLocaleString()}
                    description={`${inventory?.reservedQuantity ?? 0} units reserved`}
                    icon={PackageCheck}
                    accent={metrics.availableStock <= 0 ? "danger" : "warning"}
                />
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_420px]">
                <div className="space-y-6">
                    <section className="overflow-x-auto hide-scrollbar rounded-3xl border bg-card shadow-sm">
                        <div className="grid gap-0 lg:grid-cols-[360px_minmax(0,1fr)]">
                            <div className="flex min-h-[360px] items-center justify-center border-b bg-muted/30 p-6 lg:border-b-0 lg:border-r">
                                {primaryImage ? (
                                    <img
                                        src={primaryImage.url}
                                        alt={
                                            primaryImage.altText ?? product.name
                                        }
                                        className="max-h-[420px] w-full rounded-2xl object-contain"
                                    />
                                ) : (
                                    <div className="text-center text-muted-foreground">
                                        <ImageIcon className="mx-auto size-10" />
                                        <p className="mt-3 text-sm">
                                            No product image
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 sm:p-8">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Catalog price
                                        </p>
                                        <p className="mt-2 text-3xl font-bold">
                                            {formatCurrency(
                                                product.salePrice ??
                                                    product.price,
                                            )}
                                        </p>
                                        {product.salePrice !== null && (
                                            <p className="mt-1 text-sm text-muted-foreground line-through">
                                                {formatCurrency(product.price)}
                                            </p>
                                        )}
                                    </div>

                                    <div className="rounded-2xl border bg-muted/30 px-4 py-3 text-right">
                                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                            Stock
                                        </p>
                                        <p className="mt-1 text-xl font-bold">
                                            {product.stock.toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                                    <InfoItem label="Brand" value={product.brand ?? "Not set"} />
                                    <InfoItem label="Category" value={product.category} />
                                    <InfoItem label="SKU" value={product.sku} />
                                    <InfoItem
                                        label="Low-stock alert"
                                        value={product.lowStockThreshold.toLocaleString()}
                                    />
                                </div>

                                <div className="mt-7 border-t pt-6">
                                    <h2 className="font-semibold">
                                        Product description
                                    </h2>
                                    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted-foreground">
                                        {product.description}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {images.length > 1 && (
                            <div className="border-t p-5">
                                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    Product gallery
                                </p>
                                <div className="flex gap-3 overflow-x-auto pb-1">
                                    {images.map((image) => (
                                        <div
                                            key={image.id}
                                            className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-muted/30"
                                        >
                                            <img
                                                src={image.url}
                                                alt={image.altText ?? product.name}
                                                className="size-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>

                    <section className="overflow-hidden rounded-3xl border bg-card shadow-sm">
                        <div className="border-b px-6 py-5">
                            <h2 className="text-lg font-semibold">
                                Recent product orders
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                The latest orders containing this product.
                            </p>
                        </div>

                        {recentOrders.length === 0 ? (
                            <div className="px-6 py-12 text-center text-sm text-muted-foreground">
                                This product has not appeared in an order yet.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[720px] text-sm">
                                    <thead className="border-b bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold">Order</th>
                                            <th className="px-6 py-4 font-semibold">Buyer</th>
                                            <th className="px-6 py-4 font-semibold">Quantity</th>
                                            <th className="px-6 py-4 font-semibold">Line total</th>
                                            <th className="px-6 py-4 font-semibold">Status</th>
                                            <th className="px-6 py-4 font-semibold">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {recentOrders.map((currentOrder) => (
                                            <tr key={currentOrder.id}>
                                                <td className="px-6 py-4 font-semibold">
                                                    {currentOrder.orderNumber}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {currentOrder.buyerName}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {currentOrder.quantity.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 font-semibold">
                                                    {formatCurrency(
                                                        currentOrder.lineTotal,
                                                        currentOrder.currency,
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-wrap gap-2">
                                                        <AdminStatusBadge
                                                            value={currentOrder.status}
                                                        />
                                                        <AdminStatusBadge
                                                            value={currentOrder.paymentStatus}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground">
                                                    {formatDate(
                                                        currentOrder.createdAt,
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                </div>

                <div className="space-y-6">
                    <section className="rounded-3xl border bg-card p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                <StoreIcon className="size-5" />
                            </div>
                            <div>
                                <h2 className="font-semibold">Seller store</h2>
                                <p className="text-sm text-muted-foreground">
                                    Listing ownership and moderation state
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 space-y-4">
                            <InfoItem label="Store" value={product.storeName} />
                            <InfoItem
                                label="Store status"
                                value={product.storeStatus.replaceAll("_", " ")}
                            />
                            <InfoItem label="Owner" value={product.ownerName} />
                            <InfoItem
                                label="Owner email"
                                value={product.ownerEmail}
                            />
                            <InfoItem
                                label="Owner account"
                                value={product.ownerBanned ? "Banned" : "Active"}
                            />
                        </div>

                        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                            <Link
                                href={`/admin/stores/${product.storeId}`}
                                className={cn(
                                    buttonVariants({ variant: "outline" }),
                                    "rounded-xl",
                                )}
                            >
                                <StoreIcon className="size-4" />
                                View Store
                            </Link>
                            <Link
                                href={`/admin/users/${product.ownerId}`}
                                className={cn(
                                    buttonVariants({ variant: "outline" }),
                                    "rounded-xl",
                                )}
                            >
                                <UserRound className="size-4" />
                                View Owner
                            </Link>
                        </div>
                    </section>

                    <section className="rounded-3xl border bg-card p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-700 dark:text-blue-400">
                                <Boxes className="size-5" />
                            </div>
                            <div>
                                <h2 className="font-semibold">Inventory record</h2>
                                <p className="text-sm text-muted-foreground">
                                    Product and reserved stock synchronization
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <MetricBox
                                label="Total quantity"
                                value={(
                                    inventory?.quantity ?? product.stock
                                ).toLocaleString()}
                            />
                            <MetricBox
                                label="Reserved"
                                value={(
                                    inventory?.reservedQuantity ?? 0
                                ).toLocaleString()}
                            />
                            <MetricBox
                                label="Available"
                                value={metrics.availableStock.toLocaleString()}
                            />
                            <MetricBox
                                label="Threshold"
                                value={(
                                    inventory?.lowStockThreshold ??
                                    product.lowStockThreshold
                                ).toLocaleString()}
                            />
                        </div>

                        <div className="mt-5 flex items-center justify-between rounded-2xl border bg-muted/20 px-4 py-3">
                            <span className="text-sm text-muted-foreground">
                                Quantity tracking
                            </span>
                            <AdminStatusBadge
                                value={
                                    inventory?.trackQuantity
                                        ? "tracked"
                                        : "not_tracked"
                                }
                                label={
                                    inventory?.trackQuantity
                                        ? "Tracked"
                                        : "Not tracked"
                                }
                            />
                        </div>

                        <Link
                            href={`/admin/inventory?q=${encodeURIComponent(
                                product.sku,
                            )}`}
                            className={cn(
                                buttonVariants({ variant: "outline" }),
                                "mt-5 w-full rounded-xl",
                            )}
                        >
                            <Boxes className="size-4" />
                            Manage Inventory
                        </Link>
                    </section>

                    <section className="rounded-3xl border bg-card p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <CalendarDays className="size-5 text-primary" />
                            <h2 className="font-semibold">Catalog timeline</h2>
                        </div>
                        <div className="mt-5 space-y-5 border-l pl-5">
                            <TimelineItem
                                title="Product created"
                                date={formatDate(product.createdAt)}
                            />
                            <TimelineItem
                                title="Last catalog update"
                                date={formatDate(product.updatedAt)}
                            />
                            {inventory?.updatedAt && (
                                <TimelineItem
                                    title="Inventory synchronized"
                                    date={formatDate(inventory.updatedAt)}
                                />
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {label}
            </p>
            <p className="mt-1 break-words text-sm font-semibold capitalize">
                {value}
            </p>
        </div>
    );
}

function MetricBox({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border bg-muted/20 p-4">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-2 text-xl font-bold">{value}</p>
        </div>
    );
}

function TimelineItem({ title, date }: { title: string; date: string }) {
    return (
        <div className="relative">
            <span className="absolute -left-[25px] top-1.5 size-2 rounded-full bg-primary ring-4 ring-background" />
            <p className="text-sm font-medium">{title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{date}</p>
        </div>
    );
}
