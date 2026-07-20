"use client";

import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { Label } from "@/components/ui/label";
import PhoneInput from "@/components/ui/phone-input";

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
        <div className="overflow-hidden rounded-3xl border bg-white shadow-sm dark:bg-card">

            <div className="border-b bg-muted/30 px-8 py-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                        <MapPin className="h-5 w-5 text-primary" />
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight">
                            Shipping Address
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Enter your delivery details for your order.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 p-8 md:grid-cols-2">

                <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Full Name
                    </Label>

                    <Input
                        className="h-12 rounded-xl"
                        value={value.fullName}
                        onChange={(e) =>
                            update("fullName", e.target.value)
                        }
                        placeholder="John Doe"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Phone Number
                    </Label>
                    <PhoneInput
                        international
                        defaultCountry="PK"
                        value={value.phone}
                        onChange={(value) =>
                            update("phone", value ?? "")
                        }
                        className="border-1 border-black/10 rounded-lg p-2.5"
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Email Address
                    </Label>

                    <Input
                        className="h-12 rounded-xl"
                        type="email"
                        value={value.email}
                        onChange={(e) =>
                            update("email", e.target.value)
                        }
                        placeholder="john@example.com"
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Street Address
                    </Label>

                    <Input
                        className="h-12 rounded-xl"
                        value={value.address}
                        onChange={(e) =>
                            update("address", e.target.value)
                        }
                        placeholder="House, Street, Area"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        City
                    </Label>

                    <Input
                        className="h-12 rounded-xl"
                        value={value.city}
                        onChange={(e) =>
                            update("city", e.target.value)
                        }
                        placeholder="Sargodha"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        State / Province
                    </Label>

                    <Input
                        className="h-12 rounded-xl"
                        value={value.state}
                        onChange={(e) =>
                            update("state", e.target.value)
                        }
                        placeholder="Punjab"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Postal Code
                    </Label>

                    <Input
                        className="h-12 rounded-xl"
                        value={value.postalCode ?? ""}
                        onChange={(e) =>
                            update("postalCode", e.target.value)
                        }
                        placeholder="40100"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Country
                    </Label>

                    <Input
                        className="h-12 rounded-xl"
                        value={value.country}
                        onChange={(e) =>
                            update("country", e.target.value)
                        }
                        placeholder="Pakistan"
                    />
                </div>

            </div>

        </div>
    );
}