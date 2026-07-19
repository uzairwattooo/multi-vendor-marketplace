"use client";

import { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


export default function CheckoutPayment() {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setLoading(true);
        setError("");


        const result = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/checkout/success`,
            },
            redirect: "if_required",
        });

        if (result.error) {
            setError(result.error.message ?? "Payment failed.");
            setLoading(false);
            return;
        }

        const status = result.paymentIntent?.status;

        if (status === "succeeded") {
            router.replace("/checkout/success");
            return;
        }

        if (status === "processing") {
            setError("Payment is processing.");
        } else if (status === "requires_payment_method") {
            setError("Payment was not successful.");
        }

        setLoading(false);
    };


    return (
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold">
                Secure Card Payment
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
                Your payment is encrypted and securely processed by Stripe.
            </p>

            <form
                onSubmit={handleSubmit}
                className="space-y-6 mt-6"
            >
                <PaymentElement
                    options={{
                        layout: "tabs",
                    }}
                />

                {error && (
                    <p className="text-sm text-red-500">
                        {error}
                    </p>
                )}

                <Button
                    type="submit"
                    className="w-full"
                    disabled={!stripe || !elements || loading}
                >
                    {loading
                        ? "Processing Payment..."
                        : "Pay Securely"}
                </Button>
            </form>
        </div>
    );
}