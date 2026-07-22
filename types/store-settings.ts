import type { StoreSettingsInput } from "@/lib/validations/store";

export type StoreStatus =
    | "pending"
    | "approved"
    | "rejected"
    | "suspended";

export type StoreSettingsData = StoreSettingsInput & {
    id: string;
    slug: string;
    status: StoreStatus;
    rejectionReason: string | null;
    stripeAccountId: string | null;
    isStripeConnected: boolean;
    stripeChargesEnabled: boolean;
    stripePayoutsEnabled: boolean;
    stripeDetailsSubmitted: boolean;
};

export type StripeConnectionStatus = {
    hasAccount: boolean;
    connected: boolean;
    accountId: string | null;
    chargesEnabled: boolean;
    payoutsEnabled: boolean;
    detailsSubmitted: boolean;
};
