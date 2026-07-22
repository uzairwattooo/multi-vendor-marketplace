"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
    ArrowUpRight,
    CalendarDays,
    CircleDollarSign,
    Eye,
    Loader2,
    PackageSearch,
    ShoppingBag,
    UserRound,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
    getSellerOrders,
    type SellerOrder,
} from "@/services/order-service";
import { cn } from "@/lib/utils";

function formatDate(date: string | Date) {
    return new Intl.DateTimeFormat("en-PK", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(date));
}

function getInitials(name: string) {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word.charAt(0).toUpperCase())
        .join("");
}

function getOrderStatusStyles(status: string) {
    switch (status.toLowerCase()) {
        case "pending":
            return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300";

        case "confirmed":
            return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300";

        case "processing":
            return "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:text-cyan-300";

        case "shipped":
            return "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300";

        case "delivered":
            return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300";

        case "cancelled":
            return "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300";

        default:
            return "border-border bg-muted text-muted-foreground";
    }
}

function getPaymentStatusStyles(status: string) {
    switch (status.toLowerCase()) {
        case "paid":
            return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300";

        case "pending":
            return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300";

        case "failed":
            return "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300";

        case "refunded":
            return "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300";

        default:
            return "border-border bg-muted text-muted-foreground";
    }
}

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
            <div className="flex min-h-[420px] items-center justify-center rounded-3xl border bg-card shadow-sm">
                <div className="flex flex-col items-center gap-4">
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                        <Loader2 className="size-7 animate-spin text-primary" />
                    </div>

                    <div className="text-center">
                        <p className="font-semibold">
                            Loading orders
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Please wait while we fetch your store orders.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="rounded-3xl border border-destructive/20 bg-destructive/5 p-8">
                <div className="flex items-start gap-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-destructive/10">
                        <PackageSearch className="size-5 text-destructive" />
                    </div>

                    <div>
                        <h2 className="font-semibold text-destructive">
                            Unable to load orders
                        </h2>

                        <p className="mt-1 text-sm text-destructive/80">
                            {error.message}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const totalRevenue = orders.reduce(
        (total, currentOrder) =>
            total + Number(currentOrder.totalAmount),
        0,
    );

    const pendingOrders = orders.filter(
        (currentOrder) =>
            currentOrder.status === "pending",
    ).length;

    const completedOrders = orders.filter(
        (currentOrder) =>
            currentOrder.status === "delivered",
    ).length;

    return (
        <div className="space-y-6">
            {/* Page header */}
            <section className="relative overflow-hidden rounded-3xl border bg-card p-6 shadow-sm sm:p-8">
                <div className="absolute -right-16 -top-20 size-56 rounded-full bg-primary/10 blur-3xl" />

                <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                    <div className="max-w-2xl">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary shadow-sm">
                            <ShoppingBag className="size-3.5" />
                            Order Management
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Store Orders
                        </h1>

                        <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                            Review customer orders, monitor payment
                            status and manage the complete fulfilment
                            process.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:min-w-[570px]">
                        <div className="rounded-2xl border bg-background/70 p-4 shadow-sm backdrop-blur">
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-xs font-medium text-muted-foreground">
                                    Total Orders
                                </p>

                                <ShoppingBag className="size-4 text-primary" />
                            </div>

                            <p className="mt-3 text-2xl font-bold">
                                {orders.length.toLocaleString()}
                            </p>
                        </div>

                        <div className="rounded-2xl border bg-background/70 p-4 shadow-sm backdrop-blur">
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-xs font-medium text-muted-foreground">
                                    Pending
                                </p>

                                <PackageSearch className="size-4 text-amber-600" />
                            </div>

                            <p className="mt-3 text-2xl font-bold">
                                {pendingOrders.toLocaleString()}
                            </p>
                        </div>

                        <div className="rounded-2xl border bg-background/70 p-4 shadow-sm backdrop-blur">
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-xs font-medium text-muted-foreground">
                                    Delivered
                                </p>

                                <ShoppingBag className="size-4 text-emerald-600" />
                            </div>

                            <p className="mt-3 text-2xl font-bold">
                                {completedOrders.toLocaleString()}
                            </p>
                        </div>

                        <div className="rounded-2xl border bg-background/70 p-4 shadow-sm backdrop-blur">
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-xs font-medium text-muted-foreground">
                                    Revenue
                                </p>

                                <CircleDollarSign className="size-4 text-primary" />
                            </div>

                            <p className="mt-3 truncate text-lg font-bold">
                                Rs. {totalRevenue.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {orders.length === 0 ? (
                <section className="rounded-3xl border bg-card px-6 py-20 text-center shadow-sm">
                    <div className="mx-auto flex size-20 items-center justify-center rounded-3xl bg-muted">
                        <PackageSearch className="size-9 text-muted-foreground" />
                    </div>

                    <h2 className="mt-6 text-xl font-semibold">
                        No orders received yet
                    </h2>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                        Once customers place orders from your store,
                        their order and payment information will appear
                        here.
                    </p>
                </section>
            ) : (
                <section className="overflow-hidden rounded-3xl border bg-card shadow-sm">
                    <div className="flex flex-col gap-3 border-b px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <div>
                            <h2 className="text-lg font-semibold">
                                Recent Orders
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Complete list of orders received by your
                                store.
                            </p>
                        </div>

                        <div className="w-fit rounded-full border bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                            {orders.length.toLocaleString()} records
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1080px]">
                            <thead>
                                <tr className="border-b bg-muted/30">
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Order
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Customer
                                    </th>

                                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Items
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Amount
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Payment
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Order Status
                                    </th>

                                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {orders.map((currentOrder) => (
                                    <tr
                                        key={currentOrder.id}
                                        className="group border-b last:border-b-0 transition-colors hover:bg-muted/30"
                                    >
                                        <td className="px-6 py-5">
                                            <div className="min-w-[155px]">
                                                <div className="flex items-center gap-2">
                                                    <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                                                        <ShoppingBag className="size-4 text-primary" />
                                                    </span>

                                                    <p className="font-semibold">
                                                        {currentOrder.orderNumber}
                                                    </p>
                                                </div>

                                                <div className="mt-2 flex items-center gap-1.5 pl-10 text-xs text-muted-foreground">
                                                    <CalendarDays className="size-3.5" />
                                                    {formatDate(
                                                        currentOrder.createdAt,
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-5">
                                            <div className="flex min-w-[210px] items-center gap-3">
                                                <div className="flex size-10 shrink-0 items-center justify-center rounded-full border bg-muted text-xs font-bold text-foreground">
                                                    {getInitials(
                                                        currentOrder.customerName,
                                                    ) || (
                                                            <UserRound className="size-4" />
                                                        )}
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="truncate font-medium">
                                                        {currentOrder.customerName}
                                                    </p>

                                                    <p className="mt-1 truncate text-xs text-muted-foreground">
                                                        {currentOrder.customerEmail}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-5 text-center">
                                            <span className="inline-flex min-w-9 items-center justify-center rounded-lg border bg-background px-2.5 py-1.5 text-sm font-semibold shadow-sm">
                                                {currentOrder.totalItems}
                                            </span>
                                        </td>

                                        <td className="px-6 py-5">
                                            <div className="min-w-[130px]">
                                                <p className="font-bold text-foreground">
                                                    Rs.{" "}
                                                    {Number(
                                                        currentOrder.totalAmount,
                                                    ).toLocaleString()}
                                                </p>

                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    Order total
                                                </p>
                                            </div>
                                        </td>

                                        <td className="px-6 py-5">
                                            <span
                                                className={cn(
                                                    "inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold capitalize",
                                                    getPaymentStatusStyles(
                                                        currentOrder.paymentStatus,
                                                    ),
                                                )}
                                            >
                                                <span className="mr-2 size-1.5 rounded-full bg-current" />
                                                {currentOrder.paymentStatus}
                                            </span>
                                        </td>

                                        <td className="px-6 py-5">
                                            <span
                                                className={cn(
                                                    "inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold capitalize",
                                                    getOrderStatusStyles(
                                                        currentOrder.status,
                                                    ),
                                                )}
                                            >
                                                <span className="mr-2 size-1.5 rounded-full bg-current" />
                                                {currentOrder.status}
                                            </span>
                                        </td>

                                        <td className="px-6 py-5 text-right">
                                            <Link
                                                href={`/seller/orders/${currentOrder.id}`}
                                                className={cn(
                                                    buttonVariants({
                                                        variant: "outline",
                                                        size: "sm",
                                                    }),
                                                    "group/button rounded-xl px-4",
                                                )}
                                            >
                                                <Eye className="mr-2 size-4" />
                                                View
                                                <ArrowUpRight className="ml-2 size-3.5 transition-transform group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-between border-t bg-muted/20 px-6 py-4">
                        <p className="text-xs text-muted-foreground">
                            Showing all available store orders
                        </p>

                        <p className="text-xs font-medium">
                            Total: {orders.length.toLocaleString()}
                        </p>
                    </div>
                </section>
            )}
        </div>
    );
}