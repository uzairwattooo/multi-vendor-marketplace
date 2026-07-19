"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { useCart } from "@/components/providers/CartProvider";
import { useState } from "react";
import { ShippingFormValues } from "@/lib/validations/shipping-schema";

type Props = {
    paymentMethod: "stripe" | "cod";
    shipping: ShippingFormValues;
    notes: string;
    setClientSecret: React.Dispatch<React.SetStateAction<string>>;
    setShowPayment: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function OrderSummary({
    paymentMethod,
    shipping,
    notes,
    setClientSecret,
    setShowPayment,
}: Props) {
    const [loading, setLoading] = useState(false);
    const { items, subtotal } = useCart();
    const shippingCost = 0;
    const tax = 0;
    const total = subtotal + shippingCost + tax;


    const handleCheckout = async () => {
        if (
            !shipping.fullName ||
            !shipping.phone ||
            !shipping.email ||
            !shipping.address ||
            !shipping.city ||
            !shipping.state ||
            !shipping.country
        ) {
            alert("Please complete your shipping address.");
            return;
        }

        if (loading) return;
        setLoading(true);
        try {

            if (paymentMethod === "cod") {
                const res = await fetch(
                    "/api/orders/cod",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            shipping,
                        }),
                    },
                );
                if (!res.ok) {
                    alert("Order failed");
                    return;
                }
                window.location.href =
                    "/checkout/success";
                return;
            }
            const res = await fetch(
                "/api/payment-intent",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        shipping,
                        notes,
                    }),
                },
            );
            if (!res.ok) {
                alert("Unable to create payment.");
                return;
            }
            const data = await res.json();
            if (!data.clientSecret) {
                alert("Unable to initialize payment.");
                return;
            }
            setClientSecret(data.clientSecret);
            setShowPayment(true);
        } finally {
            setLoading(false);
        }
    };
    {
        items.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">
                Your cart is empty.
            </p>
        )
    }
    return (
        <aside className="h-fit rounded-2xl border bg-card p-6 shadow-sm sticky top-24">

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

                            {item.image ? (
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : null}

                        </div>

                        <div className="flex-1">

                            <h3 className="font-medium line-clamp-2">
                                {item.name}
                            </h3>

                            <p className="text-sm text-muted-foreground">
                                Qty: {item.quantity}
                            </p>

                        </div>

                        <p className="font-semibold">
                            Rs.{" "}
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
                        Rs.{" "}
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
                        Rs. 0
                    </span>

                </div>

            </div>

            <Separator className="my-6" />

            <div className="flex justify-between text-lg font-bold">

                <span>Total</span>

                <span>
                    Rs.{" "}
                    {total.toLocaleString()}
                </span>

            </div>

            <Button
                size="lg"
                className="mt-8 w-full"
                onClick={handleCheckout}
                disabled={
                    loading ||
                    items.length === 0
                }
            >
                {loading
                    ? "Please wait..."
                    : paymentMethod === "cod"
                        ? "Place Order"
                        : "Proceed to Payment"}
            </Button>
        </aside>
    );
}