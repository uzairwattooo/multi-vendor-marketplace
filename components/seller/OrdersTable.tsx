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
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                    Order Management
                </p>

                <h1 className="mt-2 text-3xl font-bold">
                    Orders
                </h1>

                <p className="mt-2 text-muted-foreground">
                    Manage orders received by your store.
                </p>
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
                <div className="overflow-x-auto rounded-2xl border bg-card shadow-sm">
                    <table className="w-full min-w-[1000px]">
                        <thead className="border-b bg-muted/50">
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
                                        key={
                                            currentOrder.id
                                        }
                                        className="border-b last:border-0"
                                    >
                                        <td className="px-5 py-4">
                                            <p className="font-semibold">
                                                {
                                                    currentOrder.orderNumber
                                                }
                                            </p>

                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {new Date(
                                                    currentOrder.createdAt,
                                                ).toLocaleDateString()}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4">
                                            <p className="font-medium">
                                                {
                                                    currentOrder.customerName
                                                }
                                            </p>

                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {
                                                    currentOrder.customerEmail
                                                }
                                            </p>
                                        </td>

                                        <td className="px-5 py-4">
                                            {
                                                currentOrder.totalItems
                                            }
                                        </td>

                                        <td className="px-5 py-4 font-semibold">
                                            Rs.{" "}
                                            {Number(
                                                currentOrder.totalAmount,
                                            ).toLocaleString()}
                                        </td>

                                        <td className="px-5 py-4 capitalize">
                                            {
                                                currentOrder.paymentStatus
                                            }
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
                                                    className={buttonVariants(
                                                        {
                                                            variant:
                                                                "outline",
                                                            size: "sm",
                                                        },
                                                    )}
                                                >
                                                    <Eye className="size-4" />
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