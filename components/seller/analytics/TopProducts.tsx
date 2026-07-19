import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getTopProducts } from "@/lib/seller/get-top-products";
import { Button } from "@/components/ui/button";


export default async function TopProducts() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        notFound();
    }

    const products = await getTopProducts(session.user.id);
    return (
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                    Top Selling Products
                </h2>

                <Button variant="outline">
                    <Link href="/seller/products">
                        View All
                    </Link>
                </Button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="py-3 text-left">
                                Product
                            </th>

                            <th className="py-3 text-center">
                                Sold
                            </th>

                            <th className="py-3 text-right">
                                Revenue
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.map((product) => (
                            <tr
                                key={product.id}
                                className="border-b"
                            >
                                <td className="py-4">
                                    {product.name}
                                </td>

                                <td className="text-center">
                                    {product.sold}
                                </td>

                                <td className="text-right font-semibold">
                                    Rs.{" "}
                                    {product.revenue.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}