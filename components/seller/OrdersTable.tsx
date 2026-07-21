"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
    Eye,
    Loader2,
    PackageSearch,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
    getSellerOrders,
    type SellerOrder,
} from "@/services/order-service";
import { cn } from "@/lib/utils";

export default function OrdersTable() {
    const {
        data: orders = [],
        isLoading,
        isError,
        error,
    } = useQuery<SellerOrder[], Error>({
        queryKey: ["seller-orders"],
        queryFn: getSellerOrders,
    });

    if (isLoading) {
        return (
            <div className="flex min-h-64 items-center justify-center">
                <Loader2 className="size-8 animate-spin text-primary" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-destructive">
                {error.message}
            </div>
        );
    }

    return (
        <div className="space-y-7">
            <div className="flex items-center justify-between rounded-2xl border bg-card p-6 shadow-sm">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                        Order Management
                    </p>

                    <h1 className="mt-2 text-3xl font-bold">
                        Orders
                    </h1>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Manage and track all orders received by your store.
                    </p>
                </div>

                <div className="rounded-xl bg-primary/10 px-5 py-3 text-center">
                    <p className="text-2xl font-bold text-primary">
                        {orders.length}
                    </p>

                    <p className="text-xs text-muted-foreground">
                        Total Orders
                    </p>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="rounded-2xl border bg-card p-14 text-center">
                    <PackageSearch className="mx-auto size-12 text-muted-foreground" />

                    <h2 className="mt-4 text-lg font-semibold">
                        No orders yet
                    </h2>

                    <p className="mt-2 text-sm text-muted-foreground">
                        New customer orders will appear here.
                    </p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
                    <table className="w-full min-w-[1000px]">
                        <thead className="bg-muted/40">
                            <tr>
                                <th className="px-5 py-4 text-left text-sm">
                                    Order
                                </th>
                                <th className="px-5 py-4 text-left text-sm">
                                    Customer
                                </th>
                                <th className="px-5 py-4 text-left text-sm">
                                    Items
                                </th>
                                <th className="px-5 py-4 text-left text-sm">
                                    Total
                                </th>
                                <th className="px-5 py-4 text-left text-sm">
                                    Payment
                                </th>
                                <th className="px-5 py-4 text-left text-sm">
                                    Status
                                </th>
                                <th className="px-5 py-4 text-right text-sm">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders.map(
                                (currentOrder) => (
                                    <tr
                                        key={currentOrder.id}
                                        className="border-b transition-colors hover:bg-muted/40"
                                    >
                                        <td className="px-5 py-4">
                                            <div>
                                                <p className="font-semibold">
                                                    {currentOrder.orderNumber}
                                                </p>

                                                <span className="mt-2 inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                                                    {new Date(currentOrder.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div>
                                                <p className="font-medium">
                                                    {currentOrder.customerName}
                                                </p>

                                                <p className="text-xs text-muted-foreground">
                                                    {currentOrder.customerEmail}
                                                </p>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            {
                                                currentOrder.totalItems
                                            }
                                        </td>

                                        <td className="px-10 py-4 font-semibold">
                                            <p className="font-semibold text-primary">
                                                Rs. {Number(currentOrder.totalAmount).toLocaleString()}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4 capitalize">
                                            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize">
                                                {currentOrder.paymentStatus}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={cn(
                                                    "rounded-full px-3 py-1 text-xs font-semibold capitalize",
                                                    currentOrder.status ===
                                                    "pending" &&
                                                    "bg-amber-100 text-amber-700",
                                                    currentOrder.status ===
                                                    "processing" &&
                                                    "bg-blue-100 text-blue-700",
                                                    currentOrder.status ===
                                                    "shipped" &&
                                                    "bg-violet-100 text-violet-700",
                                                    currentOrder.status ===
                                                    "confirmed" &&
                                                    "bg-blue-100 text-blue-700",
                                                    currentOrder.status ===
                                                    "delivered" &&
                                                    "bg-emerald-100 text-emerald-700",
                                                    currentOrder.status ===
                                                    "cancelled" &&
                                                    "bg-red-100 text-red-700",
                                                )}
                                            >
                                                {
                                                    currentOrder.status
                                                }
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex justify-end">
                                                <Link
                                                    href={`/seller/orders/${currentOrder.id}`}
                                                    className={buttonVariants({
                                                        variant: "outline",
                                                        size: "sm",
                                                    })}
                                                >
                                                    <Eye className="mr-2 size-4" />
                                                    View
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ),
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}