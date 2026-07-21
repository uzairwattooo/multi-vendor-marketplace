"use client";
import {
    BadgeCheck,
    CircleAlert,
    ExternalLink,
    RefreshCw,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";


async function openStripeDashboard() {
    const res = await fetch("/api/stripe/login-link", {
        method: "POST",
    });

    if (!res.ok) {
        toast.error("Unable to open Stripe Dashboard");
        return;
    }

    const data = await res.json();

    window.location.href = data.url;
}

async function refreshStripeStatus() {
    const res = await fetch("/api/stripe/refresh", {
        method: "POST",
    });

    if (!res.ok) {
        toast.error("Unable to refresh Stripe status");
        return;
    }

    window.location.reload();
}

type Props = {
    stripe: {
        connected: boolean;
        chargesEnabled: boolean;
        payoutsEnabled: boolean;
        detailsSubmitted: boolean;
        stripeAccountId: string | null;
    } 
};

export default function StripeStatus({
    stripe,
}: Props) {
    return (
        <section className="rounded-2xl border bg-card p-6 shadow-sm">

            <div className="flex items-center justify-between">

                <div>
                    <h2 className="text-xl font-semibold">
                        Stripe Connect
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage your Stripe account and payout status.
                    </p>
                </div>

                {stripe?.connected ? (
                    <Badge className="bg-green-600 hover:bg-green-600">
                        Connected
                    </Badge>
                ) : (
                    <Badge variant="destructive">
                        Not Connected
                    </Badge>
                )}

            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">

                <StatusItem
                    title="Charges Enabled"
                    status={stripe?.chargesEnabled ?? false}
                />

                <StatusItem
                    title="Payouts Enabled"
                    status={stripe?.payoutsEnabled ?? false}
                />

                <StatusItem
                    title="Details Submitted"
                    status={stripe?.detailsSubmitted ?? false}
                />

                <StatusItem
                    title="Account Connected"
                    status={stripe?.connected ?? false}
                />

            </div>

            <div className="mt-8 flex flex-wrap gap-3">

                <Button onClick={openStripeDashboard} >
                    <ExternalLink className="mr-2 size-4" />
                    Manage Stripe
                </Button>

                <Button
                    variant="outline"
                    onClick={refreshStripeStatus}
                >
                    <RefreshCw className="mr-2 size-4" />
                    Refresh Status
                </Button>
            </div>

        </section>
    );
}

function StatusItem({
    title,
    status,
}: {
    title: string;
    status: boolean;
}) {
    return (
        <div className="flex items-center justify-between rounded-xl border p-4">

            <span className="font-medium">
                {title}
            </span>

            {status ? (
                <div className="flex items-center gap-2 text-green-600">
                    <BadgeCheck className="size-5" />
                    <span className="text-sm font-medium">
                        Enabled
                    </span>
                </div>
            ) : (
                <div className="flex items-center gap-2 text-red-600">
                    <CircleAlert className="size-5" />
                    <span className="text-sm font-medium">
                        Disabled
                    </span>
                </div>
            )}

        </div>
    );
}