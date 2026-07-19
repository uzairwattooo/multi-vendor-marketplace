import {
    Wallet,
    Clock3,
    Landmark,
    TrendingUp,
} from "lucide-react";

type Props = {
    stats: {
        available: number;
        pending: number;
        totalPaid: number;
        lifetime: number;
        orders: number;
    } | null;
};

export default function PayoutStats({
    stats,
}: Props) {
    const cards = [
        {
            title: "Available Balance",
            value: stats?.available ?? 0,
            description: "Ready for payout",
            icon: (
                <Wallet className="size-6 text-green-600" />
            ),
        },
        {
            title: "Pending Balance",
            value: stats?.pending ?? 0,
            description: "Awaiting settlement",
            icon: (
                <Clock3 className="size-6 text-yellow-600" />
            ),
        },
        {
            title: "Total Paid Out",
            value: stats?.totalPaid ?? 0,
            description: "Successfully transferred",
            icon: (
                <Landmark className="size-6 text-blue-600" />
            ),
        },
        {
            title: "Lifetime Earnings",
            value: stats?.lifetime ?? 0,
            description: `${stats?.orders ?? 0} Orders`,
            icon: (
                <TrendingUp className="size-6 text-primary" />
            ),
        },
    ];

    return (
        <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
                <div
                    key={card.title}
                    className="rounded-2xl border bg-card p-6 shadow-sm"
                >
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                {card.title}
                            </p>

                            <h2 className="mt-2 text-3xl font-bold">
                                Rs.{" "}
                                {card.value.toLocaleString()}
                            </h2>

                            <p className="mt-2 text-sm text-muted-foreground">
                                {card.description}
                            </p>
                        </div>

                        <div className="rounded-xl bg-muted p-3">
                            {card.icon}
                        </div>
                    </div>
                </div>
            ))}
        </section>
    );
}