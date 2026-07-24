import {
    ArrowUpRight,
    CircleAlert,
    Landmark,
    ReceiptText,
    Store as StoreIcon,
} from "lucide-react";
import Link from "next/link";

import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import { buttonVariants } from "@/components/ui/button";
import type { AdminPayoutListItem } from "@/lib/admin/get-admin-payouts";
import { cn } from "@/lib/utils";

function money(value: number) {
    return new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        maximumFractionDigits: 0,
    }).format(value);
}

function formatDate(value: Date | string | null) {
    if (!value) return "Not paid yet";

    const date = value instanceof Date ? value : new Date(value);

    return new Intl.DateTimeFormat("en-PK", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

function compactReference(value: string | null) {
    if (!value) return "No payment reference";
    if (value.length <= 24) return value;
    return `${value.slice(0, 13)}…${value.slice(-7)}`;
}

export default function AdminPayoutsTable({
    payouts,
}: {
    payouts: AdminPayoutListItem[];
}) {
    if (payouts.length === 0) {
        return (
            <div className="rounded-3xl border border-dashed bg-card px-6 py-16 text-center shadow-sm">
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <ReceiptText className="size-6" />
                </div>
                <h2 className="mt-5 text-lg font-semibold">
                    No payouts match these filters
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    Try another seller, store, payout status or date range.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-3xl border bg-card shadow-sm">
            <div className="border-b px-5 py-4">
                <h2 className="font-semibold">Seller payout ledger</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Paid orders and their seller settlement status.
                </p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[1120px] text-sm">
                    <thead className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                        <tr>
                            <th className="px-5 py-4">Seller</th>
                            <th className="px-5 py-4">Store</th>
                            <th className="px-5 py-4">Order</th>
                            <th className="px-5 py-4">Seller amount</th>
                            <th className="px-5 py-4">Stripe status</th>
                            <th className="px-5 py-4">Payout</th>
                            <th className="px-5 py-4">Timeline</th>
                            <th className="px-5 py-4 text-right">Details</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y">
                        {payouts.map((current) => (
                            <tr
                                key={current.id}
                                className="transition-colors hover:bg-muted/25"
                            >
                                <td className="px-5 py-4">
                                    <p className="font-medium">
                                        {current.sellerName}
                                    </p>
                                    <p className="mt-1 max-w-[190px] truncate text-xs text-muted-foreground">
                                        {current.sellerEmail}
                                    </p>
                                </td>

                                <td className="px-5 py-4">
                                    <Link
                                        href={`/admin/stores/${current.storeId}`}
                                        className="flex max-w-[180px] items-center gap-2 font-medium hover:text-primary"
                                    >
                                        <StoreIcon className="size-3.5 shrink-0" />
                                        <span className="truncate">
                                            {current.storeName}
                                        </span>
                                    </Link>
                                </td>

                                <td className="px-5 py-4">
                                    <p className="font-semibold">
                                        {current.orderNumber}
                                    </p>
                                    <p
                                        className="mt-1 max-w-[180px] truncate font-mono text-xs text-muted-foreground"
                                        title={
                                            current.paymentReference ??
                                            undefined
                                        }
                                    >
                                        {compactReference(
                                            current.paymentReference,
                                        )}
                                    </p>
                                </td>

                                <td className="px-5 py-4">
                                    <p className="font-semibold">
                                        {money(current.sellerAmount)}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Platform fee{" "}
                                        {money(current.platformFee)}
                                    </p>
                                </td>

                                <td className="px-5 py-4">
                                    {current.stripePayoutsEnabled ? (
                                        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                                            <Landmark className="size-4" />
                                            <span className="font-medium">
                                                Ready
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                                            <CircleAlert className="size-4" />
                                            <span className="font-medium">
                                                Not ready
                                            </span>
                                        </div>
                                    )}
                                </td>

                                <td className="px-5 py-4">
                                    <AdminStatusBadge
                                        value={current.payoutStatus}
                                    />
                                </td>

                                <td className="px-5 py-4">
                                    <p className="text-xs text-muted-foreground">
                                        Created
                                    </p>
                                    <p className="mt-1 font-medium">
                                        {formatDate(current.createdAt)}
                                    </p>
                                    {current.sellerPaidAt && (
                                        <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-400">
                                            Paid{" "}
                                            {formatDate(
                                                current.sellerPaidAt,
                                            )}
                                        </p>
                                    )}
                                </td>

                                <td className="px-5 py-4 text-right">
                                    <Link
                                        href={`/admin/orders/${current.orderId}`}
                                        aria-label={`View ${current.orderNumber}`}
                                        title={current.orderNumber}
                                        className={cn(
                                            buttonVariants({
                                                variant: "outline",
                                                size: "icon-sm",
                                            }),
                                            "rounded-xl",
                                        )}
                                    >
                                        <ArrowUpRight className="size-4" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}