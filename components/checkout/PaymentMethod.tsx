"use client";

import { Label } from "@/components/ui/label";

type Props = {
    value: "cod" | "stripe";

    onChange: (
        value: "cod" | "stripe",
    ) => void;
};

export default function PaymentMethod({
    value,
    onChange,
}: Props) {
    return (
        <div className="rounded-2xl border bg-card p-6 shadow-sm">

            <h2 className="text-xl font-semibold">
                Payment Method
            </h2>

            <div className="mt-6 space-y-4">

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border p-4">

                    <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={value === "cod"}
                        onChange={() =>
                            onChange("cod")
                        }
                    />

                    <div>

                        <p className="font-medium">
                            Cash on Delivery
                        </p>

                        <p className="text-sm text-muted-foreground">
                            Pay when your order arrives.
                        </p>

                    </div>

                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border p-4">

                    <input
                        type="radio"
                        name="paymentMethod"
                        value="stripe"
                        checked={
                            value === "stripe"
                        }
                        onChange={() =>
                            onChange("stripe")
                        }
                    />

                    <div>

                        <p className="font-medium">
                            Credit / Debit Card
                        </p>

                        <p className="text-sm text-muted-foreground">
                            Secure payment powered by Stripe.
                        </p>

                    </div>

                </label>

            </div>

        </div>
    );
}