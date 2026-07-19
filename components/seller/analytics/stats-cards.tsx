import {
    DollarSign,
    Package,
    ShoppingBag,
    Users,
} from "lucide-react";

type StatsCardsProps = {
    revenue: number;
    orders: number;
    products: number;
    customers: number;
};

export default function StatsCards({
    revenue,
    orders,
    products,
    customers,
}: StatsCardsProps) {
    const cards = [
        {
            title: "Total Revenue",
            value: `Rs. ${revenue.toLocaleString()}`,
            icon: DollarSign,
            color: "bg-green-100 text-green-600",
        },
        {
            title: "Orders",
            value: orders.toLocaleString(),
            icon: ShoppingBag,
            color: "bg-blue-100 text-blue-600",
        },
        {
            title: "Products",
            value: products.toLocaleString(),
            icon: Package,
            color: "bg-orange-100 text-orange-600",
        },
        {
            title: "Customers",
            value: customers.toLocaleString(),
            icon: Users,
            color: "bg-purple-100 text-purple-600",
        },
    ];

    return (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => {
                const Icon = card.icon;

                return (
                    <div
                        key={card.title}
                        className="rounded-2xl border bg-card p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    {card.title}
                                </p>

                                <h2 className="mt-2 text-2xl font-bold">
                                    {card.value}
                                </h2>
                            </div>

                            <div
                                className={`flex h-14 w-14 items-center justify-center rounded-xl ${card.color}`}
                            >
                                <Icon className="h-7 w-7" />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}