"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import PhoneInput from "react-phone-number-input";

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

type Props = {
    shipping: ShippingData;
    setShipping: React.Dispatch<
        React.SetStateAction<ShippingData>
    >;
};
export default function ShippingAddressForm({
    shipping,
    setShipping,
}: Props) {
    const handleChange = (
        key: keyof ShippingData,
        value: string,
    ) => {
        setShipping((prev) => ({
            ...prev,
            [key]: value,
        }));
    };
    return (
        <section className="rounded-2xl border bg-card p-6 shadow-sm">

            <h2 className="text-xl font-semibold">
                Shipping Address
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
                Enter the delivery address for this order.
            </p>

            <div className="mt-8 space-y-6">

                <div className="grid gap-6 md:grid-cols-2">

                    <div className="space-y-2">
                        <Label htmlFor="fullName">
                            Full Name
                        </Label>

                        <Input
                            id="fullName"
                            placeholder="Enter Your name"
                            value={shipping.fullName}
                            onChange={(e) =>
                                handleChange(
                                    "fullName",
                                    e.target.value,
                                )
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">
                            Phone Number
                        </Label>
                        <PhoneInput
                            international
                            defaultCountry="PK"
                            value={shipping.phone}
                            onChange={(value) =>
                                handleChange(
                                    "phone",
                                    value ?? ""
                                )
                            }
                            className="phone-input" />
                    </div>

                </div>

                <div className="space-y-2">

                    <Label htmlFor="email">
                        Email Address
                    </Label>

                    <Input
                        id="email"
                        type="email"
                        placeholder="example@email.com"
                        value={shipping.email}

                        onChange={(e) =>
                            handleChange(
                                "email",
                                e.target.value
                            )}
                    />



                </div>

                <div className="space-y-2">

                    <Label htmlFor="address">
                        Street Address
                    </Label>

                    <Textarea
                        id="address"
                        rows={4}
                        placeholder="House No, Street, Area"
                        value={shipping.address}

                        onChange={(e) =>
                            handleChange(
                                "address",
                                e.target.value
                            )}
                    />
                </div>

                <div className="space-y-2">

                    <Label htmlFor="apartment">
                        Apartment / Building (Optional)
                    </Label>

                    <Input
                        id="apartment"
                        placeholder="Apartment, Floor"
                        value={shipping.apartment}

                        onChange={(e) =>
                            handleChange(
                                "apartment",
                                e.target.value
                            )}
                    />
                </div>

                <div className="grid gap-6 md:grid-cols-2">

                    <div className="space-y-2">
                        <Label htmlFor="city">
                            City
                        </Label>
                        <Input
                            id="city"
                            placeholder="Sargodha"
                            value={shipping.city}

                            onChange={(e) =>
                                handleChange(
                                    "city",
                                    e.target.value
                                )}
                        />


                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="state">
                            State / Province
                        </Label>

                        <Input
                            id="state"
                            placeholder="Punjab"
                            value={shipping.state}

                            onChange={(e) =>
                                handleChange(
                                    "state",
                                    e.target.value
                                )}
                        />

                    </div>

                </div>

                <div className="grid gap-6 md:grid-cols-2">

                    <div className="space-y-2">
                        <Label htmlFor="postalCode">
                            Postal Code
                        </Label>

                        <Input
                            id="postalCode"
                            placeholder="40100"
                            value={shipping.postalCode}

                            onChange={(e) =>
                                handleChange(
                                    "postalCode",
                                    e.target.value
                                )}
                        />

                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="country">
                            Country
                        </Label>
                        <Input
                            id="country"
                            value={shipping.country}

                            onChange={(e) =>
                                handleChange(
                                    "country",
                                    e.target.value
                                )}
                        />


                    </div>

                </div>

            </div>

        </section>

    );
}