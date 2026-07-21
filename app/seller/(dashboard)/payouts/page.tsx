import PayoutStats from "@/components/seller/payouts/PayoutStats";
import StripeStatus from "@/components/seller/payouts/StripeStatus";
import BalanceCards from "@/components/seller/payouts/BalanceCards";
import PayoutHistory from "@/components/seller/payouts/PayoutHistory";
import PendingPayoutOrders from "@/components/seller/payouts/PendingPayoutOrders";
import PayoutSettings from "@/components/seller/payouts/PayoutSettings";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getStripeStatus } from "@/lib/seller/get-stripe-status";
import { getPayoutStats } from "@/lib/seller/get-payout-stats";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { store } from "@/db/schema";
import { getStripeBalanceService } from "@/services/stripe-service";

export default async function SellerPayoutPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        notFound();
    }

    const stripeStatus = await getStripeStatus(
        session.user.id,
    );
    const payoutStats =
        await getPayoutStats(session.user.id);


    const sellerStore = await db.query.store.findFirst({
        where: eq(store.ownerId, session.user.id),
    });

    if (!sellerStore?.stripeAccountId) {
        throw new Error("Stripe account not connected.");
    }

    const stripeBalance = await getStripeBalanceService(
        sellerStore.stripeAccountId,
    );
    return (
        <div className="space-y-6">

            <PayoutStats
                stats={payoutStats}
            />

            <StripeStatus
                stripe={stripeStatus}
            />



            <BalanceCards stripeBalance={stripeBalance} />

            <PendingPayoutOrders />

            <PayoutHistory />

            <PayoutSettings />

        </div>
    );
}