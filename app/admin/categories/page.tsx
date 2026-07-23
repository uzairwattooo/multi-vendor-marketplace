import {
    Folder,
    FolderTree,
    Package,
    Unlink,
} from "lucide-react";

import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminCategoriesClient from "@/components/admin/categories/AdminCategoriesClient";
import { getAdminCategories } from "@/lib/admin/get-admin-categories";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminCategoriesPage() {
    const result = await getAdminCategories();

    return (
        <div className="space-y-8">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                    Catalog structure
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight">
                    Marketplace categories
                </h1>
                <p className="mt-2 max-w-2xl text-muted-foreground">
                    Build the product hierarchy used by marketplace navigation,
                    filtering and admin catalog organization.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <AdminStatCard
                    title="All Categories"
                    value={result.stats.total.toLocaleString()}
                    description="Complete catalog structure"
                    icon={FolderTree}
                />
                <AdminStatCard
                    title="Root Categories"
                    value={result.stats.root.toLocaleString()}
                    description="Top-level marketplace navigation"
                    icon={Folder}
                    accent="blue"
                />
                <AdminStatCard
                    title="Child Categories"
                    value={result.stats.child.toLocaleString()}
                    description="Nested category groups"
                    icon={FolderTree}
                    accent="success"
                />
                <AdminStatCard
                    title="In Use"
                    value={result.stats.used.toLocaleString()}
                    description="Categories assigned to products"
                    icon={Package}
                    accent="success"
                />
                <AdminStatCard
                    title="Empty"
                    value={result.stats.empty.toLocaleString()}
                    description="No products currently assigned"
                    icon={Unlink}
                    accent="warning"
                />
            </div>

            <AdminCategoriesClient categories={result.categories} />
        </div>
    );
}
