import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";

import ProductCard from "@/components/marketplace/ProductCard";
import { Button } from "@/components/ui/button";
import { getUserWishlist } from "@/lib/wishlist/get-user-wishlist";

export default async function WishlistPage() {
    const products = await getUserWishlist();

    return (
        <div className="container p-10 ">
            <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-primary/10 p-3">
                            <Heart className="size-7 text-primary fill-primary" />
                        </div>

                        <div>
                            <h1 className="text-4xl font-bold">
                                My Wishlist
                            </h1>

                            <p className="mt-1 text-muted-foreground">
                                {products.length} saved product{products.length !== 1 && "s"}
                            </p>
                        </div>
                    </div>
                </div>

                <Button
                    nativeButton={false}
                    render={<Link href="/products" />}
                    className="gap-2"
                >
                    <ShoppingBag className="size-4" />
                    Continue Shopping
                </Button>
            </div>

            {products.length === 0 ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/30 text-center">
                    <div className="rounded-full bg-primary/10 p-6">
                        <Heart className="size-14 text-primary" />
                    </div>

                    <h2 className="mt-6 text-3xl font-bold">
                        Your wishlist is empty
                    </h2>

                    <p className="mt-3 max-w-md text-muted-foreground">
                        Save your favourite products here and purchase them
                        whenever you&apos;re ready.
                    </p>

                    <Button
                        nativeButton={false}
                        render={<Link href="/products" />}
                        className="mt-8"
                    >
                        Start Shopping
                    </Button>
                </div>
            ) : (
                <>
                    <div className="mb-6 flex items-center justify-between rounded-xl border bg-muted/40 px-5 py-4">
                        <p className="font-medium">
                            Showing{" "}
                            <span className="text-primary font-bold">
                                {products.length}
                            </span>{" "}
                            saved product{products.length !== 1 && "s"}
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                {...product}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}