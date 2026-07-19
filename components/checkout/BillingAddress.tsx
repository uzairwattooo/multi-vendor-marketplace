"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import PhoneInput from "react-phone-number-input";
import type { ShippingData } from "./CheckoutContent";

type Props = {
    billing: ShippingData;
    setBilling: React.Dispatch<
        React.SetStateAction<ShippingData>
    >;

    sameAsShipping: boolean;

    setSameAsShipping: (
        value: boolean,
    ) => void;
};

export default function BillingAddress({
    billing,
    setBilling,
    sameAsShipping,
    setSameAsShipping,
}: Props) {
    const handleChange = (
        key: keyof ShippingData,
        value: string,
    ) => {
        setBilling((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    return (
        <section className="rounded-2xl border bg-card p-6 shadow-sm">

            <h2 className="text-xl font-semibold">
                Billing Address
            </h2>

            <div className="mt-6 flex items-center space-x-3">

                <Checkbox
                    id="same-address"
                    checked={sameAsShipping}
                    onCheckedChange={(checked) =>
                        setSameAsShipping(
                            Boolean(checked),
                        )
                    }
                />

                <Label htmlFor="same-address">
                    Billing address is the same as
                    shipping address.
                </Label>

            </div>

            {!sameAsShipping && (

                <div className="mt-8 space-y-6">

                    <div className="grid gap-6 md:grid-cols-2">

                        <div className="space-y-2">

                            <Label>
                                Full Name
                            </Label>

                            <Input
                                value={
                                    billing.fullName
                                }
                                onChange={(e) =>
                                    handleChange(
                                        "fullName",
                                        e.target.value,
                                    )
                                }
                            />

                        </div>

                        <div className="space-y-2">

                            <Label>
                                Phone
                            </Label>

                            <PhoneInput
                                international
                                defaultCountry="PK"
                                value={
                                    billing.phone
                                }
                                onChange={(value) =>
                                    handleChange(
                                        "phone",
                                        value ?? "",
                                    )
                                }
                                className="phone-input"
                            />

                        </div>

                    </div>

                    <div className="space-y-2">

                        <Label>
                            Email
                        </Label>

                        <Input
                            type="email"
                            value={billing.email}
                            onChange={(e) =>
                                handleChange(
                                    "email",
                                    e.target.value,
                                )
                            }
                        />

                    </div>

                    <div className="space-y-2">

                        <Label>
                            Address
                        </Label>

                        <Textarea
                            rows={4}
                            value={
                                billing.address
                            }
                            onChange={(e) =>
                                handleChange(
                                    "address",
                                    e.target.value,
                                )
                            }
                        />

                    </div>

                    <div className="space-y-2">

                        <Label>
                            Apartment
                        </Label>

                        <Input
                            value={
                                billing.apartment
                            }
                            onChange={(e) =>
                                handleChange(
                                    "apartment",
                                    e.target.value,
                                )
                            }
                        />

                    </div>

                    <div className="grid gap-6 md:grid-cols-2">

                        <Input
                            placeholder="City"
                            value={billing.city}
                            onChange={(e) =>
                                handleChange(
                                    "city",
                                    e.target.value,
                                )
                            }
                        />

                        <Input
                            placeholder="State"
                            value={billing.state}
                            onChange={(e) =>
                                handleChange(
                                    "state",
                                    e.target.value,
                                )
                            }
                        />

                    </div>

                    <div className="grid gap-6 md:grid-cols-2">

                        <Input
                            placeholder="Postal Code"
                            value={
                                billing.postalCode
                            }
                            onChange={(e) =>
                                handleChange(
                                    "postalCode",
                                    e.target.value,
                                )
                            }
                        />

                        <Input
                            placeholder="Country"
                            value={
                                billing.country
                            }
                            onChange={(e) =>
                                handleChange(
                                    "country",
                                    e.target.value,
                                )
                            }
                        />

                    </div>

                </div>

            )}

        </section>
    );
}