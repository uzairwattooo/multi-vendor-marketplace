import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { auth } from "@/lib/auth";
import { getRecentOrders } from "@/lib/seller/get-recent-orders";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";


export default async function RecentOrders() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        notFound();
    }

    const orders = await getRecentOrders(
        session.user.id,
    );
    if (orders.length === 0) {
        return (
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                        Recent Orders
                    </h2>
                </div>

                <div className="flex h-72 flex-col items-center justify-center rounded-xl border border-dashed">
                    <ShoppingBag className="mb-4 h-12 w-12 text-muted-foreground" />

                    <h3 className="text-lg font-semibold">
                        No Orders Yet
                    </h3>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Orders will appear here once customers place them.
                    </p>
                </div>
            </div>
        );
    }
    return (
        <div className="rounded-2xl border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b p-6">
                <div>
                    <h2 className="text-xl font-bold">
                        Recent Orders
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Latest customer orders from your store.
                    </p>
                </div>

                <Button
                    nativeButton={false}
                    variant="outline"
                    render={<Link href="/seller/orders" />}
                >
                    View All
                </Button>
            </div>

            <div className="overflow-x-auto hide-scrollbar ">
                <table className="w-full">
                    <thead className="bg-muted/40">
                        <tr className="border-b">
                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                Order
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                Customer
                            </th>

                            <th className="px-6 py-4 text-center text-sm font-semibold">
                                Status
                            </th>

                            <th className="px-6 py-4 text-right text-sm font-semibold">
                                Total
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {orders.map((order) => (
                            <tr
                                key={order.id}
                                className="border-b transition-colors hover:bg-muted/40"
                            >
                                <td className="px-6 py-4 font-medium">
                                    {order.orderNumber}
                                </td>

                                <td className="px-6 py-4">
                                    {order.customer}
                                </td>

                                <td className="px-6 py-4 text-center">
                                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium capitalize text-primary">
                                        {order.status}
                                    </span>
                                </td>

                                <td className="px-6 py-4 text-right font-semibold text-primary">
                                    Rs. {Number(order.total).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}