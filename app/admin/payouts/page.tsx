import AdminModulePlaceholder from "@/components/admin/AdminModulePlaceholder";

export default function Page() {
    return (
        <AdminModulePlaceholder
            eyebrow="Seller finance"
            title="Payouts"
            description="Review seller balances and process eligible marketplace payouts safely."
            nextStep="Next: eligibility checks, payout queue, Stripe transfer status and history."
        />
    );
}
