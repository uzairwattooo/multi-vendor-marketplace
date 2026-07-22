import AdminModulePlaceholder from "@/components/admin/AdminModulePlaceholder";

export default function Page() {
    return (
        <AdminModulePlaceholder
            eyebrow="Stock monitoring"
            title="Inventory"
            description="Monitor marketplace stock, low-stock products and out-of-stock listings."
            nextStep="Next: inventory overview, threshold filters and seller/store drill-down."
        />
    );
}
