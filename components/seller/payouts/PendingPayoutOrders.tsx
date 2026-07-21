import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getPendingPayoutOrders } from "@/lib/actions/payout";
import { Card,CardTitle,CardHeader,CardContent } from "@/components/ui/card";



export default async function PendingPayoutOrders() {
    const orders = await getPendingPayoutOrders();
    if (orders.length === 0) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Pending Payout Orders</CardTitle>
            </CardHeader>

            <CardContent className="py-10 text-center text-muted-foreground">
                No pending payout orders.
            </CardContent>
        </Card>
    );
}
    return (
        <section className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold">
                        Pending Payout Orders
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Orders that will be included in your upcoming payout.
                    </p>
                </div>
                <Link href="/seller/orders">
                    View Orders
                    <ArrowRight className="ml-2 size-4" />
                </Link>
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
                            <th className="py-3 text-right">
                                Amount
                            </th>
                            <th className="py-3 text-center">
                                Status
                            </th>
                            <th className="py-3 text-right">
                                Expected
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr
                                key={order.id}
                                className="border-b"
                            >
                                <td className="py-4 font-medium">
                                    {order.orderNumber}
                                </td>
                                <td>
                                    {order.customer}
                                </td>
                                <td className="text-right font-semibold">
                                    Rs. {Number(order.amount).toLocaleString()}
                                </td>
                                <td className="text-center">
                                    <Badge
                                        className="bg-yellow-500 hover:bg-yellow-500"
                                    >
                                        {order.status}
                                    </Badge>
                                </td>
                                <td className="text-right text-muted-foreground">
                                    {order.expected
                                        ? new Date(order.expected).toLocaleDateString()
                                        : "Pending"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}