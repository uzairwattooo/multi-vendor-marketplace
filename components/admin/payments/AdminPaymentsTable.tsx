import { ArrowUpRight, CreditCard, Landmark, ReceiptText, Store as StoreIcon, } from "lucide-react";
import Link from "next/link";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import { buttonVariants } from "@/components/ui/button";
import type { AdminPaymentListItem } from "@/lib/admin/get-admin-payments";
import { cn } from "@/lib/utils";

function money(value: number) {
    return new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        maximumFractionDigits: 0,
    }).format(value);
}

function formatDate(value: Date | string | null) {
    if (!value) return "Awaiting payment";

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
    if (!value) return "No transaction ID";
    if (value.length <= 24) return value;
    return `${value.slice(0, 13)}…${value.slice(-7)}`;
}

export default function AdminPaymentsTable({
    payments,
}: {
    payments: AdminPaymentListItem[];
}) {
    if (payments.length === 0) {
        return (
            <div className="rounded-3xl border border-dashed bg-card px-6 py-16 text-center shadow-sm">
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <ReceiptText className="size-6" />
                </div>
                <h2 className="mt-5 text-lg font-semibold">
                    No payments match these filters
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    Try another search, payment method, status or date range.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-3xl border bg-card shadow-sm">
            <div className="border-b px-5 py-4">
                <h2 className="font-semibold">Payment transactions</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Buyer collections, platform fees and seller shares.
                </p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[1180px] text-sm">
                    <thead className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                        <tr>
                            <th className="px-5 py-4">Transaction</th>
                            <th className="px-5 py-4">Buyer</th>
                            <th className="px-5 py-4">Store</th>
                            <th className="px-5 py-4">Method</th>
                            <th className="px-5 py-4">Breakdown</th>
                            <th className="px-5 py-4">Status</th>
                            <th className="px-5 py-4 text-right">Order</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y">
                        {payments.map((current) => (
                            <tr
                                key={current.id}
                                className="transition-colors hover:bg-muted/25"
                            >
                                <td className="px-5 py-4">
                                    <p
                                        className="max-w-[210px] truncate font-mono text-xs font-semibold"
                                        title={
                                            current.transactionId ??
                                            undefined
                                        }
                                    >
                                        {compactReference(
                                            current.transactionId,
                                        )}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {formatDate(
                                            current.paidAt ??
                                            current.createdAt,
                                        )}
                                    </p>
                                </td>

                                <td className="px-5 py-4">
                                    <p className="font-medium">
                                        {current.buyerName}
                                    </p>
                                    <p className="mt-1 max-w-[210px] truncate text-xs text-muted-foreground">
                                        {current.buyerEmail}
                                    </p>
                                </td>

                                <td className="px-5 py-4">
                                    <Link
                                        href={`/admin/stores/${current.storeId}`}
                                        className="flex max-w-[190px] items-center gap-2 font-medium hover:text-primary"
                                    >
                                        <StoreIcon className="size-3.5 shrink-0" />
                                        <span className="truncate">
                                            {current.storeName}
                                        </span>
                                    </Link>
                                </td>

                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-2 font-medium">
                                        {current.provider === "stripe" ? (
                                            <CreditCard className="size-4 text-violet-500" />
                                        ) : (
                                            <Landmark className="size-4 text-amber-600" />
                                        )}
                                        {current.provider === "cod"
                                            ? "Cash on delivery"
                                            : "Stripe"}
                                    </div>
                                </td>

                                <td className="px-5 py-4">
                                    <p className="font-semibold">
                                        {money(current.amount)}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Fee {money(current.platformFee)} ·
                                        Seller {money(current.sellerAmount)}
                                    </p>
                                </td>

                                <td className="px-5 py-4">
                                    <AdminStatusBadge
                                        value={current.status}
                                    />
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