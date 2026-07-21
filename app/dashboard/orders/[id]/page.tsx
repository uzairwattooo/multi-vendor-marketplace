import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBuyerOrderById } from "@/lib/actions/ordercrud";

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

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await getBuyerOrderById(id);

  return (
    <div className="space-y-6">
      <Button
        nativeButton={false}
        variant="outline"
        render={<Link href="/dashboard/orders" />}
      >
        <ArrowLeft className="mr-2 size-4" />
        Back to Orders
      </Button>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>
              Order #{order.orderNumber}
            </CardTitle>

            <p className="mt-2 text-sm text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusClass(order.status)}`}
          >
            {order.status}
          </span>
        </CardHeader>

        <CardContent className="space-y-6">

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Payment
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-2 text-sm">
                <p>
                  Method: {order.paymentMethod}
                </p>

                <p>
                  Status: {order.paymentStatus}
                </p>

                <p className="font-semibold">
                  Total: Rs.{" "}
                  {Number(order.totalAmount).toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Shipping Address
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-1 text-sm">
                <p>{order.shippingAddress?.fullName}</p>
                <p>{order.shippingAddress?.phone}</p>
                <p>{order.shippingAddress?.address}</p>
                <p>
                  {order.shippingAddress?.city},{" "}
                  {order.shippingAddress?.state}
                </p>
                <p>{order.shippingAddress?.country}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Products
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 rounded-lg border p-4"
                >
                  <Image
                    src={
                      item.product.images[0]?.url ||
                      "/placeholder.png"
                    }
                    alt={item.product.name}
                    width={70}
                    height={70}
                    className="rounded-md object-cover"
                  />

                  <div className="flex-1">
                    <h3 className="font-medium">
                      {item.productName}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="font-semibold">
                    Rs.{" "}
                    {Number(
                      item.totalPrice
                    ).toLocaleString()}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}