import { notFound } from "next/navigation";
import { and, eq, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { order, orderItem, payment, shippingAddress, } from "@/db/schema/order";
import { store, product } from "@/db/schema";
import { productImage } from "@/db/schema/product";
import { user } from "@/auth-schema";

type PageProps = {
    params: Promise<{
        orderId: string;
    }>;
};

export default async function SellerOrderDetailsPage({
    params,
}: PageProps) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        notFound();
    }

    const [sellerStore] = await db
        .select({
            id: store.id,
        })
        .from(store)
        .where(
            and(
                eq(store.ownerId, session.user.id),
                eq(store.status, "approved")
            )
        )
        .limit(1);

    if (!sellerStore) {
        notFound();
    }

    const { orderId } = await params;

    const [currentOrder] = await db
        .select()
        .from(order)
        .where(
            and(
                eq(order.id, orderId),
                eq(order.storeId, sellerStore.id)
            )
        )
        .limit(1);

    if (!currentOrder) {
        notFound();
    }
    const [buyer] = await db
        .select({
            id: user.id,
            name: user.name,
            email: user.email,
        })
        .from(user)
        .where(eq(user.id, currentOrder.buyerId))
        .limit(1);

    const [address] = await db
        .select()
        .from(shippingAddress)
        .where(eq(shippingAddress.orderId, currentOrder.id))
        .limit(1);

    const [paymentInfo] = await db
        .select()
        .from(payment)
        .where(eq(payment.orderId, currentOrder.id))
        .limit(1);

    const items = await db
        .select({
            id: orderItem.id,
            productId: product.id,
            productName: orderItem.productName,
            sku: orderItem.sku,
            quantity: orderItem.quantity,
            unitPrice: orderItem.unitPrice,
            totalPrice: orderItem.totalPrice,
            image: sql<string | null>`
                                (
                                    SELECT ${productImage.url}
                                    FROM ${productImage}
                                    WHERE ${productImage.productId} = ${product.id}
                                    ORDER BY ${productImage.createdAt} ASC
                                    LIMIT 1
                                )
                            `,
            slug: product.slug,
        })
        .from(orderItem)
        .leftJoin(
            product,
            eq(orderItem.productId, product.id)
        )
        .where(eq(orderItem.orderId, currentOrder.id));
    return (
        <div className="space-y-8">

            <div>
                <h1 className="text-3xl font-bold">
                    Order #{currentOrder.orderNumber}
                </h1>

                <p className="text-muted-foreground">
                    {currentOrder.status}
                </p>
            </div>

            <div className="rounded-xl border p-6">
                <h2 className="mb-4 text-xl font-semibold">
                    Customer
                </h2>

                <p>{buyer?.name}</p>
                <p>{buyer?.email}</p>
            </div>

            <div className="rounded-xl border p-6">
                <h2 className="mb-4 text-xl font-semibold">
                    Shipping Address
                </h2>

                <p>{address?.fullName}</p>
                <p>{address?.phone}</p>
                <p>{address?.address}</p>
                <p>
                    {address?.city},{" "}
                    {address?.state}
                </p>
            </div>

            <div className="rounded-xl border p-6">
                <h2 className="mb-4 text-xl font-semibold">
                    Payment
                </h2>

                <p>Provider: {paymentInfo?.provider}</p>

                <p>Status: {paymentInfo?.status}</p>

                <p>Amount: Rs. {paymentInfo?.amount}</p>
            </div>

            <div className="rounded-xl border p-6">
                <h2 className="mb-4 text-xl font-semibold">
                    Products
                </h2>

                <div className="space-y-4">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between border-b pb-3"
                        >
                            <div>
                                <p className="font-medium">
                                    {item.productName}
                                </p>

                                <p className="text-sm text-muted-foreground">
                                    Qty: {item.quantity}
                                </p>
                            </div>

                            <p>
                                Rs. {item.totalPrice}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}