import Link from "next/link";
import { Package, ShoppingBag, Heart, Truck, ArrowRight, } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { getBuyerDashboard } from "@/lib/actions/dashboard";



export default async function BuyerDashboardPage() {
    const dashboard = await getBuyerDashboard();
    const stats = [
        {
            title: "Total Orders",
            value: dashboard.totalOrders,
            icon: ShoppingBag,
        },
        {
            title: "Pending Orders",
            value: dashboard.pendingOrders,
            icon: Package,
        },
        {
            title: "Delivered",
            value: dashboard.deliveredOrders,
            icon: Truck,
        },
        {
            title: "Wishlist",
            value: dashboard.wishlist,
            icon: Heart,
        },
    ];
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">
                        Buyer Dashboard
                    </h1>

                    <p className="mt-1 text-muted-foreground">
                        Welcome back! Manage your orders and account.
                    </p>
                </div>

                <Button nativeButton={false}
                    render={<Link href="/dashboard/products" />}
                >
                    Continue Shopping
                </Button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Card key={item.title}>
                            <CardContent className="flex items-center justify-between p-6">

                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        {item.title}
                                    </p>

                                    <h2 className="mt-2 text-3xl font-bold">
                                        {item.value}
                                    </h2>
                                </div>

                                <div className="rounded-xl bg-primary/10 p-3">
                                    <Icon className="size-7 text-primary" />
                                </div>

                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
                <Card className="xl:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>
                            Recent Orders
                        </CardTitle>
                        <Button nativeButton={false}
                            variant="ghost"
                            size="sm"

                            render={<Link href="/dashboard/orders" />}
                        >
                            View All
                            <ArrowRight className="ml-2 size-4" />

                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {dashboard.recentOrders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium">
                                            {order.id}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            Rs. {Number(order.totalAmount).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary capitalize">
                                                {order.status}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Quick Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button nativeButton={false}
                            variant="outline"
                            className="w-full"
                            render={<Link href="/dashboard/orders" />}
                        >
                            My Orders
                        </Button>

                        <Button nativeButton={false}
                            variant="outline"
                            className="w-full"
                            render={<Link href="/dashboard/wishlist" />}
                        >
                            Wishlist
                        </Button>
                        <Button nativeButton={false}
                            className="w-full justify-center"
                            variant="outline"

                            render={<Link href="/dashboard/addresses" />}
                        >
                            Manage Addresses

                        </Button>
                        <Button nativeButton={false}
                            className="w-full justify-center"
                            variant="outline"

                            render={<Link href="/dashboard/profile" />}
                        >
                            Edit Profile

                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}