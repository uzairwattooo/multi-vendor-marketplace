import {
    CheckCircle2,
    Clock3,
    XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getPayoutHistory } from "@/lib/actions/seller/get-payout-history";




export default async function PayoutHistory() {
    const payouts = await getPayoutHistory();

    if (payouts.length === 0) {
        return (
            <section className="rounded-2xl border bg-card p-6 shadow-sm">
                <h2 className="text-xl font-semibold">
                    Payout History
                </h2>

                <p className="mt-6 text-center text-muted-foreground">
                    No payout history found.
                </p>
            </section>
        );
    }
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
                                    {payout.stripeId ?? "-"}
                                </td>

                                <td className="text-right font-semibold">
                                    Rs. {Number(payout.amount).toLocaleString()}
                                </td>

                                <td className="text-center">
                                    {payout.method}
                                </td>

                                <td className="text-center">
                                    {payout.status === "paid" && (
                                        <Badge className="bg-green-600 hover:bg-green-600">
                                            <CheckCircle2 className="mr-1 size-3" />
                                            Paid
                                        </Badge>
                                    )}

                                    {payout.status === "pending" && (
                                        <Badge className="bg-yellow-500 hover:bg-yellow-500">
                                            <Clock3 className="mr-1 size-3" />
                                            Pending
                                        </Badge>
                                    )}

                                    {payout.status === "processing" && (
                                        <Badge className="bg-blue-600 hover:bg-blue-600">
                                            <Clock3 className="mr-1 size-3" />
                                            Processing
                                        </Badge>
                                    )}
                                </td>

                                <td className="text-right text-muted-foreground">
                                    {payout.date
                                        ? new Date(payout.date).toLocaleDateString()
                                        : "-"}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </section>
    );
}