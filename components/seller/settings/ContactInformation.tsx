"use client";

import { Mail, Phone } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";
import type { StoreSettingsInput } from "@/lib/validations/store";
import { FormField, SettingsSection } from "./SettingsSection";

type ContactInformationProps = {
    form: UseFormReturn<StoreSettingsInput>;
};

export default function ContactInformation({
    form,
}: ContactInformationProps) {
    return (
        <SettingsSection
            icon={Mail}
            title="Contact information"
            description="Keep the business contact details used for customers and marketplace communication up to date."
        >
            <div className="grid gap-6 md:grid-cols-2">
                <FormField
                    label="Business email"
                    htmlFor="email"
                    error={form.formState.errors.email?.message}
                >
                    <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="email"
                            type="email"
                            className="pl-9"
                            placeholder="store@example.com"
                            {...form.register("email")}
                        />
                    </div>
                </FormField>

                <FormField
                    label="Business phone"
                    htmlFor="phone"
                    error={form.formState.errors.phone?.message}
                >
                    <div className="relative">
                        <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="phone"
                            type="tel"
                            className="pl-9"
                            placeholder="03001234567"
                            {...form.register("phone")}
                        />
                    </div>
                </FormField>
            </div>
        </SettingsSection>
    );
}
