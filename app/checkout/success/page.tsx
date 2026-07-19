import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function CheckoutSuccessPage() {
    return (
        <section className="container flex min-h-[70vh] items-center justify-center py-16">
            <div className="w-full max-w-xl rounded-2xl border bg-card p-10 text-center shadow-sm">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-12 w-12 text-green-600" />
                </div>

                <h1 className="mt-8 text-3xl font-bold">
                    Order Confirmed 🎉
                </h1>

                <p className="mt-4 text-muted-foreground">
                    Thank you for your order.
                    <br />
                    We've received your order successfully and it's now being processed.
                </p>

                <div className="mt-8 rounded-xl bg-muted p-5 text-left">
                    <p className="font-medium">
                        What happens next?
                    </p>

                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                        <li>✓ Your order has been received.</li>

                        <li>✓ The seller has been notified.</li>

                        <li>✓ Your order is being prepared.</li>

                        <li>✓ You'll receive updates as your order progresses.</li>
                    </ul>
                </div>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">

                    <Button render={<Link href="/orders" />} nativeButton={false} size="lg">
                        View My Orders
                    </Button>

                    <Button render={<Link href="/products" />} nativeButton={false} variant="outline"
                        size="lg"
                    >
                        Continue Shopping
                    </Button>
                </div>
            </div>
        </section>
    );
}