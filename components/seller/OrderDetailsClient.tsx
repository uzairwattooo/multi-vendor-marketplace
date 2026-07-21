"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Order = {
    id: string;
    orderNumber: string;
    status: string;
    totalAmount: number;
};

type Buyer = {
    name: string;
    email: string;
};

type Address = {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
};

type PaymentInfo = {
    provider: string;
};

type OrderItem = {
    id: string;
    productName: string;
    quantity: number;
    totalPrice: number;
};

type OrderDetailsClientProps = {
    order: Order;
    buyer: Buyer | null;
    address: Address | null;
    paymentInfo: PaymentInfo | null;
    items: OrderItem[];
};
export default function OrderDetailsClient({
    order,
    buyer,
    address,
    paymentInfo,
    items,
}: OrderDetailsClientProps) {
    const router = useRouter();

    const updateStatusMutation = useMutation({
        mutationFn: async (status: string) => {
            const response = await fetch(`/api/orders/${order.id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) {
                throw new Error("Failed to update status");
            }
            return response.json();
        },
        onSuccess: () => {
            toast.success("Order status updated successfully");
            router.refresh();
        },
        onError: () => {
            toast.error("Unable to update order status");
        },
    });

const handleStatusChange = (status: string | null) => {
    if (!status) return;

    updateStatusMutation.mutate(status);
};

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 rounded-2xl border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                        Order Details
                    </p>

                    <h1 className="mt-2 text-3xl font-bold">
                        #{order.orderNumber}
                    </h1>

                    <p className="mt-2 text-sm text-muted-foreground">
                        View customer, payment and product details.
                    </p>
                </div>

                <span className="w-fit rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold capitalize text-primary">
                    {order.status}
                </span>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">

                <div className="rounded-2xl border bg-card p-6 shadow-sm">
                    <h2 className="mb-5 text-lg font-semibold">
                        Customer Information
                    </h2>

                    <div className="space-y-2">
                        <p className="font-medium">
                            {buyer?.name}
                        </p>

                        <p className="text-sm text-muted-foreground">
                            {buyer?.email}
                        </p>
                    </div>
                </div>

                <div className="rounded-2xl border bg-card p-6 shadow-sm">
                    <h2 className="mb-5 text-lg font-semibold">
                        Shipping Address
                    </h2>

                    <div className="space-y-2 text-sm">
                        <p>{address?.fullName}</p>
                        <p>{address?.phone}</p>
                        <p>{address?.address}</p>
                        <p>
                            {address?.city}, {address?.state}
                        </p>
                    </div>
                </div>
            </div>
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                        Payment Details
                    </h2>

                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {paymentInfo?.provider}
                    </span>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                            Order Status
                        </p>

                        <Select
                            value={order.status}
                            onValueChange={handleStatusChange}
                        >
                            <SelectTrigger className="w-[220px]">
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
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Total Amount
                        </p>

                        <p className="mt-2 text-2xl font-bold text-primary">
                            Rs. {Number(order.totalAmount).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
                <h2 className="mb-6 text-lg font-semibold">
                    Ordered Products
                </h2>

                <div className="space-y-4">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between rounded-xl border p-4 transition-colors hover:bg-muted/40"
                        >
                            <div>
                                <p className="font-medium">
                                    {item.productName}
                                </p>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Quantity: {item.quantity}
                                </p>
                            </div>

                            <p className="font-semibold text-primary">
                                Rs.{" "}
                                {Number(item.totalPrice).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}