import { ArrowUpRight, PackageSearch, Store as StoreIcon } from "lucide-react";
import Link from "next/link";

import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import { buttonVariants } from "@/components/ui/button";
import type { AdminOrderListItem } from "@/lib/admin/get-admin-orders";
import { cn } from "@/lib/utils";

function money(value: number) {
    return new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        maximumFractionDigits: 0,
    }).format(value);
}

function safeDate(value: Date | string | null | undefined) {
    if (!value) return "Not available";
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return "Not available";
    return new Intl.DateTimeFormat("en-PK", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

export default function AdminOrdersTable({
    orders,
}: {
    orders: AdminOrderListItem[];
}) {
    if (orders.length === 0) {
        return (
            <div className="rounded-3xl border border-dashed bg-card px-6 py-16 text-center shadow-sm">
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"><PackageSearch className="size-6" /></div>
                <h2 className="mt-5 text-lg font-semibold">No orders match these filters</h2>
                <p className="mt-2 text-sm text-muted-foreground">Try a different search, store, date range or payment filter.</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-3xl border bg-card shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[1180px] text-sm">
                    <thead className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                        <tr>
                            <th className="px-5 py-4">Order</th><th className="px-5 py-4">Buyer</th><th className="px-5 py-4">Store</th><th className="px-5 py-4">Amount</th><th className="px-5 py-4">Payment</th><th className="px-5 py-4">Status</th><th className="px-5 py-4 text-right">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {orders.map((current) => (
                            <tr key={current.id} className="transition-colors hover:bg-muted/25">
                                <td className="px-5 py-4">
                                    <Link href={`/admin/orders/${current.id}`} className="font-semibold hover:text-primary">{current.orderNumber}</Link>
                                    <p className="mt-1 text-xs text-muted-foreground">{current.itemCount.toLocaleString()} item{current.itemCount === 1 ? "" : "s"} · {safeDate(current.createdAt)}</p>
                                </td>
                                <td className="px-5 py-4"><p className="font-medium">{current.buyerName}</p><p className="mt-1 max-w-[220px] truncate text-xs text-muted-foreground">{current.buyerEmail}</p></td>
                                <td className="px-5 py-4"><Link href={`/admin/stores/${current.storeId}`} className="flex max-w-[190px] items-center gap-2 font-medium hover:text-primary"><StoreIcon className="size-3.5 shrink-0" /><span className="truncate">{current.storeName}</span></Link></td>
                                <td className="px-5 py-4"><p className="font-semibold">{money(current.totalAmount)}</p>{current.platformFee !== null && <p className="mt-1 text-xs text-muted-foreground">{money(current.platformFee)} fee</p>}</td>
                                <td className="px-5 py-4"><p className="mb-2 capitalize">{current.paymentMethod === "cod" ? "Cash on delivery" : "Stripe"}</p><AdminStatusBadge value={current.paymentStatus} /></td>
                                <td className="px-5 py-4"><AdminStatusBadge value={current.status} /></td>
                                <td className="px-5 py-4 text-right"><Link href={`/admin/orders/${current.id}`} aria-label={`View ${current.orderNumber}`} className={cn(buttonVariants({ variant: "outline", size: "icon-sm" }), "rounded-xl")}><ArrowUpRight className="size-4" /></Link></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
