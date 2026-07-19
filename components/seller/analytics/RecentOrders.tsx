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
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                    Recent Orders
                </h2>

                <Button variant="outline">
                    <Link href="/seller/orders">
                        View All
                    </Link>
                </Button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="py-3 text-left">
                                Order
                            </th>

                            <th className="py-3 text-left">
                                Customer
                            </th>

                            <th className="py-3 text-center">
                                Status
                            </th>

                            <th className="py-3 text-right">
                                Total
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} className="border-b-1 border-black/10 p-2">
                                <td>{order.orderNumber}</td>
                                <td>{order.customer}</td>
                                <td>Rs. {Number(order.total).toLocaleString()}</td>
                                <td>{order.paymentStatus}</td>
                                <td>{order.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}