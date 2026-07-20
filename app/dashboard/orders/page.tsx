import Link from "next/link";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { getBuyerOrders } from "@/lib/actions/order";
export const dynamic = "force-dynamic";

function getStatusClass(status: string) {
    switch (status) {
        case "delivered":
            return "bg-green-100 text-green-700";
        case "pending":
            return "bg-yellow-100 text-yellow-700";
        case "processing":
            return "bg-orange-100 text-orange-700";
        case "confirmed":
            return "bg-cyan-100 text-cyan-700";
        case "shipped":
            return "bg-blue-100 text-blue-700";
        case "cancelled":
            return "bg-red-100 text-red-700";
        default:
            return "bg-gray-100 text-gray-700";
    }
}
export default async function BuyerOrdersPage() {
    const orders = await getBuyerOrders();

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
                                        {order.orderNumber}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        Rs. {Number(order.totalAmount).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        {order.paymentStatus}
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(order.status)}`}
                                        >
                                            {order.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button nativeButton={false}
                                            variant="outline"
                                            size="sm"
                                            render={<Link href={`dashboard/orders/${order.id}`} />}>
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