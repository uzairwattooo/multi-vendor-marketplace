"use server";

import { stripe } from "@/lib/stripe";

export type StripeBalanceData = {
    available: number;
    pending: number;
    nextPayout: Date | null;
    currency: string;
};

export async function getStripeBalanceService(
    stripeAccountId: string,
): Promise<StripeBalanceData> {
    if (!stripeAccountId) {
        throw new Error("Stripe account is not connected." );
    }

    const balance = await stripe.balance.retrieve(
        {},
        {
            stripeAccount: stripeAccountId,
        }
    );

    const available =
        balance.available.reduce(
            (total, item) => total + item.amount,
            0,
        ) / 100;

    const pending =
        balance.pending.reduce(
            (total, item) => total + item.amount,
            0,
        ) / 100;

    const payouts = await stripe.payouts.list(
        {
            limit: 1,
        },
        {
            stripeAccount: stripeAccountId,
        }
    );

    return {
        available,
        pending,
        currency:
            balance.available[0]?.currency ??
            balance.pending[0]?.currency ??
            "usd",
        nextPayout: payouts.data.length
            ? new Date(
                payouts.data[0].arrival_date * 1000,
            )
            : null,
    };
}