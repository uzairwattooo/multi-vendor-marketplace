"use client";

import { Building2 } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";
import type { StoreSettingsInput } from "@/lib/validations/store";
import {
    FormField,
    nativeSelectClassName,
    SettingsSection,
} from "./SettingsSection";

type BusinessInformationProps = {
    form: UseFormReturn<StoreSettingsInput>;
};

export default function BusinessInformation({
    form,
}: BusinessInformationProps) {
    return (
        <SettingsSection
            icon={Building2}
            title="Business information"
            description="Add optional legal and tax information for your business records."
        >
            <div className="grid gap-6 md:grid-cols-2">
                <FormField
                    label="Business type"
                    htmlFor="businessType"
                    error={form.formState.errors.businessType?.message}
                >
                    <select
                        id="businessType"
                        className={nativeSelectClassName}
                        {...form.register("businessType")}
                    >
                        <option value="individual">Individual</option>
                        <option value="company">Company</option>
                    </select>
                </FormField>

                <FormField
                    label="Legal business name"
                    htmlFor="businessName"
                    error={form.formState.errors.businessName?.message}
                >
                    <Input
                        id="businessName"
                        placeholder="ABC Traders"
                        {...form.register("businessName")}
                    />
                </FormField>

                <FormField
                    label="Registration number"
                    htmlFor="registrationNumber"
                    error={form.formState.errors.registrationNumber?.message}
                >
                    <Input
                        id="registrationNumber"
                        placeholder="REG-123456"
                        {...form.register("registrationNumber")}
                    />
                </FormField>

                <FormField
                    label="NTN"
                    htmlFor="ntn"
                    error={form.formState.errors.ntn?.message}
                >
                    <Input
                        id="ntn"
                        placeholder="1234567-8"
                        {...form.register("ntn")}
                    />
                </FormField>

                <FormField
                    label="STRN"
                    htmlFor="strn"
                    error={form.formState.errors.strn?.message}
                    hint="Optional sales tax registration number."
                    className="md:col-span-2"
                >
                    <Input
                        id="strn"
                        placeholder="Sales tax registration number"
                        {...form.register("strn")}
                    />
                </FormField>
            </div>
        </SettingsSection>
    );
}
