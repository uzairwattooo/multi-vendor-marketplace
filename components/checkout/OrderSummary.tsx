"use client";

import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/components/providers/CartProvider";
import { Button } from "@/components/ui/button";

export default function OrderSummary() {
    const { items, subtotal } = useCart();
    const shipping = 0;
    const tax = 0;
    const total =
        subtotal +
        shipping +
        tax;
    return (
        <aside className="sticky top-24 h-fit rounded-2xl border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold">
                Order Summary
            </h2>
            <div className="mt-6 space-y-5">
                {items.map((item) => (
                    <div
                        key={item.productId}
                        className="flex gap-4"
                    >
                        <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-muted">
                            {item.image && (
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                            )}
                        </div>
                        <div className="flex-1">
                            <h3 className="line-clamp-2 font-medium">
                                {item.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Qty: {item.quantity}
                            </p>
                        </div>
                        <p className="font-semibold">
                            $
                            {(
                                item.price *
                                item.quantity
                            ).toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>
            <Separator className="my-6" />
            <div className="space-y-4">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">
                        Subtotal
                    </span>
                    <span>
                        $
                        {subtotal.toLocaleString()}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">
                        Shipping
                    </span>
                    <span>
                        Free
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">
                        Tax
                    </span>
                    <span>
                        $0
                    </span>
                </div>
            </div>
            <Separator className="my-6" />
            <div className="flex justify-between text-lg font-bold">
                <span>
                    Total
                </span>
                <span>
                    $
                    {total.toLocaleString()}
                </span>
            </div>
        </aside>
    );
}