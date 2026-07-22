export default function Loading() {
    return (
        <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
                <div className="space-y-4 px-5 py-7 sm:px-7">
                    <div className="h-8 w-56 animate-pulse rounded-lg bg-muted" />
                    <div className="h-4 max-w-xl animate-pulse rounded bg-muted" />
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
                <div className="space-y-2 rounded-2xl border bg-card p-3 shadow-sm">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-16 animate-pulse rounded-xl bg-muted"
                        />
                    ))}
                </div>

                <div className="rounded-2xl border bg-card shadow-sm">
                    <div className="border-b px-6 py-5">
                        <div className="h-6 w-48 animate-pulse rounded bg-muted" />
                        <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded bg-muted" />
                    </div>
                    <div className="grid gap-6 p-6 md:grid-cols-2">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="space-y-2">
                                <div className="h-4 w-28 animate-pulse rounded bg-muted" />
                                <div className="h-9 animate-pulse rounded-md bg-muted" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
