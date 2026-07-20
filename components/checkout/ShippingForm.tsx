"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ShippingData = {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    postalCode?: string;
    country: string;
};

type Props = {
    value: ShippingData;

    onChange: (
        value: ShippingData,
    ) => void;
};

export default function ShippingForm({
    value,
    onChange,
}: Props) {
    const update = (
        field: keyof ShippingData,
        fieldValue: string,
    ) => {
        onChange({
            ...value,
            [field]: fieldValue,
        });
    };

    return (
        <div className="rounded-2xl border bg-card p-6 shadow-sm">

            <h2 className="text-xl font-semibold">
                Shipping Address
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">

                <div className="space-y-2">
                    <Label>Full Name</Label>

                    <Input
                        value={value.fullName}
                        onChange={(e) =>
                            update(
                                "fullName",
                                e.target.value,
                            )
                        }
                        placeholder="John Doe"
                    />
                </div>

                <div className="space-y-2">
                    <Label>Phone</Label>

                    <Input
                        value={value.phone}
                        onChange={(e) =>
                            update(
                                "phone",
                                e.target.value,
                            )
                        }
                        placeholder="+92..."
                    />
                </div>
                <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                        type="email"
                        value={value.email}
                        onChange={(e) => update("email", e.target.value)}
                        placeholder="john@example.com"
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label>Address</Label>

                    <Input
                        value={value.address}
                        onChange={(e) =>
                            update(
                                "address",
                                e.target.value,
                            )
                        }
                        placeholder="Street Address"
                    />
                </div>

                <div className="space-y-2">
                    <Label>City</Label>

                    <Input
                        value={value.city}
                        onChange={(e) =>
                            update(
                                "city",
                                e.target.value,
                            )
                        }
                        placeholder="Sargodha"
                    />
                </div>

                <div className="space-y-2">
                    <Label>State</Label>

                    <Input
                        value={value.state}
                        onChange={(e) =>
                            update(
                                "state",
                                e.target.value,
                            )
                        }
                        placeholder="Punjab"
                    />
                </div>

                <div className="space-y-2">
                    <Label>Postal Code</Label>

                    <Input
                        value={
                            value.postalCode ?? ""
                        }
                        onChange={(e) =>
                            update(
                                "postalCode",
                                e.target.value,
                            )
                        }
                        placeholder="40100"
                    />
                </div>

                <div className="space-y-2">
                    <Label>Country</Label>

                    <Input
                        value={value.country}
                        onChange={(e) =>
                            update(
                                "country",
                                e.target.value,
                            )
                        }
                    />
                </div>

            </div>

        </div>
    );
}