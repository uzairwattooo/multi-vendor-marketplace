import {
    BadgeCheck,
    Landmark,
    ShieldCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

export default function PayoutPageHeader({
    storeName,
    ready,
}: {
    storeName: string;
    ready: boolean;
}) {
    return (
        <header className="relative overflow-hidden rounded-3xl border bg-card px-6 py-7 shadow-sm sm:px-8 sm:py-8">
            <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 left-1/3 size-56 rounded-full bg-violet-400/10 blur-3xl" />

            <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex items-start gap-4">
                    <div className="hidden rounded-2xl bg-primary/10 p-4 text-primary sm:block">
                        <Landmark className="size-7" />
                    </div>

                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                                Seller Finance
                            </p>
                            <Badge
                                variant="outline"
                                className="border-primary/20 bg-primary/5 text-primary"
                            >
                                Stripe Connect
                            </Badge>
                        </div>

                        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                            Payouts &amp; Earnings
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                            Track {storeName}&apos;s earnings, live Stripe
                            balance, pending orders and bank payout activity.
                        </p>
                    </div>
                </div>

                <div className="flex w-fit items-center gap-3 rounded-2xl border bg-background/80 px-4 py-3 backdrop-blur">
                    <div
                        className={
                            ready
                                ? "rounded-full bg-emerald-100 p-2 text-emerald-700"
                                : "rounded-full bg-amber-100 p-2 text-amber-700"
                        }
                    >
                        {ready ? (
                            <BadgeCheck className="size-5" />
                        ) : (
                            <ShieldCheck className="size-5" />
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-semibold">
                            {ready
                                ? "Payout account ready"
                                : "Setup requires attention"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {ready
                                ? "Payments and bank payouts are enabled."
                                : "Complete Stripe verification to receive funds."}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}
