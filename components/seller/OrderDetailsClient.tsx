"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    BadgeDollarSign,
    CreditCard,
    Loader2,
    Mail,
    MapPin,
    Package,
    Phone,
    ShoppingBag,
    Truck,
    UserRound,
} from "lucide-react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type OrderStatus =
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded";

type Order = {
    id: string;
    orderNumber: string;
    status: OrderStatus;
    totalAmount: string | number;
};

type Buyer = {
    name: string | null;
    email: string | null;
};

type Address = {
    fullName: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
};

type PaymentInfo = {
    provider: string | null;
};

type OrderItem = {
    id: string;
    productName: string;
    quantity: number;
    totalPrice: string | number;
};

type OrderDetailsClientProps = {
    order: Order;
    buyer: Buyer | null;
    address: Address | null;
    paymentInfo: PaymentInfo | null;
    items: OrderItem[];
};

function formatCurrency(value: string | number) {
    return `Rs. ${Number(value || 0).toLocaleString("en-PK")}`;
}

function getOrderStatusStyles(status: OrderStatus) {
    switch (status) {
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
        case "refunded":
            return "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300";

        default:
            return "border-border bg-muted text-muted-foreground";
    }
}

export default function OrderDetailsClient({
    order,
    buyer,
    address,
    paymentInfo,
    items,
}: OrderDetailsClientProps) {
    const router = useRouter();

    const updateStatusMutation = useMutation({
        mutationFn: async (status: OrderStatus) => {
            const response = await fetch(
                `/api/orders/${order.id}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status }),
                },
            );

            const result = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    result?.message ||
                    "Unable to update order status",
                );
            }

            return result;
        },

        onSuccess: () => {
            toast.success(
                "Order status updated successfully",
            );

            router.refresh();
        },

        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const handleStatusChange = (
        status: string | null,
    ) => {
        if (!status) return;

        updateStatusMutation.mutate(
            status as OrderStatus,
        );
    };

    return (
        <div className="space-y-6">
            <section className="relative overflow-hidden rounded-3xl border bg-card p-6 shadow-sm sm:p-8">
                <div className="absolute -right-20 -top-20 size-64 rounded-full bg-primary/10 blur-3xl" />

                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                            <ShoppingBag className="size-3.5" />
                            Order Details
                        </div>

                        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                            #{order.orderNumber}
                        </h1>

                        <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                            Review customer, shipping, payment and
                            ordered product information.
                        </p>
                    </div>

                    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                        <span
                            className={cn(
                                "inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold capitalize",
                                getOrderStatusStyles(order.status),
                            )}
                        >
                            <span className="mr-2 size-2 rounded-full bg-current" />
                            {order.status}
                        </span>

                        <div className="rounded-2xl border bg-background/80 px-5 py-3 shadow-sm">
                            <p className="text-xs font-medium text-muted-foreground">
                                Order Total
                            </p>

                            <p className="mt-1 text-xl font-bold text-primary">
                                {formatCurrency(order.totalAmount)}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="grid gap-6 lg:grid-cols-2">
                <article className="rounded-3xl border bg-card p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <UserRound className="size-5" />
                        </div>

                        <div>
                            <h2 className="font-semibold">
                                Customer Information
                            </h2>

                            <p className="text-xs text-muted-foreground">
                                Buyer account details
                            </p>
                        </div>
                    </div>

                    {buyer ? (
                        <div className="space-y-4">
                            <div className="rounded-2xl border bg-muted/20 p-4">
                                <p className="text-xs font-medium text-muted-foreground">
                                    Customer Name
                                </p>

                                <p className="mt-1 font-semibold">
                                    {buyer.name ||
                                        "Name not available"}
                                </p>
                            </div>

                            <div className="flex items-center gap-3 rounded-2xl border p-4">
                                <Mail className="size-4 shrink-0 text-muted-foreground" />

                                <div className="min-w-0">
                                    <p className="text-xs text-muted-foreground">
                                        Email Address
                                    </p>

                                    <p className="truncate text-sm font-medium">
                                        {buyer.email ||
                                            "Email not available"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                            Customer information is not available.
                        </p>
                    )}
                </article>

                <article className="rounded-3xl border bg-card p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <MapPin className="size-5" />
                        </div>

                        <div>
                            <h2 className="font-semibold">
                                Shipping Address
                            </h2>

                            <p className="text-xs text-muted-foreground">
                                Order delivery information
                            </p>
                        </div>
                    </div>

                    {address ? (
                        <div className="space-y-4">
                            <div className="rounded-2xl border bg-muted/20 p-4">
                                <p className="font-semibold">
                                    {address.fullName ||
                                        "Recipient name unavailable"}
                                </p>

                                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                    {address.address ||
                                        "Address not available"}
                                </p>

                                <p className="text-sm text-muted-foreground">
                                    {[address.city, address.state]
                                        .filter(Boolean)
                                        .join(", ") ||
                                        "City not available"}
                                </p>
                            </div>

                            <div className="flex items-center gap-3 rounded-2xl border p-4">
                                <Phone className="size-4 text-muted-foreground" />

                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Phone Number
                                    </p>

                                    <p className="text-sm font-medium">
                                        {address.phone ||
                                            "Phone not available"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                            Shipping address is not available.
                        </p>
                    )}
                </article>
            </section>
            <section className="rounded-3xl border bg-card p-6 shadow-sm">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <CreditCard className="size-5" />
                        </div>

                        <div>
                            <h2 className="font-semibold">
                                Payment & Fulfilment
                            </h2>

                            <p className="text-xs text-muted-foreground">
                                Manage payment and order status
                            </p>
                        </div>
                    </div>

                    <span className="inline-flex w-fit items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold capitalize text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                        <CreditCard className="mr-2 size-3.5" />
                        {paymentInfo?.provider ||
                            "Payment unavailable"}
                    </span>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                    <div className="rounded-2xl border bg-muted/20 p-5">
                        <div className="mb-3 flex items-center gap-2">
                            <Truck className="size-4 text-muted-foreground" />

                            <p className="text-sm font-medium">
                                Order Status
                            </p>
                        </div>

                        <Select
                            value={order.status}
                            onValueChange={handleStatusChange}
                            disabled={
                                updateStatusMutation.isPending
                            }
                        >
                            <SelectTrigger className="h-11 w-full bg-background">
                                <SelectValue />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="pending">
                                    Pending
                                </SelectItem>

                                <SelectItem value="confirmed">
                                    Confirmed
                                </SelectItem>

                                <SelectItem value="processing">
                                    Processing
                                </SelectItem>

                                <SelectItem value="shipped">
                                    Shipped
                                </SelectItem>

                                <SelectItem value="delivered">
                                    Delivered
                                </SelectItem>

                                <SelectItem value="cancelled">
                                    Cancelled
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        {updateStatusMutation.isPending && (
                            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                                <Loader2 className="size-3.5 animate-spin" />
                                Updating order status...
                            </div>
                        )}
                    </div>

                    <div className="rounded-2xl border bg-primary/5 p-5">
                        <div className="flex items-center gap-2">
                            <BadgeDollarSign className="size-4 text-primary" />

                            <p className="text-sm font-medium text-muted-foreground">
                                Total Amount
                            </p>
                        </div>

                        <p className="mt-3 text-3xl font-bold text-primary">
                            {formatCurrency(order.totalAmount)}
                        </p>

                        <p className="mt-2 text-xs text-muted-foreground">
                            Complete customer order total
                        </p>
                    </div>
                </div>
            </section>
            <section className="overflow-hidden rounded-3xl border bg-card shadow-sm">
                <div className="flex items-center justify-between border-b px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Package className="size-5" />
                        </div>

                        <div>
                            <h2 className="font-semibold">
                                Ordered Products
                            </h2>

                            <p className="text-xs text-muted-foreground">
                                Products included in this order
                            </p>
                        </div>
                    </div>

                    <span className="rounded-full border bg-muted/30 px-3 py-1.5 text-xs font-medium">
                        {items.length}{" "}
                        {items.length === 1 ? "item" : "items"}
                    </span>
                </div>

                {items.length === 0 ? (
                    <div className="px-6 py-16 text-center">
                        <Package className="mx-auto size-10 text-muted-foreground" />

                        <p className="mt-4 font-medium">
                            No products found
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Product information is not available for
                            this order.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y">
                        {items.map((item, index) => (
                            <div
                                key={item.id}
                                className="flex flex-col gap-4 px-6 py-5 transition-colors hover:bg-muted/20 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border bg-muted/30 text-sm font-bold text-muted-foreground">
                                        {String(index + 1).padStart(
                                            2,
                                            "0",
                                        )}
                                    </div>

                                    <div>
                                        <p className="font-semibold">
                                            {item.productName}
                                        </p>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Quantity:{" "}
                                            <span className="font-medium text-foreground">
                                                {item.quantity}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <div className="sm:text-right">
                                    <p className="text-xs text-muted-foreground">
                                        Item total
                                    </p>

                                    <p className="mt-1 text-lg font-bold text-primary">
                                        {formatCurrency(
                                            item.totalPrice,
                                        )}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}