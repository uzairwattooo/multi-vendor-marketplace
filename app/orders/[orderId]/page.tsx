import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import Container from "@/components/common/Container";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import {order, orderItem, shippingAddress} from "@/db/schema";

type OrderDetailsPageProps = {
    params: Promise<{orderId: string;}>;
};

export default async function OrderDetailsPage({params,}: OrderDetailsPageProps) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session?.user) {
        redirect("/login");
    }
    const { orderId } = await params;
    const [currentOrder] = await db
        .select({
            id: order.id,
            orderNumber: order.orderNumber,
            status: order.status,
            paymentStatus: order.paymentStatus,
            subtotal: order.subtotal,
            shippingAmount: order.shippingAmount,
            totalAmount: order.totalAmount,
            createdAt: order.createdAt,
            fullName: shippingAddress.fullName,
            phone: shippingAddress.phone,
            address: shippingAddress.address,
            city: shippingAddress.city,
            state: shippingAddress.state,
        })
        .from(order)
        .leftJoin(
            shippingAddress,
            eq(shippingAddress.orderId, order.id),
        )
        .where(
            and(
                eq(order.id, orderId),
                eq(order.buyerId, session.user.id),
            ),
        )
        .limit(1);
    if (!currentOrder) {
        notFound();
    }
    const items = await db
        .select({
            id: orderItem.id,
            productName: orderItem.productName,
            sku: orderItem.sku,
            unitPrice: orderItem.unitPrice,
            quantity: orderItem.quantity,
            totalPrice: orderItem.totalPrice,
        })
        .from(orderItem)
        .where(eq(orderItem.orderId, currentOrder.id));
    return (
        <main className="min-h-screen">
            <Navbar />
            <section className="py-12 sm:py-16">
                <Container>
                    <div className="max-w-4xl">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                            Order Confirmed
                        </p>
                        <h1 className="mt-2 text-3xl font-bold">
                            {currentOrder.orderNumber}
                        </h1>
                        <p className="mt-2 text-muted-foreground">
                            Your order has been placed successfully.
                        </p>
                        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
                            <div className="rounded-2xl border bg-card p-6">
                                <h2 className="text-xl font-semibold">
                                    Order Items
                                </h2>
                                <div className="mt-5 space-y-4">
                                    {items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex justify-between gap-4 border-b pb-4 last:border-0"
                                        >
                                            <div>
                                                <p className="font-medium">
                                                    {item.productName}
                                                </p>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    SKU: {item.sku}
                                                </p>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    Quantity: {item.quantity}
                                                </p>
                                            </div>
                                            <p className="font-semibold">
                                                Rs.{" "}
                                                {Number(item.totalPrice,).toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <aside className="h-fit rounded-2xl border bg-card p-6">
                                <h2 className="text-xl font-semibold">
                                    Summary
                                </h2>
                                <div className="mt-5 space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>
                                            Rs.{" "}
                                            {Number(currentOrder.subtotal,).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span>
                                            Rs.{" "}
                                            {Number(currentOrder.shippingAmount,).toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="flex justify-between border-t pt-3 text-base font-bold">
                                        <span>Total</span>
                                        <span>
                                            Rs.{" "}
                                            {Number(currentOrder.totalAmount,).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-6 rounded-xl bg-muted p-4">
                                    <p className="text-sm font-medium">
                                        Status
                                    </p>
                                    <p className="mt-1 capitalize text-muted-foreground">
                                        {currentOrder.status}
                                    </p>
                                </div>
                            </aside>
                        </div>
                    </div>
                </Container>
            </section>
            <Footer />
        </main>
    );
}