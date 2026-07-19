import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const wishlist = [
    {
        id: "1",
        name: "Apple AirPods Pro",
        slug: "apple-airpods-pro",
        image: "https://placehold.co/300x300",
        price: "Rs. 45,000",
    },
    {
        id: "2",
        name: "Samsung Galaxy Watch",
        slug: "samsung-galaxy-watch",
        image: "https://placehold.co/300x300",
        price: "Rs. 68,000",
    },
    {
        id: "3",
        name: "Logitech MX Master 3",
        slug: "logitech-mx-master-3",
        image: "https://placehold.co/300x300",
        price: "Rs. 31,500",
    },
];

export default function WishlistPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">
                    Wishlist
                </h1>

                <p className="mt-1 text-muted-foreground">
                    Products you've saved for later.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>
                        Saved Products ({wishlist.length})
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        {wishlist.map((item) => (
                            <div
                                key={item.id}
                                className="overflow-hidden rounded-xl border bg-background"
                            >
                                <Link href={`/products/${item.slug}`}>
                                    <div className="relative aspect-square">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </Link>

                                <div className="space-y-4 p-4">
                                    <div>
                                        <h3 className="line-clamp-2 font-semibold">
                                            {item.name}
                                        </h3>

                                        <p className="mt-1 text-lg font-bold text-primary">
                                            {item.price}
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button  nativeButton={false}
                                            className="flex-1"
                                            render={
                                                <Link
                                                    href={`/products/${item.slug}`}
                                                />
                                            }
                                        >
                                            <ShoppingCart className="mr-2 size-4" />
                                            Buy Now
                                        </Button>

                                        <Button 
                                            variant="outline"
                                            size="icon"
                                        >
                                            <Trash2 className="size-4 text-red-500" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {wishlist.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16">
                            <Heart className="size-14 text-muted-foreground" />

                            <h3 className="mt-4 text-xl font-semibold">
                                Your wishlist is empty
                            </h3>

                            <p className="mt-2 text-muted-foreground">
                                Save your favourite products to buy later.
                            </p>

                            <Button  nativeButton={false}
                                className="mt-6"
                                render={<Link href="/products" />}
                            >
                                Continue Shopping
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}