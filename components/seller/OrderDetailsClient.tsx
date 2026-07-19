"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Server se jo data aayega uski types define karein
type OrderDetailsClientProps = {
    order: any;
    buyer: any;
    address: any;
    paymentInfo: any;
    items: any[];
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
            router.refresh(); // Server data refresh karne ke liye
        },
        onError: () => {
            toast.error("Unable to update order status");
        },
    });

    const handleStatusChange = (status: string) => {
        updateStatusMutation.mutate(status);
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Order #{order.orderNumber}</h1>
                <p className="text-muted-foreground">{order.status}</p>
            </div>

            <div className="rounded-xl border p-6">
                <h2 className="mb-4 text-xl font-semibold">Customer</h2>
                <p>{buyer?.name}</p>
                <p>{buyer?.email}</p>
            </div>

            <div className="rounded-xl border p-6">
                <h2 className="mb-4 text-xl font-semibold">Shipping Address</h2>
                <p>{address?.fullName}</p>
                <p>{address?.phone}</p>
                <p>{address?.address}</p>
                <p>{address?.city}, {address?.state}</p>
            </div>

            <div className="rounded-xl border p-6">
                <h2 className="mb-4 text-xl font-semibold">Payment</h2>
                <p>Provider: {paymentInfo?.provider}</p>

                <Select value={order.status} onValueChange={handleStatusChange}>
                    <SelectTrigger className="w-[180px] mt-2 mb-4">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                </Select>

                <p>Amount: Rs. {paymentInfo?.amount}</p>
            </div>

            <div className="rounded-xl border p-6">
                <h2 className="mb-4 text-xl font-semibold">Products</h2>
                <div className="space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between border-b pb-3">
                            <div>
                                <p className="font-medium">{item.productName}</p>
                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                            <p>Rs. {item.totalPrice}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}