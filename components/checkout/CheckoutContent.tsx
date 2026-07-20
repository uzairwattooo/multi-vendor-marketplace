"use client";
import { useState } from "react";
import ShippingForm from "./ShippingForm";
import PaymentMethod from "./PaymentMethod";
import OrderSummary from "./OrderSummary";
import StripeElementsProvider from "./StripeElementsProvider";
import StripePaymentForm from "./StripePaymentForm";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { shippingSchema } from "@/lib/validations/shipping-schema";

type ShippingData = {
    fullName: string;
    phone: string;
    email: string
    address: string;
    city: string;
    state: string;
    postalCode?: string;
    country: string;
};


export default function CheckoutContent() {
    const [paymentMethod, setPaymentMethod] =
        useState<"cod" | "stripe">("cod");

    const [clientSecret, setClientSecret] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [shipping, setShipping] =
        useState<ShippingData>({
            fullName: "",
            phone: "",
            email: "",
            address: "",
            city: "",
            state: "",
            postalCode: "",
            country: "Pakistan",
        });
    const validateShipping = () => {
        const result = shippingSchema.safeParse(shipping);

        if (!result.success) {
            toast.error(result.error.issues[0].message);
            return false;
        }

        return true;
    };
    const placeCodOrder = async () => {
        if (!validateShipping()) return;

        setLoading(true);

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

        setLoading(false);

        if (!res.ok) {
            toast.error("Order failed");
            return;
        }

        window.location.href =
            "/checkout/success";
    };
    const createPaymentIntent = async () => {
        if (!validateShipping()) return;
        setLoading(true);

        const res = await fetch(
            "/api/stripe/create-payment-intent",
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

        const data =
            await res.json();

        setLoading(false);

        if (!res.ok) {
            toast.error(data.message);
            return;
        }

        setClientSecret(
            data.clientSecret,
        );
    };
    return (
        <div className="mx-auto max-w-7xl">
            <div className="mb-8 rounded-3xl border bg-card p-6 shadow-sm">
                <h1 className="text-3xl font-bold tracking-tight">
                    Checkout
                </h1>

                <p className="mt-2 text-muted-foreground">
                    Complete your order securely with Stripe.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
                <div className="space-y-8 xl:col-span-2">

                    <ShippingForm
                        value={shipping}
                        onChange={setShipping}
                    />

                    <PaymentMethod
                        value={paymentMethod}
                        onChange={setPaymentMethod}
                    />

                </div>
                <aside className="xl:col-span-1">

                    <div className="space-y-6">
                        <OrderSummary />
                        <div className="rounded-3xl border bg-card p-6 shadow-sm">
                            <div className="mb-5 rounded-2xl bg-primary/10 p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                        🔒
                                    </div>
                                    <div>
                                        <p className="font-semibold">
                                            Secure Checkout
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Your payment is encrypted and protected.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {paymentMethod === "cod" && (
                                <Button
                                    className="h-12 w-full rounded-xl text-base font-semibold"
                                    disabled={loading}
                                    onClick={placeCodOrder}
                                >
                                    {loading
                                        ? "Placing Order..."
                                        : "Place Order"}
                                </Button>
                            )}
                            {paymentMethod === "stripe" &&
                                !clientSecret && (
                                    <Button
                                        className="h-12 w-full rounded-xl text-base font-semibold"
                                        disabled={loading}
                                        onClick={createPaymentIntent}
                                    >
                                        {loading
                                            ? "Loading..."
                                            : "Continue to Secure Payment"}
                                    </Button>
                                )}
                            {paymentMethod === "stripe" &&
                                clientSecret && (
                                    <div className="space-y-5">
                                        <StripeElementsProvider
                                            clientSecret={clientSecret}
                                        >
                                            <StripePaymentForm
                                                returnUrl={`${window.location.origin}/checkout/success`}
                                            />
                                        </StripeElementsProvider>
                                    </div>
                                )}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}