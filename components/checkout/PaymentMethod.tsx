"use client";

import { CreditCard, Banknote } from "lucide-react";
import { Card, CardContent, } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type Props = {
    paymentMethod: "stripe" | "cod";

    setPaymentMethod: (
        value: "stripe" | "cod",
    ) => void;
};

export default function PaymentMethod({
    paymentMethod,
    setPaymentMethod,
}: Props) {
    return (
        <section className="rounded-2xl border bg-card p-6 shadow-sm">

            <h2 className="text-xl font-semibold">
                Payment Method
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
                Choose how you'd like to pay.
            </p>

            <RadioGroup
                value={paymentMethod}
                onValueChange={(value) =>
                    setPaymentMethod(
                        value as
                        | "stripe"
                        | "cod",
                    )
                }
                className="mt-8 space-y-4"
            >

                <Card
                    className={`cursor-pointer transition
                        ${paymentMethod === "stripe"
                            ? "border-primary ring-2 ring-primary/20"
                            : "hover:border-primary"
                        }`}>

                    <CardContent className="flex items-center gap-4 p-5">

                        <RadioGroupItem
                            value="stripe"
                            id="stripe"
                        />

                        <CreditCard className="size-6 text-primary" />

                        <div className="flex-1">

                            <Label
                                htmlFor="stripe"
                                className="cursor-pointer text-base font-semibold"
                            >
                                Credit / Debit Card
                            </Label>

                            <p className="mt-2 text-xs text-green-600">
                                SSL Encrypted Secure Payment
                            </p>
                        </div>

                    </CardContent>

                </Card>

                <Card
                    className={`cursor-pointer transition
                        ${paymentMethod === "cod"
                            ? "border-primary ring-2 ring-primary/20"
                            : "hover:border-primary"
                        }`}>
                    <CardContent className="flex items-center gap-4 p-5">

                        <RadioGroupItem
                            value="cod"
                            id="cod"
                        />

                        <Banknote className="size-6 text-primary" />

                        <div className="flex-1">

                            <Label
                                htmlFor="cod"
                                className="cursor-pointer text-base font-semibold"
                            >
                                Cash on Delivery
                            </Label>

                            <p className="mt-2 text-xs text-orange-500">
                                Available only for eligible locations.
                            </p>
                        </div>

                    </CardContent>

                </Card>

            </RadioGroup>

        </section>
    );
}