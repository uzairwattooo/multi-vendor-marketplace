import AdminModulePlaceholder from "@/components/admin/AdminModulePlaceholder";

export default function Page() {
    return (
        <AdminModulePlaceholder
            eyebrow="Catalog structure"
            title="Categories"
            description="Create and manage the category structure used across the marketplace."
            nextStep="Next: category CRUD, parent categories, image management and product counts."
        />
    );
}
