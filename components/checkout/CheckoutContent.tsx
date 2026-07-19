"use client";

import { useState } from "react";

import ShippingAddressForm from "./ShippingAddressForm";
import BillingAddress from "./BillingAddress";
import PaymentMethod from "./PaymentMethod";
import OrderNotes from "./OrderNotes";
import OrderSummary from "./OrderSummary";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe-client";
import CheckoutPayment from "./CheckoutPayment";

type ShippingData = {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    apartment?: string;
    city: string;
    state: string;
    postalCode?: string;
    country: string;
};

export default function CheckoutContent() {
    const [paymentMethod, setPaymentMethod] = useState<"stripe" | "cod">("stripe");
    const [sameAsShipping, setSameAsShipping] = useState(true);
    const [notes, setNotes] = useState("");
    const [clientSecret, setClientSecret] = useState("");
    const [showPayment, setShowPayment] = useState(false);
    const [shipping, setShipping] = useState<ShippingData>({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        state: "",
        postalCode: "",
        apartment: "",
        country: "Pakistan",
    });

    const [billing, setBilling] =
        useState<ShippingData>({
            fullName: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            state: "",
            postalCode: "",
            apartment: "",
            country: "Pakistan",
        });

    return (
        <section className="py-10">
            <div className="container mx-auto">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold">
                        Checkout
                    </h1>

                    <p className="mt-2 text-muted-foreground">
                        Complete your order securely.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

                    <div className="space-y-6">

                        <ShippingAddressForm
                            shipping={shipping}
                            setShipping={setShipping}
                        />

                        <BillingAddress
                            billing={billing}
                            setBilling={setBilling}
                            sameAsShipping={sameAsShipping}
                            setSameAsShipping={setSameAsShipping}
                        />

                        <PaymentMethod
                            paymentMethod={paymentMethod}
                            setPaymentMethod={
                                setPaymentMethod
                            }
                        />

                        <OrderNotes
                            notes={notes}
                            setNotes={setNotes}
                        />

                        {showPayment &&
                            clientSecret && (
                                <div className="mt-8">
                                    <Elements
                                        key={clientSecret}
                                        stripe={stripePromise}
                                        options={{
                                            clientSecret,
                                        }}
                                    >
                                        <CheckoutPayment />
                                    </Elements>
                                </div>
                            )}
                    </div>
                    <OrderSummary
                        paymentMethod={paymentMethod}
                        shipping={shipping}
                        notes={notes}
                        setClientSecret={setClientSecret}
                        setShowPayment={setShowPayment}
                    />
                </div>
            </div>
        </section>
    );
}