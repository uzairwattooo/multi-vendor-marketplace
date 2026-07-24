import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
    ArrowLeft,
    BadgeCheck,
    Building2,
    CalendarDays,
    CreditCard,
    ExternalLink,
    FileText,
    Landmark,
    Mail,
    MapPin,
    Package,
    Phone,
    ReceiptText,
    ShoppingBag,
    Store as StoreIcon,
    TriangleAlert,
    UserRound,
    WalletCards,
} from "lucide-react";

import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import AdminStoreActions from "@/components/admin/stores/AdminStoreActions";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format-date";
import { getAdminStoreDetails } from "@/lib/admin/get-admin-store-details";

function formatMoney(amount: number) {
    return new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        maximumFractionDigits: 0,
    }).format(amount);
}

type AdminStoreDetailsPageProps = {
    params: Promise<{
        storeId: string;
    }>;
};

export default async function AdminStoreDetailsPage({
    params,
}: AdminStoreDetailsPageProps) {
    const { storeId } = await params;
    const data = await getAdminStoreDetails(storeId);

    if (!data) {
        notFound();
    }

    const {
        store: currentStore,
        metrics,
        recentOrders,
        recentProducts,
    } = data;

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div>
                    <Link
                        href="/admin/stores"
                        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeft className="size-4" />
                        Back to stores
                    </Link>

                    <div className="mt-5 flex items-start gap-4">
                        <div className="flex size-16 shrink-0 items-center justify-center rounded-3xl bg-primary/10 text-xl font-bold text-primary">
                            {currentStore.name
                                .split(" ")
                                .filter(Boolean)
                                .map((word) => word.charAt(0))
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                        </div>

                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="truncate text-3xl font-bold tracking-tight">
                                    {currentStore.name}
                                </h1>
                                <AdminStatusBadge
                                    value={currentStore.status}
                                />
                            </div>
                            <p className="mt-2 max-w-2xl text-muted-foreground">
                                {currentStore.description ||
                                    "Marketplace seller store"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {currentStore.status === "approved" && (
                        <Link
                            href={`/stores/${currentStore.slug}`}
                            target="_blank"
                            className={cn(
                                buttonVariants({
                                    variant: "outline",
                                }),
                                "gap-2 rounded-xl",
                            )}
                        >
                            Public Store
                            <ExternalLink className="size-4" />
                        </Link>
                    )}

                    <AdminStoreActions
                        storeId={currentStore.id}
                        storeName={currentStore.name}
                        status={currentStore.status}
                    />
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <AdminStatCard
                    title="Products"
                    value={metrics.products.toLocaleString()}
                    description={`${metrics.activeProducts.toLocaleString()} active products`}
                    icon={Package}
                />
                <AdminStatCard
                    title="Orders"
                    value={metrics.orders.toLocaleString()}
                    description={`${metrics.deliveredOrders.toLocaleString()} delivered orders`}
                    icon={ShoppingBag}
                    accent="blue"
                />
                <AdminStatCard
                    title="Gross Revenue"
                    value={formatMoney(metrics.grossRevenue)}
                    description="Paid order revenue"
                    icon={WalletCards}
                    accent="success"
                />
                <AdminStatCard
                    title="Pending Payout"
                    value={formatMoney(metrics.pendingPayout)}
                    description="Paid seller amount awaiting payout"
                    icon={ReceiptText}
                    accent="warning"
                />
            </div>

            {metrics.lowStockProducts > 0 && (
                <div className="flex items-start gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4 text-sm text-amber-800 dark:text-amber-300">
                    <TriangleAlert className="mt-0.5 size-5 shrink-0" />
                    <p>
                        This store has {metrics.lowStockProducts} low-stock or
                        out-of-stock product
                        {metrics.lowStockProducts === 1 ? "" : "s"} requiring
                        seller attention.
                    </p>
                </div>
            )}

            <div className="grid gap-6 xl:grid-cols-2">
                <section className="rounded-3xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold">
                                Store information
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Contact, category and marketplace registration.
                            </p>
                        </div>
                        <StoreIcon className="size-5 text-muted-foreground" />
                    </div>

                    <div className="mt-6 grid gap-5 sm:grid-cols-2">
                        <DetailItem
                            icon={<BadgeCheck className="size-4" />}
                            label="Category"
                            value={currentStore.category}
                        />
                        <DetailItem
                            icon={<Mail className="size-4" />}
                            label="Store email"
                            value={currentStore.email}
                        />
                        <DetailItem
                            icon={<Phone className="size-4" />}
                            label="Store phone"
                            value={currentStore.phone}
                        />
                        <DetailItem
                            icon={<CalendarDays className="size-4" />}
                            label="Created"
                            value={formatDate(currentStore.createdAt)}
                        />
                    </div>

                    <div className="mt-6 border-t pt-6">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Address
                        </p>
                        <p className="mt-2 flex items-start gap-2 text-sm leading-6">
                            <MapPin className="mt-1 size-4 shrink-0 text-muted-foreground" />
                            <span>
                                {currentStore.address}, {currentStore.city}
                                {currentStore.state
                                    ? `, ${currentStore.state}`
                                    : ""}
                                {currentStore.postalCode
                                    ? ` ${currentStore.postalCode}`
                                    : ""}
                                , {currentStore.country}
                            </span>
                        </p>
                    </div>
                </section>

                <section className="rounded-3xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold">
                                Store owner
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Seller account and access status.
                            </p>
                        </div>
                        <UserRound className="size-5 text-muted-foreground" />
                    </div>

                    <div className="mt-6 rounded-2xl border bg-muted/30 p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <p className="font-semibold">
                                        {currentStore.ownerName}
                                    </p>
                                    <AdminStatusBadge
                                        value={currentStore.ownerRole}
                                    />
                                    {currentStore.ownerBanned && (
                                        <AdminStatusBadge value="banned" />
                                    )}
                                </div>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    {currentStore.ownerEmail}
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {currentStore.ownerPhone ||
                                        "Phone not provided"}
                                </p>
                            </div>

                            <Link
                                href={`/admin/users/${currentStore.ownerId}`}
                                className={cn(
                                    buttonVariants({
                                        variant: "outline",
                                    }),
                                    "rounded-xl",
                                )}
                            >
                                View Owner
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="rounded-3xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold">
                                Business identity
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Registered business and tax information.
                            </p>
                        </div>
                        <Building2 className="size-5 text-muted-foreground" />
                    </div>

                    <div className="mt-6 grid gap-5 sm:grid-cols-2">
                        <DetailItem
                            icon={<Building2 className="size-4" />}
                            label="Business type"
                            value={currentStore.businessType}
                        />
                        <DetailItem
                            icon={<Landmark className="size-4" />}
                            label="Business name"
                            value={
                                currentStore.businessName ||
                                "Not provided"
                            }
                        />
                        <DetailItem
                            icon={<FileText className="size-4" />}
                            label="Registration number"
                            value={
                                currentStore.registrationNumber ||
                                "Not provided"
                            }
                        />
                        <DetailItem
                            icon={<ReceiptText className="size-4" />}
                            label="NTN / STRN"
                            value={
                                [currentStore.ntn, currentStore.strn]
                                    .filter(Boolean)
                                    .join(" / ") || "Not provided"
                            }
                        />
                    </div>
                </section>

                <section className="rounded-3xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold">
                                Stripe Connect
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Seller payment and payout readiness.
                            </p>
                        </div>
                        <CreditCard className="size-5 text-muted-foreground" />
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        <StripeState
                            label="Account connected"
                            active={currentStore.isStripeConnected}
                        />
                        <StripeState
                            label="Details submitted"
                            active={
                                currentStore.stripeDetailsSubmitted
                            }
                        />
                        <StripeState
                            label="Charges enabled"
                            active={currentStore.stripeChargesEnabled}
                        />
                        <StripeState
                            label="Payouts enabled"
                            active={currentStore.stripePayoutsEnabled}
                        />
                    </div>

                    <div className="mt-5 rounded-2xl border bg-muted/30 p-4">
                        <p className="text-xs text-muted-foreground">
                            Stripe account ID
                        </p>
                        <p className="mt-1 break-all font-mono text-xs font-medium">
                            {currentStore.stripeAccountId ||
                                "Not connected"}
                        </p>
                    </div>
                </section>
            </div>

            {(currentStore.status === "rejected" ||
                currentStore.status === "suspended") &&
                currentStore.rejectionReason && (
                    <section className="rounded-3xl border border-destructive/20 bg-destructive/5 p-6">
                        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-destructive">
                            Moderation reason
                        </h2>
                        <p className="mt-3 leading-7">
                            {currentStore.rejectionReason}
                        </p>
                    </section>
                )}

            <div className="grid gap-6 2xl:grid-cols-2">
                <section className="overflow-hiddenrounded-3xl border bg-card shadow-sm">
                    <div className="border-b px-6 py-5">
                        <h2 className="text-lg font-semibold">
                            Recent products
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Latest products added by this seller.
                        </p>
                    </div>

                    {recentProducts.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50 hover:bg-muted/50">
                                    <TableHead className="px-6">
                                        Product
                                    </TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead className="px-6">
                                        Price
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentProducts.map((currentProduct) => (
                                    <TableRow key={currentProduct.id}>
                                        <TableCell className="px-6 py-4">
                                            <p className="max-w-[240px] truncate font-semibold">
                                                {currentProduct.name}
                                            </p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {currentProduct.sku} · {currentProduct.category}
                                            </p>
                                        </TableCell>
                                        <TableCell>
                                            <AdminStatusBadge
                                                value={currentProduct.status}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={
                                                    currentProduct.stock <=
                                                        currentProduct.lowStockThreshold
                                                        ? "font-semibold text-amber-700 dark:text-amber-400"
                                                        : "font-medium"
                                                }
                                            >
                                                {currentProduct.stock}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-6 font-semibold">
                                            {formatMoney(
                                                currentProduct.salePrice ??
                                                currentProduct.price,
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="px-6 py-12 text-center text-sm text-muted-foreground">
                            No products found for this store.
                        </div>
                    )}
                </section>

                <section className="overflow-hiddenrounded-3xl border bg-card shadow-sm">
                    <div className="border-b px-6 py-5">
                        <h2 className="text-lg font-semibold">
                            Recent orders
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Latest customer orders for this store.
                        </p>
                    </div>

                    {recentOrders.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50 hover:bg-muted/50">
                                    <TableHead className="px-6">
                                        Order
                                    </TableHead>
                                    <TableHead>Buyer</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="px-6">
                                        Total
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentOrders.map((currentOrder) => (
                                    <TableRow key={currentOrder.id}>
                                        <TableCell className="px-6 py-4">
                                            <p className="font-semibold">
                                                {currentOrder.orderNumber}
                                            </p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {formatDate(
                                                    currentOrder.createdAt,
                                                )}
                                            </p>
                                        </TableCell>
                                        <TableCell>
                                            {currentOrder.buyerName}
                                        </TableCell>
                                        <TableCell>
                                            <AdminStatusBadge
                                                value={currentOrder.status}
                                            />
                                        </TableCell>
                                        <TableCell className="px-6 font-semibold">
                                            {formatMoney(
                                                Number(
                                                    currentOrder.totalAmount,
                                                ),
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="px-6 py-12 text-center text-sm text-muted-foreground">
                            No orders found for this store.
                        </div>
                    )}
                </section>
            </div>

            <section className="grid gap-4 rounded-3xl border bg-card p-6 shadow-sm sm:grid-cols-3">
                <FinancialItem
                    label="Platform fees collected"
                    value={formatMoney(metrics.platformFees)}
                />
                <FinancialItem
                    label="Seller earnings"
                    value={formatMoney(metrics.sellerEarnings)}
                />
                <FinancialItem
                    label="Pending seller payout"
                    value={formatMoney(metrics.pendingPayout)}
                />
            </section>
        </div>
    );
}

type DetailItemProps = {
    icon: ReactNode;
    label: string;
    value: string;
};

function DetailItem({ icon, label, value }: DetailItemProps) {
    return (
        <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {label}
            </p>
            <p className="mt-2 flex items-center gap-2 text-sm font-medium capitalize">
                <span className="text-muted-foreground">{icon}</span>
                <span className="truncate">{value}</span>
            </p>
        </div>
    );
}

function StripeState({
    label,
    active,
}: {
    label: string;
    active: boolean;
}) {
    return (
        <div className="flex items-center justify-between gap-3 rounded-2xl border p-4">
            <span className="text-sm font-medium">{label}</span>
            <AdminStatusBadge
                value={active ? "active" : "unverified"}
                label={active ? "Yes" : "No"}
            />
        </div>
    );
}

function FinancialItem({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-2xl bg-muted/40 p-5">
            <p className="text-xs font-medium text-muted-foreground">
                {label}
            </p>
            <p className="mt-2 text-xl font-bold">{value}</p>
        </div>
    );
}
