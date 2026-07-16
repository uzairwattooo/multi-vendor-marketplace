"use client";

import Image from "next/image";
import Link from "next/link";
import {
    Minus,
    Plus,
    ShoppingBag,
    Trash2,
} from "lucide-react";

import Container from "@/components/common/Container";
import { Button, buttonVariants } from "@/components/ui/button";
import { useCart } from "@/components/providers/CartProvider";
import { cn } from "@/lib/utils";

export default function CartContent() {
    const {
        items,
        subtotal,
        removeItem,
        updateQuantity,
        clearCart,
    } = useCart();

    return (
        <section className="py-12 sm:py-16">
            <Container>
                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                            Shopping Cart
                        </p>

                        <h1 className="mt-2 text-3xl font-bold">
                            Your Cart
                        </h1>
                    </div>

                    {items.length > 0 && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={clearCart}
                        >
                            Clear Cart
                        </Button>
                    )}
                </div>

                {items.length === 0 ? (
                    <div className="mt-10 rounded-3xl border bg-card p-14 text-center">
                        <ShoppingBag className="mx-auto size-14 text-muted-foreground" />

                        <h2 className="mt-5 text-xl font-semibold">
                            Your cart is empty
                        </h2>

                        <p className="mt-2 text-muted-foreground">
                            Add products to continue shopping.
                        </p>

                        <Link
                            href="/products"
                            className={cn(
                                buttonVariants({
                                    size: "lg",
                                }),
                                "mt-6",
                            )}
                        >
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item.productId}
                                    className="flex gap-4 rounded-2xl border bg-card p-4"
                                >
                                    <div className="relative size-28 shrink-0 overflow-hidden rounded-xl bg-muted">
                                        {item.image ? (
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                sizes="112px"
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                                                No Image
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-1 flex-col justify-between gap-4 sm:flex-row">
                                        <div>
                                            <Link
                                                href={`/products/${item.slug}`}
                                                className="font-semibold hover:text-primary"
                                            >
                                                {item.name}
                                            </Link>

                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {item.storeName}
                                            </p>

                                            <p className="mt-3 font-bold">
                                                Rs.{" "}
                                                {item.price.toLocaleString()}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center rounded-lg border">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    disabled={
                                                        item.quantity <= 1
                                                    }
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.productId,
                                                            item.quantity - 1,
                                                        )
                                                    }
                                                >
                                                    <Minus className="size-4" />
                                                </Button>

                                                <span className="w-10 text-center text-sm font-semibold">
                                                    {item.quantity}
                                                </span>

                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    disabled={
                                                        item.quantity >=
                                                        item.stock
                                                    }
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.productId,
                                                            item.quantity + 1,
                                                        )
                                                    }
                                                >
                                                    <Plus className="size-4" />
                                                </Button>
                                            </div>

                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                aria-label="Remove product"
                                                onClick={() =>
                                                    removeItem(
                                                        item.productId,
                                                    )
                                                }
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <aside className="h-fit rounded-2xl border bg-card p-6">
                            <h2 className="text-xl font-semibold">
                                Order Summary
                            </h2>

                            <div className="mt-6 space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Subtotal
                                    </span>

                                    <span>
                                        Rs. {subtotal.toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Shipping
                                    </span>

                                    <span>Calculated at checkout</span>
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>

                                        <span>
                                            Rs. {subtotal.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <Link
                                href="/checkout"
                                className={cn(
                                    buttonVariants({
                                        size: "lg",
                                    }),
                                    "mt-6 w-full",
                                )}
                            >
                                Proceed to Checkout
                            </Link>
                        </aside>
                    </div>
                )}
            </Container>
        </section>
    );
}