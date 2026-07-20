"use client";

import { useState } from "react";

import {
    PaymentElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Props = {
    returnUrl: string;
};

export default function StripePaymentForm({
    returnUrl,
}: Props) {
    const stripe = useStripe();
    const elements = useElements();

    const [loading, setLoading] = useState(false);

    async function handleSubmit() {
        if (!stripe || !elements) {
            return;
        }

        setLoading(true);

        const { error } =
            await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: returnUrl,
                },
            });

        if (error) {
            toast.error(
                error.message ??
                "Payment failed",
            );

            setLoading(false);
        }
    }

    return (
        <div className="space-y-6">

            <PaymentElement />

            <Button
                className="w-full"
                onClick={handleSubmit}
                disabled={loading}
            >
                {loading
                    ? "Processing..."
                    : "Pay Now"}
            </Button>

        </div>
    );
}