import { notFound } from "next/navigation";

import AdminProductEditForm from "@/components/admin/products/AdminProductEditForm";
import { getAdminProductDetails } from "@/lib/admin/get-admin-product-details";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type AdminProductEditPageProps = {
    params: Promise<{
        productId: string;
    }>;
};

export default async function AdminProductEditPage({
    params,
}: AdminProductEditPageProps) {
    const { productId } = await params;
    const result = await getAdminProductDetails(productId);

    if (!result) {
        notFound();
    }

    return (
        <div className="space-y-8">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                    Catalog administration
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight">
                    Edit product
                </h1>
                <p className="mt-2 max-w-2xl text-muted-foreground">
                    Update catalog information without changing seller ownership,
                    product URL or live inventory quantities.
                </p>
            </div>

            <AdminProductEditForm
                product={{
                    id: result.product.id,
                    name: result.product.name,
                    description: result.product.description,
                    category: result.product.category,
                    brand: result.product.brand,
                    sku: result.product.sku,
                    price: result.product.price,
                    salePrice: result.product.salePrice,
                    lowStockThreshold:
                        result.product.lowStockThreshold,
                }}
                categories={result.categories}
            />
        </div>
    );
}
