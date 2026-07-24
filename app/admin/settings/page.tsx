import { Banknote, CircleCheckBig, Settings2 } from "lucide-react";

import AdminSettingsForm from "@/components/admin/settings/AdminSettingsForm";
import { getPlatformSettings } from "@/lib/admin/get-platform-settings";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminSettingsPage() {
    const settings = await getPlatformSettings();

    return (
        <div className="space-y-8 overflow-x-hidden">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                        Marketplace configuration
                    </p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                        Settings
                    </h1>
                    <p className="mt-2 max-w-3xl text-muted-foreground">
                        Manage business details, commission, checkout methods
                        and marketplace-wide operational defaults.
                    </p>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border bg-card px-4 py-3 shadow-sm">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                        <CircleCheckBig className="size-5" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold">
                            Platform operational
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {settings.currency} · {settings.commissionRate}%
                            commission
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-sm">
                    <Settings2 className="size-5 text-primary" />
                    <div>
                        <p className="text-xs text-muted-foreground">
                            Marketplace
                        </p>
                        <p className="font-semibold">
                            {settings.marketplaceName}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-sm">
                    <Banknote className="size-5 text-primary" />
                    <div>
                        <p className="text-xs text-muted-foreground">
                            Seller share
                        </p>
                        <p className="font-semibold">
                            {Math.max(
                                0,
                                100 - settings.commissionRate,
                            ).toFixed(2)}
                            %
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-sm">
                    <CircleCheckBig className="size-5 text-primary" />
                    <div>
                        <p className="text-xs text-muted-foreground">
                            Payment methods
                        </p>
                        <p className="font-semibold">
                            {[
                                settings.stripeEnabled && "Stripe",
                                settings.codEnabled && "COD",
                            ]
                                .filter(Boolean)
                                .join(" + ")}
                        </p>
                    </div>
                </div>
            </div>

            <AdminSettingsForm initialSettings={settings} />
        </div>
    );
}