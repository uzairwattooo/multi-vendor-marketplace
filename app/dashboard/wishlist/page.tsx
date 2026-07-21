import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart,} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import { getUserWishlist } from "@/lib/wishlist/get-user-wishlist";
export const dynamic = "force-dynamic";
import RemoveWishlistButton from "@/components/marketplace/RemoveWishlistButton";

export default async function WishlistPage() {
    const wishlist = await getUserWishlist();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">
                    Wishlist
                </h1>

                <p className="mt-1 text-muted-foreground">
                    Products you&apos;ve saved for later.
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
                                            src={item.image || "/placeholder.png"}
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
                                            Rs. {Number(item.salePrice ?? item.price).toLocaleString()}
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button nativeButton={false}
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

                                        <RemoveWishlistButton
                                            productId={item.id}
                                        />
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

                            <Button nativeButton={false}
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