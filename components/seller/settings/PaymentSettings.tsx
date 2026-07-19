"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function PaymentSettings() {
    
    useEffect(() => {
        fetch("/api/stripe/status")
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
            });
    }, []);
    const connectStripe = async () => {
        const res = await fetch("/api/stripe/connect", {
            method: "POST",
        });

        const data = await res.json();

        if (data.success) {
            window.location.href = data.url;
        }
    };
    return (
        <section className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="rounded-xl border p-6">

                <h3 className="text-lg font-semibold">
                    Stripe Connect
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                    Connect your Stripe account to receive payments from customers.
                </p>

                <Button
                    className="mt-6"
                    onClick={connectStripe}
                >
                    Connect Stripe
                </Button>

            </div>
        </section>
    );
}