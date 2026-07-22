import AdminModulePlaceholder from "@/components/admin/AdminModulePlaceholder";

export default function Page() {
    return (
        <AdminModulePlaceholder
            eyebrow="Financial operations"
            title="Payments"
            description="Inspect Stripe and Cash on Delivery payments, fees and transaction status."
            nextStep="Next: payment ledger, provider filters, failed payments and refund records."
        />
    );
}
