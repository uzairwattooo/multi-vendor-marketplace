"use client";
import { useState } from "react";
import ShippingForm from "./ShippingForm";
import PaymentMethod from "./PaymentMethod";
import OrderSummary from "./OrderSummary";
import StripeElementsProvider from "./StripeElementsProvider";
import StripePaymentForm from "./StripePaymentForm";
import { Button } from "@/components/ui/button";


type ShippingData = {
    fullName: string;
    phone: string;
    email:string
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
            email:"",
            address: "",
            city: "",
            state: "",
            postalCode: "",
            country: "Pakistan",
        });

    const placeCodOrder = async () => {
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
            alert("Order failed");
            return;
        }

        window.location.href =
            "/checkout/success";
    };
    const createPaymentIntent =
        async () => {
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
                alert(data.message);
                return;
            }

            setClientSecret(
                data.clientSecret,
            );
        };
    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

            <div className="space-y-6 lg:col-span-2">

                <ShippingForm
                    value={shipping}
                    onChange={setShipping}
                />

                <PaymentMethod
                    value={paymentMethod}
                    onChange={setPaymentMethod}
                />

            </div>

            <div className="space-y-36">

                <OrderSummary />

                {paymentMethod === "cod" && (
                    <Button
                        className="w-full"
                        size="lg"
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
                            className="w-full"
                            size="lg"
                            disabled={loading}
                            onClick={
                                createPaymentIntent
                            }
                        >
                            {loading
                                ? "Loading..."
                                : "Continue to Payment"}
                        </Button>
                    )}
                {paymentMethod ===
                    "stripe" &&
                    clientSecret && (
                        <StripeElementsProvider
                            clientSecret={
                                clientSecret
                            }
                        >
                            <StripePaymentForm
                                returnUrl={`${window.location.origin}/checkout/success`}
                            />
                        </StripeElementsProvider>
                    )}
            </div>

        </div>
    );
}