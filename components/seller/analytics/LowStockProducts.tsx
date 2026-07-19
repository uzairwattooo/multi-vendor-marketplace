import { AlertTriangle } from "lucide-react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getLowStockProducts } from "@/lib/seller/get-low-stock-products";

export default async function LowStockProducts() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        notFound();
    }

    const products = await getLowStockProducts(
        session.user.id,
    );
    if (products.length === 0) {
    return (
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">
                Low Stock Products
            </h2>

            <div className="flex h-56 items-center justify-center rounded-xl border border-dashed">
                <p className="text-muted-foreground">
                    🎉 All products have sufficient stock.
                </p>
            </div>
        </div>
    );
}
    return (
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold">
                Low Stock Products
            </h2>

            <div className="space-y-4">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="flex items-center justify-between rounded-xl border p-4"
                    >
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="text-yellow-500" />

                            <div>
                                <h3 className="font-medium">
                                    {product.name}
                                </h3>

                                <p className="text-sm text-muted-foreground">
                                    Stock Left
                                </p>
                            </div>
                        </div>

                        <span className="font-bold text-red-500">
                            {product.stock}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}