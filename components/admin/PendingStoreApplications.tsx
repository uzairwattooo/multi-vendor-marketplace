import Link from "next/link";
import {
    ArrowRight,
    Clock3,
    Store,
} from "lucide-react";

type PendingStore = {
    id: string;
    name: string;
    category: string;
    ownerName: string;
    ownerEmail: string;
    city: string;
    createdAt: Date;
};

type PendingStoreApplicationsProps = {
    stores: PendingStore[];
};

export default function PendingStoreApplications({
    stores,
}: PendingStoreApplicationsProps) {
    return (
        <section className="rounded-2xl border bg-card shadow-sm">
            <div className="flex items-center justify-between gap-4 border-b px-5 py-4 sm:px-6">
                <div>
                    <h2 className="font-semibold">
                        Pending store applications
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Seller stores waiting for admin review.
                    </p>
                </div>

                <Link
                    href="/admin/stores"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary"
                >
                    Review all
                    <ArrowRight className="size-3.5" />
                </Link>
            </div>

            {stores.length === 0 ? (
                <div className="px-6 py-14 text-center">
                    <Store className="mx-auto size-9 text-muted-foreground" />
                    <p className="mt-3 font-medium">
                        No pending applications
                    </p>
                </div>
            ) : (
                <div className="divide-y">
                    {stores.map((currentStore) => (
                        <div
                            key={currentStore.id}
                            className="flex items-start gap-4 px-5 py-4 sm:px-6"
                        >
                            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                <Store className="size-5" />
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="truncate text-sm font-semibold">
                                        {currentStore.name}
                                    </p>

                                    <span className="inline-flex w-fit items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] font-semibold text-amber-700 dark:text-amber-400">
                                        <Clock3 className="size-3" />
                                        Pending
                                    </span>
                                </div>

                                <p className="mt-1 truncate text-xs text-muted-foreground">
                                    {currentStore.ownerName} ·{" "}
                                    {currentStore.ownerEmail}
                                </p>

                                <p className="mt-2 text-xs text-muted-foreground">
                                    {currentStore.category} ·{" "}
                                    {currentStore.city} ·{" "}
                                    {new Intl.DateTimeFormat(
                                        "en-PK",
                                        {
                                            dateStyle: "medium",
                                        },
                                    ).format(
                                        currentStore.createdAt,
                                    )}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
