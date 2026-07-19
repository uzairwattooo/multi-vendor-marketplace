type RevenueSummaryProps = {
    today: number;
    week: number;
    month: number;
    total: number;
};

export default function RevenueSummary({
    today,
    week,
    month,
    total,
}: RevenueSummaryProps) {
    const data = [
        {
            title: "Today",
            value: today,
        },
        {
            title: "This Week",
            value: week,
        },
        {
            title: "This Month",
            value: month,
        },
        {
            title: "Total Revenue",
            value: total,
        },
    ];

    return (
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold">
                Revenue Summary
            </h2>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {data.map((item) => (
                    <div
                        key={item.title}
                        className="rounded-xl border p-5"
                    >
                        <p className="text-sm text-muted-foreground">
                            {item.title}
                        </p>

                        <h3 className="mt-2 text-2xl font-bold">
                            Rs. {item.value.toLocaleString()}
                        </h3>
                    </div>
                ))}
            </div>
        </div>
    );
}