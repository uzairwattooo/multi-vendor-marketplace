import {
    Clock3,
    CheckCircle2,
    PackageCheck,
    Truck,
    XCircle,
} from "lucide-react";

type OrderStatusProps = {
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
};

export default function OrderStatus({
    pending,
    processing,
    shipped,
    delivered,
    cancelled,
}: OrderStatusProps) {
    const statuses = [
        {
            title: "Pending",
            value: pending,
            icon: Clock3,
            color: "text-yellow-600 bg-yellow-100",
        },
        {
            title: "Processing",
            value: processing,
            icon: PackageCheck,
            color: "text-blue-600 bg-blue-100",
        },
        {
            title: "Shipped",
            value: shipped,
            icon: Truck,
            color: "text-indigo-600 bg-indigo-100",
        },
        {
            title: "Delivered",
            value: delivered,
            icon: CheckCircle2,
            color: "text-green-600 bg-green-100",
        },
        {
            title: "Cancelled",
            value: cancelled,
            icon: XCircle,
            color: "text-red-600 bg-red-100",
        },
    ];

    return (
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold">
                Order Status
            </h2>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                {statuses.map((status) => {
                    const Icon = status.icon;

                    return (
                        <div
                            key={status.title}
                            className="rounded-xl border p-5"
                        >
                            <div
                                className={`flex h-12 w-12 items-center justify-center rounded-xl ${status.color}`}
                            >
                                <Icon className="h-6 w-6" />
                            </div>

                            <h3 className="mt-4 text-lg font-semibold">
                                {status.title}
                            </h3>

                            <p className="mt-2 text-3xl font-bold">
                                {status.value}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}