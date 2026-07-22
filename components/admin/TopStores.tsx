import Link from "next/link";
import {
    ArrowRight,
    BadgeCheck,
    Store,
} from "lucide-react";

type TopStore = {
    id: string;
    name: string;
    slug: string;
    orderCount: number;
    revenue: number;
};

type TopStoresProps = {
    stores: TopStore[];
    currency: string;
};

function formatMoney(
    value: number,
    currency: string,
) {
    try {
        return new Intl.NumberFormat("en-PK", {
            style: "currency",
            currency: currency.toUpperCase(),
            maximumFractionDigits: 0,
        }).format(value);
    } catch {
        return `${currency.toUpperCase()} ${value.toLocaleString()}`;
    }
}

export default function TopStores({
    stores,
    currency,
}: TopStoresProps) {
    return (
        <section className="rounded-2xl border bg-card shadow-sm">
            <div className="flex items-center justify-between gap-4 border-b px-5 py-4 sm:px-6">
                <div>
                    <h2 className="font-semibold">
                        Top performing stores
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Ranked by paid marketplace revenue.
                    </p>
                </div>

                <Link
                    href="/admin/stores"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary"
                >
                    Manage stores
                    <ArrowRight className="size-3.5" />
                </Link>
            </div>

            {stores.length === 0 ? (
                <div className="px-6 py-14 text-center">
                    <Store className="mx-auto size-9 text-muted-foreground" />
                    <p className="mt-3 font-medium">
                        No store performance data
                    </p>
                </div>
            ) : (
                <div className="divide-y">
                    {stores.map((currentStore, index) => (
                        <div
                            key={currentStore.id}
                            className="flex items-center gap-4 px-5 py-4 sm:px-6"
                        >
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-sm font-bold">
                                {index + 1}
                            </div>

                            <div className="min-w-0 flex-1">
                                <Link
                                    href={`/stores/${currentStore.slug}`}
                                    className="inline-flex max-w-full items-center gap-1.5 font-semibold hover:text-primary"
                                >
                                    <span className="truncate">
                                        {currentStore.name}
                                    </span>
                                    <BadgeCheck className="size-4 shrink-0 text-primary" />
                                </Link>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    {currentStore.orderCount.toLocaleString()}{" "}
                                    orders
                                </p>
                            </div>

                            <p className="text-sm font-bold">
                                {formatMoney(
                                    currentStore.revenue,
                                    currency,
                                )}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
