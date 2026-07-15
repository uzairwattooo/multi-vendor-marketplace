import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import EditProductForm from "@/components/seller/EditProductForm";
import { db } from "@/db";
import { product, store } from "@/db/schema";
import { auth } from "@/lib/auth";

type EditProductPageProps = {
    params: Promise<{
        productId: string;
    }>;
};

export default async function EditProductPage({
    params,
}: EditProductPageProps) {
    const { productId } = await params;

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect(
            `/login?callbackURL=/seller/products/${productId}/edit`,
        );
    }

    const [sellerStore] = await db
        .select({
            id: store.id,
        })
        .from(store)
        .where(
            and(
                eq(store.ownerId, session.user.id),
                eq(store.status, "approved"),
            ),
        )
        .limit(1);

    if (!sellerStore) {
        redirect("/seller/onboarding");
    }

    const [currentProduct] = await db
        .select()
        .from(product)
        .where(
            and(
                eq(product.id, productId),
                eq(product.storeId, sellerStore.id),
            ),
        )
        .limit(1);

    if (!currentProduct) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">
                    Edit Product
                </h1>

                <p className="text-muted-foreground">
                    Update your product information.
                </p>
            </div>

            <EditProductForm product={currentProduct} />
        </div>
    );
}