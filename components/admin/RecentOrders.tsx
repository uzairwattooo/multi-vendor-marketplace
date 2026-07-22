import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";

import { cn } from "@/lib/utils";

type RecentOrder = {
    id: string;
    orderNumber: string;
    buyerName: string;
    storeName: string;
    totalAmount: string;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    createdAt: Date;
};

type RecentOrdersProps = {
    orders: RecentOrder[];
    currency: string;
};

function formatMoney(
    amount: string,
    currency: string,
) {
    const value = Number(amount);

    try {
        return new Intl.NumberFormat("en-PK", {
            style: "currency",
            currency: currency.toUpperCase(),
            maximumFractionDigits: 0,
        }).format(value);
    } catch {
        return `${currency.toUpperCase()} ${value.toLocaleString()}`;
    }
}

function statusClass(status: string) {
    switch (status) {
        case "delivered":
        case "paid":
            return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";

        case "cancelled":
        case "refunded":
        case "failed":
            return "bg-destructive/10 text-destructive";

        case "shipped":
        case "processing":
            return "bg-blue-500/10 text-blue-700 dark:text-blue-400";

        default:
            return "bg-amber-500/10 text-amber-700 dark:text-amber-400";
    }
}

export default function RecentOrders({
    orders,
    currency,
}: RecentOrdersProps) {
    return (
        <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
            <div className="flex items-center justify-between gap-4 border-b px-5 py-4 sm:px-6">
                <div>
                    <h2 className="font-semibold">
                        Recent orders
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Latest marketplace purchases.
                    </p>
                </div>

                <Link
                    href="/admin/orders"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary"
                >
                    View all
                    <ArrowRight className="size-3.5" />
                </Link>
            </div>

            {orders.length === 0 ? (
                <div className="px-6 py-14 text-center">
                    <ShoppingBag className="mx-auto size-9 text-muted-foreground" />
                    <p className="mt-3 font-medium">
                        No orders available
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto hide-scrollbar ">
                    <table className="w-full min-w-[820px]">
                        <thead>
                            <tr className="border-b bg-muted/35 text-left text-xs text-muted-foreground">
                                <th className="px-5 py-3 font-medium sm:px-6">
                                    Order
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    Buyer
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    Store
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    Amount
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    Order status
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    Payment
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders.map((currentOrder) => (
                                <tr
                                    key={currentOrder.id}
                                    className="border-b last:border-0"
                                >
                                    <td className="px-5 py-4 sm:px-6">
                                        <p className="text-sm font-semibold">
                                            {currentOrder.orderNumber}
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {new Intl.DateTimeFormat(
                                                "en-PK",
                                                {
                                                    dateStyle:
                                                        "medium",
                                                },
                                            ).format(
                                                currentOrder.createdAt,
                                            )}
                                        </p>
                                    </td>

                                    <td className="px-4 py-4 text-sm">
                                        {currentOrder.buyerName}
                                    </td>

                                    <td className="px-4 py-4 text-sm">
                                        {currentOrder.storeName}
                                    </td>

                                    <td className="px-4 py-4 text-sm font-semibold">
                                        {formatMoney(
                                            currentOrder.totalAmount,
                                            currency,
                                        )}
                                    </td>

                                    <td className="px-4 py-4">
                                        <span
                                            className={cn(
                                                "inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize",
                                                statusClass(
                                                    currentOrder.status,
                                                ),
                                            )}
                                        >
                                            {currentOrder.status}
                                        </span>
                                    </td>

                                    <td className="px-4 py-4">
                                        <div className="flex flex-col items-start gap-1">
                                            <span
                                                className={cn(
                                                    "inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize",
                                                    statusClass(
                                                        currentOrder.paymentStatus,
                                                    ),
                                                )}
                                            >
                                                {
                                                    currentOrder.paymentStatus
                                                }
                                            </span>

                                            <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                                                {
                                                    currentOrder.paymentMethod
                                                }
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
