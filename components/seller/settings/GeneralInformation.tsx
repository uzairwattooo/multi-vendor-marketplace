"use client";

import { Globe2, Store } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { StoreSettingsInput } from "@/lib/validations/store";
import {
    FormField,
    nativeSelectClassName,
    SettingsSection,
} from "./SettingsSection";

const categories = [
    "Electronics",
    "Fashion",
    "Home & Living",
    "Beauty & Personal Care",
    "Sports & Fitness",
    "Books & Stationery",
    "Kids & Toys",
    "Food & Grocery",
    "Other",
];

type GeneralInformationProps = {
    form: UseFormReturn<StoreSettingsInput>;
    slug: string;
};

export default function GeneralInformation({
    form,
    slug,
}: GeneralInformationProps) {
    const description = form.watch("description");

    return (
        <SettingsSection
            icon={Store}
            title="Store information"
            description="Manage the main information customers see across the marketplace."
        >
            <div className="grid gap-6 md:grid-cols-2">
                <FormField
                    label="Store name"
                    htmlFor="name"
                    error={form.formState.errors.name?.message}
                >
                    <Input
                        id="name"
                        placeholder="e.g. Uzair Tech Store"
                        {...form.register("name")}
                    />
                </FormField>

                <FormField
                    label="Store category"
                    htmlFor="category"
                    error={form.formState.errors.category?.message}
                >
                    <select
                        id="category"
                        className={nativeSelectClassName}
                        {...form.register("category")}
                    >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </FormField>

                <FormField
                    label="Store URL"
                    htmlFor="slug"
                    hint="The slug is generated automatically by the backend when the store name changes."
                    className="md:col-span-2"
                >
                    <div className="flex h-9 items-center gap-2 rounded-md border bg-muted/40 px-3 text-sm text-muted-foreground">
                        <Globe2 className="size-4 shrink-0" />
                        <span className="truncate">/stores/{slug}</span>
                    </div>
                </FormField>

                <FormField
                    label="Store description"
                    htmlFor="description"
                    error={form.formState.errors.description?.message}
                    className="md:col-span-2"
                >
                    <Textarea
                        id="description"
                        rows={7}
                        placeholder="Describe your products, customers and what makes your store different."
                        {...form.register("description")}
                    />
                    <div className="flex justify-end">
                        <span className="text-xs text-muted-foreground">
                            {description.length}/1000
                        </span>
                    </div>
                </FormField>
            </div>
        </SettingsSection>
    );
}
