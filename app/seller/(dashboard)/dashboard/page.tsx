import Link from "next/link";
import {
    ArrowRight,
    Boxes,
    CreditCard,
    Package,
    ShoppingBag,
    TrendingUp,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const stats = [
    {
        title: "Total Revenue",
        value: "Rs. 0",
        description: "Total seller earnings",
        icon: TrendingUp,
    },
    {
        title: "Total Orders",
        value: "0",
        description: "All received orders",
        icon: ShoppingBag,
    },
    {
        title: "Total Products",
        value: "1",
        description: "Products in your store",
        icon: Package,
    },
    {
        title: "Available Balance",
        value: "Rs. 0",
        description: "Ready for payout",
        icon: CreditCard,
    },
];

export default function SellerDashboardPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                        Seller Dashboard
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight">
                        Store Overview
                    </h1>

                    <p className="mt-2 text-muted-foreground">
                        Manage products, orders, inventory and payouts.
                    </p>
                </div>

                <Link
                    href="/seller/products/new"
                    className={cn(
                        buttonVariants({
                            size: "lg",
                        }),
                        "gap-2",
                    )}
                >
                    Add New Product
                    <ArrowRight className="size-4" />
                </Link>
            </div>

            <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <div
                            key={stat.title}
                            className="rounded-2xl border bg-card p-6 shadow-sm"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        {stat.title}
                                    </p>

                                    <h2 className="mt-3 text-3xl font-bold">
                                        {stat.value}
                                    </h2>
                                </div>

                                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <Icon className="size-6" />
                                </div>
                            </div>

                            <p className="mt-4 text-sm text-muted-foreground">
                                {stat.description}
                            </p>
                        </div>
                    );
                })}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
                <div className="rounded-2xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold">
                                Sales Overview
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Sales data will appear after receiving orders.
                            </p>
                        </div>

                        <TrendingUp className="size-5 text-primary" />
                    </div>

                    <div className="mt-8 flex h-64 items-center justify-center rounded-xl bg-muted/50">
                        <p className="text-sm text-muted-foreground">
                            Sales chart will appear here
                        </p>
                    </div>
                </div>

                <div className="rounded-2xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <Boxes className="size-5 text-primary" />

                        <h2 className="text-lg font-semibold">
                            Low Stock Products
                        </h2>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-muted-foreground">
                            No low stock products found.
                        </p>
                    </div>
                </div>
            </section>

            <section className="rounded-2xl border bg-card p-6 shadow-sm">
                <h2 className="text-lg font-semibold">
                    Recent Orders
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                    Latest customer orders will appear here.
                </p>

                <div className="mt-8 text-center">
                    <p className="text-sm text-muted-foreground">
                        No orders received yet.
                    </p>
                </div>
            </section>
        </div>
    );
}