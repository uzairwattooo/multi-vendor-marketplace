import {
    ExternalLink,
    RefreshCw,
    ShieldCheck,
    CreditCard,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function PayoutSettings() {
    return (
        <section className="rounded-2xl border bg-card p-6 shadow-sm">

            <div className="mb-6">
                <h2 className="text-xl font-semibold">
                    Payout Settings
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                    Manage your Stripe account, bank details and payout
                    preferences securely from Stripe.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">

                <div className="rounded-xl border p-5">

                    <div className="mb-4 flex items-center gap-3">

                        <div className="rounded-lg bg-primary/10 p-3">
                            <CreditCard className="size-6 text-primary" />
                        </div>

                        <div>
                            <h3 className="font-semibold">
                                Stripe Dashboard
                            </h3>

                            <p className="text-sm text-muted-foreground">
                                Bank account, tax information and payout
                                schedule.
                            </p>
                        </div>

                    </div>

                    <Button className="w-full">
                        <ExternalLink className="mr-2 size-4" />
                        Open Stripe Dashboard
                    </Button>

                </div>

                <div className="rounded-xl border p-5">

                    <div className="mb-4 flex items-center gap-3">

                        <div className="rounded-lg bg-primary/10 p-3">
                            <ShieldCheck className="size-6 text-primary" />
                        </div>

                        <div>
                            <h3 className="font-semibold">
                                Sync Account
                            </h3>

                            <p className="text-sm text-muted-foreground">
                                Refresh your Stripe account status and balances.
                            </p>
                        </div>

                    </div>

                    <Button
                        variant="outline"
                        className="w-full"
                    >
                        <RefreshCw className="mr-2 size-4" />
                        Refresh Status
                    </Button>

                </div>

            </div>

        </section>
    );
}