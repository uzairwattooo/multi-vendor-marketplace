import Link from "next/link";
import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const orders = [
    {
        id: "ORD-1001",
        total: "Rs. 3,500",
        status: "Delivered",
        payment: "Paid",
        date: "18 Jul 2026",
    },
    {
        id: "ORD-1002",
        total: "Rs. 2,200",
        status: "Pending",
        payment: "Pending",
        date: "17 Jul 2026",
    },
    {
        id: "ORD-1003",
        total: "Rs. 6,800",
        status: "Shipped",
        payment: "Paid",
        date: "15 Jul 2026",
    },
];

function getStatusClass(status: string) {
    switch (status) {
        case "Delivered":
            return "bg-green-100 text-green-700";

        case "Pending":
            return "bg-yellow-100 text-yellow-700";

        case "Shipped":
            return "bg-blue-100 text-blue-700";

        case "Cancelled":
            return "bg-red-100 text-red-700";

        default:
            return "bg-gray-100 text-gray-700";
    }
}

export default function BuyerOrdersPage() {
    return (
        <div className="space-y-6">

            <div>
                <h1 className="text-3xl font-bold">
                    My Orders
                </h1>

                <p className="mt-1 text-muted-foreground">
                    View and track all your orders.
                </p>
            </div>

            <Card>

                <CardHeader>
                    <CardTitle>
                        Order History
                    </CardTitle>
                </CardHeader>

                <CardContent>

                    <Table>

                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Payment</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>

                            {orders.map((order) => (
                                <TableRow key={order.id}>

                                    <TableCell className="font-medium">
                                        {order.id}
                                    </TableCell>

                                    <TableCell>
                                        {order.date}
                                    </TableCell>

                                    <TableCell>
                                        {order.total}
                                    </TableCell>

                                    <TableCell>
                                        {order.payment}
                                    </TableCell>

                                    <TableCell>
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                                                order.status
                                            )}`}
                                        >
                                            {order.status}
                                        </span>
                                    </TableCell>

                                    <TableCell className="text-right">

                                        <Button  nativeButton={false}
                                            variant="outline"
                                            size="sm"
                                            render={
                                                <Link
                                                    href={`/orders/${order.id}`}
                                                />
                                            }
                                        >
                                            <Eye className="mr-2 size-4" />
                                            View
                                        </Button>

                                    </TableCell>

                                </TableRow>
                            ))}

                        </TableBody>

                    </Table>

                </CardContent>

            </Card>

        </div>
    );
}