"use client";

import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/components/providers/CartProvider";
import { ShoppingBag } from "lucide-react";

export default function OrderSummary() {
    const { items, subtotal } = useCart();
    const shipping = 0;
    const tax = 0;
    const total =
        subtotal +
        shipping +
        tax;
    return (
        <aside className=" overflow-hidden rounded-3xl border bg-white shadow-sm dark:bg-card">
            <div className="border-b bg-muted/30 px-6 py-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                        <ShoppingBag className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">
                            Order Summary
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Review your order before payment
                        </p>
                    </div>
                </div>
            </div>
            <div className="space-y-5 p-6">
                {items.map((item) => (
                    <div
                        key={item.productId}
                        className="flex gap-4 rounded-2xl border bg-muted/20 p-4 transition-colors hover:bg-muted/40"
                    >
                        <div className="relative h-20 w-20 overflow-hidden rounded-xl border bg-background">
                            {item.image && (
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                            )}
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                            <div>
                                <h3 className="line-clamp-2 font-semibold">
                                    {item.name}
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Quantity: {item.quantity}
                                </p>
                            </div>
                            <p className="text-lg font-bold text-primary">
                                $
                                {(
                                    item.price *
                                    item.quantity
                                ).toLocaleString()}
                            </p>
                        </div>
                    </div>
                ))}
                <Separator />
                <div className="space-y-4 rounded-2xl bg-muted/20 p-5">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                            Subtotal
                        </span>
                        <span className="font-medium">
                            ${subtotal.toLocaleString()}
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                            Shipping
                        </span>
                        <span className="font-medium text-green-600">
                            Free
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                            Tax
                        </span>
                        <span className="font-medium">
                            $0
                        </span>
                    </div>
                </div>
                <Separator />
                <div className="rounded-2xl bg-primary px-5 py-4 text-primary-foreground">
                    <div className="flex items-center justify-between">
                        <span className="text-base font-medium">
                            Total
                        </span>
                        <span className="text-2xl font-bold">
                            ${total.toLocaleString()}
                        </span>
                    </div>
                        <div className="mt-5 rounded-2xl border bg-muted/20 p-4">
                            <div className="flex items-center gap-3">
                                <div className="text-2xl">
                                    🚚
                                </div>
                                <div>
                                    <p className="font-medium">
                                        Free Shipping
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Estimated delivery in 3–5 business days.
                                    </p>
                                </div>
                            </div>
                        </div>
                </div>
            </div>

        </aside>
    );
}