import {
    CheckCircle2,
    Clock3,
    XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

const payouts = [
    {
        id: "PAYOUT-001",
        stripeId: "po_3QAbCdEfGh",
        amount: 18500,
        method: "Bank Account",
        date: "18 Jul 2026",
        status: "Paid",
    },
    {
        id: "PAYOUT-002",
        stripeId: "po_3XYzAbCdEf",
        amount: 9200,
        method: "Bank Account",
        date: "12 Jul 2026",
        status: "Paid",
    },
    {
        id: "PAYOUT-003",
        stripeId: "po_9MnOpQrSt",
        amount: 7600,
        method: "Bank Account",
        date: "22 Jul 2026",
        status: "Pending",
    },
    {
        id: "PAYOUT-004",
        stripeId: "po_7UvWxYz12",
        amount: 4100,
        method: "Bank Account",
        date: "03 Jul 2026",
        status: "Failed",
    },
];

export default function PayoutHistory() {
    return (
        <section className="rounded-2xl border bg-card p-6 shadow-sm">

            <div className="mb-6">

                <h2 className="text-xl font-semibold">
                    Payout History
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                    Complete history of all Stripe payouts.
                </p>

            </div>

            <div className="overflow-x-auto">

                <table className="w-full">

                    <thead>

                        <tr className="border-b">

                            <th className="py-3 text-left">
                                Payout ID
                            </th>

                            <th className="py-3 text-left">
                                Stripe ID
                            </th>

                            <th className="py-3 text-right">
                                Amount
                            </th>

                            <th className="py-3 text-center">
                                Method
                            </th>

                            <th className="py-3 text-center">
                                Status
                            </th>

                            <th className="py-3 text-right">
                                Date
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {payouts.map((payout) => (

                            <tr
                                key={payout.id}
                                className="border-b"
                            >

                                <td className="py-4 font-medium">
                                    {payout.id}
                                </td>

                                <td className="font-mono text-sm text-muted-foreground">
                                    {payout.stripeId}
                                </td>

                                <td className="text-right font-semibold">
                                    Rs.{" "}
                                    {payout.amount.toLocaleString()}
                                </td>

                                <td className="text-center">
                                    {payout.method}
                                </td>

                                <td className="text-center">
                                    {payout.status === "Paid" && (
                                        <Badge className="bg-green-600 hover:bg-green-600">
                                            <CheckCircle2 className="mr-1 size-3" />
                                            Paid
                                        </Badge>
                                    )}

                                    {payout.status === "Pending" && (
                                        <Badge className="bg-yellow-500 hover:bg-yellow-500">
                                            <Clock3 className="mr-1 size-3" />
                                            Pending
                                        </Badge>
                                    )}

                                    {payout.status === "Failed" && (
                                        <Badge variant="destructive">
                                            <XCircle className="mr-1 size-3" />
                                            Failed
                                        </Badge>
                                    )}
                                </td>

                                <td className="text-right text-muted-foreground">
                                    {payout.date}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </section>
    );
}