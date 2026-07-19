export default function Loading() {
    return (
        <div className="space-y-6">
            <div className="h-10 w-60 animate-pulse rounded bg-muted" />

            <div className="rounded-2xl border p-6">
                <div className="space-y-4">
                    <div className="h-5 w-40 animate-pulse rounded bg-muted" />

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="h-10 animate-pulse rounded bg-muted" />
                        <div className="h-10 animate-pulse rounded bg-muted" />
                        <div className="h-10 animate-pulse rounded bg-muted" />
                        <div className="h-10 animate-pulse rounded bg-muted" />
                    </div>
                </div>
            </div>
        </div>
    );
}