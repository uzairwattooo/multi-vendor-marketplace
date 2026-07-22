"use client";

import { MapPin } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { StoreSettingsInput } from "@/lib/validations/store";
import {
    FormField,
    nativeSelectClassName,
    SettingsSection,
} from "./SettingsSection";

type AddressInformationProps = {
    form: UseFormReturn<StoreSettingsInput>;
};

export default function AddressInformation({
    form,
}: AddressInformationProps) {
    return (
        <SettingsSection
            icon={MapPin}
            title="Store address"
            description="This address can be used for store operations, returns and business information."
        >
            <div className="grid gap-6 md:grid-cols-2">
                <FormField
                    label="Country"
                    htmlFor="country"
                    error={form.formState.errors.country?.message}
                >
                    <select
                        id="country"
                        className={nativeSelectClassName}
                        {...form.register("country")}
                    >
                        <option value="Pakistan">Pakistan</option>
                    </select>
                </FormField>

                <FormField
                    label="Province / State"
                    htmlFor="state"
                    error={form.formState.errors.state?.message}
                >
                    <Input
                        id="state"
                        placeholder="Punjab"
                        {...form.register("state")}
                    />
                </FormField>

                <FormField
                    label="City"
                    htmlFor="city"
                    error={form.formState.errors.city?.message}
                >
                    <Input
                        id="city"
                        placeholder="Sargodha"
                        {...form.register("city")}
                    />
                </FormField>

                <FormField
                    label="Postal code"
                    htmlFor="postalCode"
                    error={form.formState.errors.postalCode?.message}
                >
                    <Input
                        id="postalCode"
                        placeholder="40100"
                        {...form.register("postalCode")}
                    />
                </FormField>

                <FormField
                    label="Complete address"
                    htmlFor="address"
                    error={form.formState.errors.address?.message}
                    className="md:col-span-2"
                >
                    <Textarea
                        id="address"
                        rows={4}
                        placeholder="House number, street, area and nearby location"
                        {...form.register("address")}
                    />
                </FormField>

                <FormField
                    label="Landmark"
                    htmlFor="landmark"
                    error={form.formState.errors.landmark?.message}
                >
                    <Input
                        id="landmark"
                        placeholder="Near Main Market"
                        {...form.register("landmark")}
                    />
                </FormField>

                <FormField
                    label="Google Maps link"
                    htmlFor="mapsUrl"
                    error={form.formState.errors.mapsUrl?.message}
                >
                    <Input
                        id="mapsUrl"
                        type="url"
                        placeholder="https://maps.google.com/..."
                        {...form.register("mapsUrl")}
                    />
                </FormField>
            </div>
        </SettingsSection>
    );
}
