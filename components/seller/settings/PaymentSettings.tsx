"use client";

import { useEffect, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import {
    CheckCircle2,
    CircleAlert,
    CreditCard,
    ExternalLink,
    Loader2,
    RefreshCw,
    ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { StripeConnectionStatus } from "@/types/store-settings";
import { SettingsSection } from "./SettingsSection";

type PaymentSettingsProps = {
    initialStatus: StripeConnectionStatus;
};

async function fetchStripeStatus(): Promise<StripeConnectionStatus> {
    const response = await fetch("/api/stripe/status", {
        cache: "no-store",
    });
    const data = (await response.json()) as
        | StripeConnectionStatus
        | { message?: string };

    if (!response.ok) {
        throw new Error(data.message ?? "Unable to fetch Stripe status");
    }

    return data as StripeConnectionStatus;
}

async function postForRedirect(
    endpoint: string,
): Promise<{ url?: string; success?: boolean }> {
    const response = await fetch(endpoint, { method: "POST" });
    const data = (await response.json()) as {
        url?: string;
        success?: boolean;
        message?: string;
    };

    if (!response.ok) {
        throw new Error(data.message ?? "Request failed");
    }

    return data;
}

export default function PaymentSettings({
    initialStatus,
}: PaymentSettingsProps) {
    const searchParams = useSearchParams();
    const handledReturn = useRef(false);

    const statusQuery = useQuery({
        queryKey: ["seller-stripe-status"],
        queryFn: fetchStripeStatus,
        initialData: initialStatus,
        refetchOnWindowFocus: false,
    });

    const connectMutation = useMutation({
        mutationFn: () => postForRedirect("/api/stripe/connect"),
        onSuccess: (data) => {
            if (data.url) {
                window.location.assign(data.url);
                return;
            }

            toast.error("Stripe onboarding link was not returned");
        },
        onError: (error) => {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Unable to connect Stripe",
            );
        },
    });

    const dashboardMutation = useMutation({
        mutationFn: () => postForRedirect("/api/stripe/login-link"),
        onSuccess: (data) => {
            if (data.url) {
                window.open(data.url, "_blank", "noopener,noreferrer");
                return;
            }

            toast.error("Stripe dashboard link was not returned");
        },
        onError: (error) => {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Unable to open Stripe dashboard",
            );
        },
    });

    const refreshMutation = useMutation({
        mutationFn: () => postForRedirect("/api/stripe/refresh"),
        onSuccess: async () => {
            await statusQuery.refetch();
            toast.success("Stripe status refreshed");
        },
        onError: (error) => {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Unable to refresh Stripe status",
            );
        },
    });

    useEffect(() => {
        const stripeReturn = searchParams.get("stripe");

        if (!stripeReturn || handledReturn.current) {
            return;
        }

        handledReturn.current = true;

        if (stripeReturn === "success") {
            void statusQuery.refetch().then(() => {
                toast.success("Stripe onboarding details received");
            });
        }

        if (stripeReturn === "refresh") {
            toast.info("Please continue Stripe onboarding");
            connectMutation.mutate();
        }
    }, [connectMutation, searchParams, statusQuery]);

    const status = statusQuery.data;
    const actionPending =
        connectMutation.isPending ||
        dashboardMutation.isPending ||
        refreshMutation.isPending;

    return (
        <SettingsSection
            icon={CreditCard}
            title="Payment settings"
            description="Connect Stripe Express to receive card payments and seller payouts securely."
        >
            <div className="rounded-2xl border bg-muted/20 p-5 sm:p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-4">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#635bff]/10 text-[#635bff]">
                            <CreditCard className="size-6" />
                        </div>

                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-lg font-semibold">
                                    Stripe Connect
                                </h3>
                                <Badge
                                    variant={status.connected ? "default" : "secondary"}
                                >
                                    {status.connected
                                        ? "Ready for payments"
                                        : status.hasAccount
                                          ? "Setup incomplete"
                                          : "Not connected"}
                                </Badge>
                            </div>

                            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                                Stripe handles account verification, card payments and
                                transfers to your connected seller account.
                            </p>

                            {status.accountId && (
                                <p className="mt-2 font-mono text-xs text-muted-foreground">
                                    Account: {status.accountId}
                                </p>
                            )}
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => refreshMutation.mutate()}
                        disabled={!status.hasAccount || actionPending}
                    >
                        <RefreshCw
                            className={
                                refreshMutation.isPending
                                    ? "size-4 animate-spin"
                                    : "size-4"
                            }
                        />
                        Refresh status
                    </Button>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <StatusCard
                        label="Account details"
                        enabled={status.detailsSubmitted}
                    />
                    <StatusCard
                        label="Card charges"
                        enabled={status.chargesEnabled}
                    />
                    <StatusCard
                        label="Seller payouts"
                        enabled={status.payoutsEnabled}
                    />
                </div>

                {statusQuery.isError && (
                    <div className="mt-5 flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
                        <CircleAlert className="mt-0.5 size-4 shrink-0" />
                        <p>{statusQuery.error.message}</p>
                    </div>
                )}

                <div className="mt-6 flex flex-wrap gap-3">
                    {!status.connected && (
                        <Button
                            type="button"
                            onClick={() => connectMutation.mutate()}
                            disabled={actionPending}
                        >
                            {connectMutation.isPending ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                <ShieldCheck className="size-4" />
                            )}
                            {status.hasAccount
                                ? "Continue Stripe setup"
                                : "Connect Stripe"}
                        </Button>
                    )}

                    {status.hasAccount && status.detailsSubmitted && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => dashboardMutation.mutate()}
                            disabled={actionPending}
                        >
                            {dashboardMutation.isPending ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                <ExternalLink className="size-4" />
                            )}
                            Open Stripe dashboard
                        </Button>
                    )}
                </div>
            </div>

            <div className="mt-5 rounded-xl border border-primary/15 bg-primary/5 p-4">
                <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
                    <div>
                        <h4 className="text-sm font-semibold">
                            Secure marketplace payments
                        </h4>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                            Sensitive banking and verification details are completed on
                            Stripe. They are not stored in this application.
                        </p>
                    </div>
                </div>
            </div>
        </SettingsSection>
    );
}

type StatusCardProps = {
    label: string;
    enabled: boolean;
};

function StatusCard({ label, enabled }: StatusCardProps) {
    return (
        <div className="rounded-xl border bg-background p-4">
            <div className="flex items-center gap-2">
                {enabled ? (
                    <CheckCircle2 className="size-4 text-emerald-600" />
                ) : (
                    <CircleAlert className="size-4 text-amber-600" />
                )}
                <span className="text-sm font-medium">{label}</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
                {enabled ? "Enabled" : "Action required"}
            </p>
        </div>
    );
}
