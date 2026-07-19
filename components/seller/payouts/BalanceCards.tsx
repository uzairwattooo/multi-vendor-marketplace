import {
    ArrowDownCircle,
    Clock3,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
    stripeBalance: {
        available: number;
        pending: number;
    };
};

export default function BalanceCards({
    stripeBalance,
}: Props) {
    return (
        <section className="grid gap-6 lg:grid-cols-2">

            {/* Available Balance */}

            <div className="rounded-2xl border bg-card p-6 shadow-sm">

                <div className="flex items-center justify-between">

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Available Balance
                        </p>

                        <h2 className="mt-2 text-4xl font-bold">
                            Rs.{" "}
                            {stripeBalance.available.toLocaleString()}
                        </h2>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Ready to be transferred to your bank account.
                        </p>
                    </div>

                    <div className="rounded-2xl bg-green-100 p-4">
                        <ArrowDownCircle className="size-9 text-green-600" />
                    </div>

                </div>

                <div className="mt-8 flex items-center justify-between rounded-xl bg-muted p-4">

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Next Automatic Payout
                        </p>

                        <p className="mt-1 font-semibold">
                            22 Jul 2026
                        </p>
                    </div>

                    <Button>
                        Withdraw
                    </Button>

                </div>

            </div>

            {/* Pending Balance */}

            <div className="rounded-2xl border bg-card p-6 shadow-sm">

                <div className="flex items-center justify-between">

                    <div>

                        <p className="text-sm text-muted-foreground">
                            Pending Balance
                        </p>

                        <h2 className="mt-2 text-4xl font-bold">
                            Rs.{" "}
                            {stripeBalance.pending.toLocaleString()}
                        </h2>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Payments waiting for Stripe settlement.
                        </p>

                    </div>

                    <div className="rounded-2xl bg-yellow-100 p-4">
                        <Clock3 className="size-9 text-yellow-600" />
                    </div>

                </div>

                <div className="mt-8 rounded-xl border border-dashed p-4">

                    <div className="flex items-center justify-between">

                        <span className="text-sm text-muted-foreground">
                            Estimated Release
                        </span>

                        <span className="font-semibold">
                            Within 2–3 business days
                        </span>

                    </div>

                </div>

            </div>

        </section>
    );
}