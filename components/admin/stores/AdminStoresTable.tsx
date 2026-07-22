import Link from "next/link";
import {
    CreditCard,
    ExternalLink,
    Package,
    ShoppingBag,
    WalletCards,
} from "lucide-react";

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

type AdminStoreRow = {
    id: string;
    ownerId: string;
    name: string;
    slug: string;
    category: string;
    description: string | null;
    email: string;
    phone: string;
    city: string;
    country: string;
    status: "pending" | "approved" | "rejected" | "suspended";
    rejectionReason: string | null;
    isStripeConnected: boolean;
    stripeChargesEnabled: boolean;
    stripePayoutsEnabled: boolean;
    stripeDetailsSubmitted: boolean;
    createdAt: Date;
    ownerName: string;
    ownerEmail: string;
    ownerBanned: boolean | null;
    products: number;
    activeProducts: number;
    orders: number;
    grossRevenue: number;
    pendingPayout: number;
};

type AdminStoresTableProps = {
    stores: AdminStoreRow[];
};

function formatMoney(amount: number) {
    return new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        maximumFractionDigits: 0,
    }).format(amount);
}

export default function AdminStoresTable({
    stores,
}: AdminStoresTableProps) {
    if (stores.length === 0) {
        return (
            <div className="rounded-3xl border border-dashed bg-card px-6 py-16 text-center">
                <Package className="mx-auto size-10 text-muted-foreground" />
                <h3 className="mt-4 font-semibold">No stores found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                    Try changing the search or moderation filters.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-3xl border bg-card shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead className="min-w-[250px] px-5">
                            Store
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Marketplace</TableHead>
                        <TableHead>Finance</TableHead>
                        <TableHead>Stripe</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="px-5 text-right">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {stores.map((currentStore) => (
                        <TableRow key={currentStore.id}>
                            <TableCell className="px-5 py-4">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/admin/stores/${currentStore.id}`}
                                            className="truncate font-semibold transition-colors hover:text-primary"
                                        >
                                            {currentStore.name}
                                        </Link>
                                        {currentStore.status ===
                                            "approved" && (
                                            <Link
                                                href={`/stores/${currentStore.slug}`}
                                                target="_blank"
                                                aria-label="Open public store"
                                            >
                                                <ExternalLink className="size-3.5 text-muted-foreground hover:text-primary" />
                                            </Link>
                                        )}
                                    </div>
                                    <p className="mt-1 truncate text-xs text-muted-foreground">
                                        {currentStore.category} · {currentStore.city}, {currentStore.country}
                                    </p>
                                </div>
                            </TableCell>

                            <TableCell>
                                <div className="space-y-1.5">
                                    <AdminStatusBadge
                                        value={currentStore.status}
                                    />
                                    {currentStore.rejectionReason && (
                                        <p className="max-w-[160px] truncate text-[11px] text-muted-foreground">
                                            {currentStore.rejectionReason}
                                        </p>
                                    )}
                                </div>
                            </TableCell>

                            <TableCell>
                                <div>
                                    <Link
                                        href={`/admin/users/${currentStore.ownerId}`}
                                        className="font-medium hover:text-primary"
                                    >
                                        {currentStore.ownerName}
                                    </Link>
                                    <p className="mt-1 max-w-[180px] truncate text-xs text-muted-foreground">
                                        {currentStore.ownerEmail}
                                    </p>
                                    {currentStore.ownerBanned && (
                                        <div className="mt-1.5">
                                            <AdminStatusBadge value="banned" />
                                        </div>
                                    )}
                                </div>
                            </TableCell>

                            <TableCell>
                                <div className="space-y-1.5 text-xs text-muted-foreground">
                                    <p className="flex items-center gap-2">
                                        <Package className="size-3.5" />
                                        {currentStore.activeProducts}/
                                        {currentStore.products} products
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <ShoppingBag className="size-3.5" />
                                        {currentStore.orders} orders
                                    </p>
                                </div>
                            </TableCell>

                            <TableCell>
                                <div className="space-y-1.5 text-xs">
                                    <p className="font-semibold">
                                        {formatMoney(
                                            currentStore.grossRevenue,
                                        )}
                                    </p>
                                    <p className="flex items-center gap-1.5 text-muted-foreground">
                                        <WalletCards className="size-3.5" />
                                        {formatMoney(
                                            currentStore.pendingPayout,
                                        )} pending
                                    </p>
                                </div>
                            </TableCell>

                            <TableCell>
                                <div className="flex items-center gap-2 text-xs">
                                    <CreditCard
                                        className={
                                            currentStore.isStripeConnected
                                                ? "size-4 text-emerald-600"
                                                : "size-4 text-muted-foreground"
                                        }
                                    />
                                    <span
                                        className={
                                            currentStore.isStripeConnected
                                                ? "font-medium text-emerald-700 dark:text-emerald-400"
                                                : "text-muted-foreground"
                                        }
                                    >
                                        {currentStore.isStripeConnected
                                            ? currentStore.stripePayoutsEnabled
                                                ? "Payout ready"
                                                : "Needs setup"
                                            : "Not connected"}
                                    </span>
                                </div>
                            </TableCell>

                            <TableCell className="text-sm text-muted-foreground">
                                {formatDate(currentStore.createdAt)}
                            </TableCell>

                            <TableCell className="px-5 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <Link
                                        href={`/admin/stores/${currentStore.id}`}
                                        className={cn(
                                            buttonVariants({
                                                variant: "ghost",
                                                size: "sm",
                                            }),
                                            "rounded-xl",
                                        )}
                                    >
                                        View
                                    </Link>

                                    <AdminStoreActions
                                        storeId={currentStore.id}
                                        storeName={currentStore.name}
                                        status={currentStore.status}
                                        compact
                                    />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
