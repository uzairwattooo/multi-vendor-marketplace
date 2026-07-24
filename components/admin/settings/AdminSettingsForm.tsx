"use client";

import { useMutation } from "@tanstack/react-query";
import {
    BadgePercent,
    Building2,
    CreditCard,
    Loader2,
    PackageSearch,
    Save,
} from "lucide-react";
import { useState, type ComponentType, type FormEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { PlatformSettingsData } from "@/lib/admin/get-platform-settings";

async function saveSettings(input: PlatformSettingsData) {
    const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Unable to save settings");
    }

    return data as { message: string };
}

function Section({
    icon: Icon,
    title,
    description,
    children,
}: {
    icon: ComponentType<{ className?: string }>;
    title: string;
    description: string;
    children: React.ReactNode;
}) {
    return (
        <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
            <div className="flex gap-3 border-b px-5 py-4 sm:px-6">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                </div>
                <div>
                    <h2 className="font-semibold">{title}</h2>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                        {description}
                    </p>
                </div>
            </div>
            <div className="p-5 sm:p-6">{children}</div>
        </section>
    );
}

function ToggleRow({
    title,
    description,
    checked,
    onCheckedChange,
}: {
    title: string;
    description: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
}) {
    return (
        <div className="flex items-start justify-between gap-5 rounded-xl border bg-muted/20 p-4">
            <div>
                <p className="font-medium">{title}</p>
                <p className="mt-1 text-sm leading-5 text-muted-foreground">
                    {description}
                </p>
            </div>
            <Switch
                checked={checked}
                onCheckedChange={onCheckedChange}
                aria-label={title}
                className="mt-1"
            />
        </div>
    );
}

export default function AdminSettingsForm({
    initialSettings,
}: {
    initialSettings: PlatformSettingsData;
}) {
    const [settings, setSettings] =
        useState<PlatformSettingsData>(initialSettings);

    const mutation = useMutation({
        mutationFn: saveSettings,
        onSuccess: (data) => toast.success(data.message),
        onError: (error) =>
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Unable to save settings",
            ),
    });

    function update<K extends keyof PlatformSettingsData>(
        key: K,
        value: PlatformSettingsData[K],
    ) {
        setSettings((current) => ({ ...current, [key]: value }));
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        mutation.mutate(settings);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 xl:grid-cols-2">
                <Section
                    icon={Building2}
                    title="Marketplace profile"
                    description="Public business identity and support details."
                >
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="marketplaceName">
                                Marketplace name
                            </Label>
                            <Input
                                id="marketplaceName"
                                value={settings.marketplaceName}
                                onChange={(event) =>
                                    update(
                                        "marketplaceName",
                                        event.target.value,
                                    )
                                }
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="supportEmail">
                                Support email
                            </Label>
                            <Input
                                id="supportEmail"
                                type="email"
                                placeholder="support@example.com"
                                value={settings.supportEmail}
                                onChange={(event) =>
                                    update("supportEmail", event.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="supportPhone">
                                Support phone
                            </Label>
                            <Input
                                id="supportPhone"
                                placeholder="+92 300 0000000"
                                value={settings.supportPhone}
                                onChange={(event) =>
                                    update("supportPhone", event.target.value)
                                }
                            />
                        </div>
                    </div>
                </Section>

                <Section
                    icon={BadgePercent}
                    title="Commerce rules"
                    description="Default commission and order limits."
                >
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="commissionRate">
                                Platform commission (%)
                            </Label>
                            <Input
                                id="commissionRate"
                                type="number"
                                min="0"
                                max="50"
                                step="0.01"
                                value={settings.commissionRate}
                                onChange={(event) =>
                                    update(
                                        "commissionRate",
                                        Number(event.target.value),
                                    )
                                }
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                Seller receives{" "}
                                {Math.max(
                                    0,
                                    100 - settings.commissionRate,
                                ).toFixed(2)}
                                % of each order.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="minimumOrderAmount">
                                Minimum order ({settings.currency})
                            </Label>
                            <Input
                                id="minimumOrderAmount"
                                type="number"
                                min="0"
                                step="1"
                                value={settings.minimumOrderAmount}
                                onChange={(event) =>
                                    update(
                                        "minimumOrderAmount",
                                        Number(event.target.value),
                                    )
                                }
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="currency">Currency</Label>
                            <select
                                id="currency"
                                value={settings.currency}
                                onChange={(event) =>
                                    update(
                                        "currency",
                                        event.target.value as "PKR" | "USD",
                                    )
                                }
                                className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                            >
                                <option value="PKR">PKR — Pakistani Rupee</option>
                                <option value="USD">USD — US Dollar</option>
                            </select>
                        </div>
                    </div>
                </Section>
            </div>

            <div>
                <Section
                    icon={CreditCard}
                    title="Payment methods"
                    description="At least one checkout method must stay active."
                >
                    <div className="space-y-3">
                        <ToggleRow
                            title="Stripe payments"
                            description="Accept secure online card payments through Stripe."
                            checked={settings.stripeEnabled}
                            onCheckedChange={(value) =>
                                update("stripeEnabled", value)
                            }
                        />
                        <ToggleRow
                            title="Cash on Delivery"
                            description="Allow buyers to pay when their order arrives."
                            checked={settings.codEnabled}
                            onCheckedChange={(value) =>
                                update("codEnabled", value)
                            }
                        />
                    </div>
                </Section>
            </div>

            <div className="sticky bottom-4 z-20 flex flex-col gap-3 rounded-2xl border bg-background/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <PackageSearch className="size-4" />
                    Changes affect new marketplace transactions.
                </div>
                <Button
                    type="submit"
                    className="rounded-xl sm:min-w-40"
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        <Save />
                    )}
                    {mutation.isPending ? "Saving..." : "Save settings"}
                </Button>
            </div>
        </form>
    );
}