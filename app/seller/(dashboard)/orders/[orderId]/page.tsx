import { notFound } from "next/navigation";
import { and, eq, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { order, orderItem, payment, shippingAddress } from "@/db/schema/order";
import { store, product } from "@/db/schema";
import { productImage } from "@/db/schema/product";
import { user } from "@/auth-schema";
import OrderDetailsClient from "@/components/seller/OrderDetailsClient";


type PageProps = {
    params: Promise<{
        orderId: string;
    }>;
};

export default async function SellerOrderDetailsPage({ params }: PageProps) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        notFound();
    }

    const [sellerStore] = await db
        .select({ id: store.id })
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
        .leftJoin(product, eq(orderItem.productId, product.id))
        .where(eq(orderItem.orderId, currentOrder.id));

    return (
        <OrderDetailsClient
            order={currentOrder}
            buyer={buyer}
            address={address}
            paymentInfo={paymentInfo}
            items={items}
        />
    );
}