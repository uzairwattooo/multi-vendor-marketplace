export type SellerOrderStatus =
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded";

export type SellerOrder = {
    id: string;
    orderNumber: string;
    status: SellerOrderStatus;
    paymentStatus:
        | "pending"
        | "paid"
        | "failed"
        | "refunded";
    totalAmount: string;
    createdAt: string;
    customerName: string;
    customerEmail: string;
    shippingName: string;
    shippingPhone: string;
    shippingCity: string;
    totalItems: number;
};

export async function getSellerOrders(): Promise<
    SellerOrder[]
> {
    const response = await fetch(
        "/api/seller/orders",
        {
            cache: "no-store",
        },
    );

    const data: unknown = await response.json();

    if (!response.ok) {
        const errorData = data as {
            message?: string;
        };

        throw new Error(
            errorData.message ??
                "Unable to fetch orders",
        );
    }

    return data as SellerOrder[];
}