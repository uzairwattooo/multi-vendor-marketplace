import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const orders = [
    {
        id: "ORD-1001",
        customer: "Muhammad Ali",
        amount: 3500,
        status: "Pending",
        expected: "22 Jul 2026",
    },
    {
        id: "ORD-1002",
        customer: "Ahmed Khan",
        amount: 2400,
        status: "Pending",
        expected: "22 Jul 2026",
    },
    {
        id: "ORD-1003",
        customer: "Usman",
        amount: 5800,
        status: "Pending",
        expected: "23 Jul 2026",
    },
];

export default function PendingPayoutOrders() {
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
                <Link  href="/seller/orders">
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
                                    {order.id}
                                </td>
                                <td>
                                    {order.customer}
                                </td>
                                <td className="text-right font-semibold">
                                    Rs.{" "}
                                    {order.amount.toLocaleString()}
                                </td>
                                <td className="text-center">
                                    <Badge
                                        className="bg-yellow-500 hover:bg-yellow-500"
                                    >
                                        {order.status}
                                    </Badge>
                                </td>
                                <td className="text-right text-muted-foreground">
                                    {order.expected}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}