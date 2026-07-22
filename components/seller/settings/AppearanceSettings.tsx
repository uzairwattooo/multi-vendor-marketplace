"use client";

import Image from "next/image";
import { Palette } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";
import type { StoreSettingsInput } from "@/lib/validations/store";
import { FormField, SettingsSection } from "./SettingsSection";
import StoreAssetUploader from "./StoreAssetUploader";

type AppearanceSettingsProps = {
    form: UseFormReturn<StoreSettingsInput>;
};

export default function AppearanceSettings({
    form,
}: AppearanceSettingsProps) {
    const storeName = form.watch("name");
    const description = form.watch("description");
    const logo = form.watch("logo");
    const banner = form.watch("banner");
    const primaryColor = form.watch("primaryColor");
    const secondaryColor = form.watch("secondaryColor");

    return (
        <div className="space-y-6">
            <SettingsSection
                icon={Palette}
                title="Store appearance"
                description="Upload your store branding and choose the colors used on the public store page."
            >
                <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
                    <div>
                        <h3 className="mb-3 text-sm font-semibold">Store logo</h3>
                        <StoreAssetUploader
                            assetType="logo"
                            value={logo}
                            storeName={storeName}
                            onChange={(url) =>
                                form.setValue("logo", url, {
                                    shouldDirty: true,
                                    shouldValidate: true,
                                })
                            }
                        />
                    </div>

                    <div>
                        <h3 className="mb-3 text-sm font-semibold">Store banner</h3>
                        <StoreAssetUploader
                            assetType="banner"
                            value={banner}
                            storeName={storeName}
                            onChange={(url) =>
                                form.setValue("banner", url, {
                                    shouldDirty: true,
                                    shouldValidate: true,
                                })
                            }
                        />
                    </div>
                </div>

                <div className="mt-8 grid gap-6 md:grid-cols-2">
                    <FormField
                        label="Primary brand color"
                        htmlFor="primaryColor"
                        error={form.formState.errors.primaryColor?.message}
                    >
                        <div className="flex items-center gap-3">
                            <Input
                                id="primaryColor"
                                type="color"
                                className="h-10 w-14 cursor-pointer p-1"
                                {...form.register("primaryColor")}
                            />
                            <Input
                                value={primaryColor}
                                onChange={(event) =>
                                    form.setValue(
                                        "primaryColor",
                                        event.target.value,
                                        {
                                            shouldDirty: true,
                                            shouldValidate: true,
                                        },
                                    )
                                }
                            />
                        </div>
                    </FormField>

                    <FormField
                        label="Secondary brand color"
                        htmlFor="secondaryColor"
                        error={form.formState.errors.secondaryColor?.message}
                    >
                        <div className="flex items-center gap-3">
                            <Input
                                id="secondaryColor"
                                type="color"
                                className="h-10 w-14 cursor-pointer p-1"
                                {...form.register("secondaryColor")}
                            />
                            <Input
                                value={secondaryColor}
                                onChange={(event) =>
                                    form.setValue(
                                        "secondaryColor",
                                        event.target.value,
                                        {
                                            shouldDirty: true,
                                            shouldValidate: true,
                                        },
                                    )
                                }
                            />
                        </div>
                    </FormField>
                </div>
            </SettingsSection>

            <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
                <div className="border-b px-5 py-4 sm:px-7">
                    <h3 className="font-semibold">Live store preview</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Preview how your current branding will look to customers.
                    </p>
                </div>

                <div className="p-5 sm:p-7">
                    <div className="overflow-hidden rounded-2xl border bg-background">
                        <div
                            className="relative aspect-[4/1] min-h-36"
                            style={{ backgroundColor: primaryColor }}
                        >
                            {banner && (
                                <Image
                                    src={banner}
                                    alt={`${storeName || "Store"} banner preview`}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 800px"
                                    className="object-cover"
                                />
                            )}
                            <div className="absolute inset-0 bg-black/20" />
                        </div>

                        <div className="relative px-5 pb-6 sm:px-7">
                            <div className="-mt-10 flex flex-col gap-4 sm:flex-row sm:items-end">
                                <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl border-4 border-background bg-muted shadow-sm">
                                    {logo ? (
                                        <Image
                                            src={logo}
                                            alt={`${storeName || "Store"} logo preview`}
                                            fill
                                            sizes="96px"
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-2xl font-bold text-muted-foreground">
                                            {(storeName || "ST")
                                                .split(" ")
                                                .map((word) => word.charAt(0))
                                                .join("")
                                                .slice(0, 2)
                                                .toUpperCase()}
                                        </div>
                                    )}
                                </div>

                                <div className="pb-1">
                                    <h3
                                        className="text-2xl font-bold"
                                        style={{ color: secondaryColor }}
                                    >
                                        {storeName || "Your Store"}
                                    </h3>
                                    <p className="mt-1 line-clamp-2 max-w-2xl text-sm text-muted-foreground">
                                        {description ||
                                            "Your store description will appear here."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
