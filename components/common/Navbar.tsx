"use client";

import Link from "next/link";
import {
    Menu,
    Search,
    ShoppingCart,
    Store,
    User,
} from "lucide-react";

import Container from "@/components/common/Container";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import UserMenu from "../auth/UserMenu";

const links = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/#products" },
    { label: "Stores", href: "/#stores" },
    { label: "Categories", href: "#categories" },
];

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur-md">
            <Container>
                <div className="flex h-[76px] items-center justify-between gap-6">
                
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                            <Store className="size-5" />
                        </div>

                        <div>
                            <h2 className="text-lg font-bold leading-none">
                                MarketNest
                            </h2>

                            <p className="mt-1 text-xs text-muted-foreground">
                                Multi Vendor Marketplace
                            </p>
                        </div>
                    </Link>
                    <nav className="hidden items-center gap-7 lg:flex">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="hidden items-center gap-2 md:flex">
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Search products"
                        >
                            <Search className="size-5" />
                        </Button>

                        <Link
                            href="/cart"
                            aria-label="Open cart"
                            className={cn(
                                buttonVariants({
                                    variant: "ghost",
                                    size: "icon",
                                })
                            )}
                        >
                            <ShoppingCart className="size-5" />
                        </Link>

                        <UserMenu />
                        <Button
                            nativeButton={false}
                            render={<Link href="/seller/onboarding" />}
                        >
                            Become a Seller
                        </Button>
                    </div>

                    <Sheet>
                        <SheetTrigger
                            className={cn(
                                buttonVariants({
                                    variant: "outline",
                                    size: "icon",
                                }),
                                "lg:hidden"
                            )}
                            aria-label="Open navigation menu"
                        >
                            <Menu className="size-5" />
                        </SheetTrigger>

                        <SheetContent side="right">
                            <div className="mt-10 flex flex-col gap-3">
                                {links.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="rounded-lg px-3 py-3 font-medium transition hover:bg-muted"
                                    >
                                        {link.label}
                                    </Link>
                                ))}

                                <div className="mt-4 border-t pt-4">
                                    <Link
                                        href="/login"
                                        className={cn(
                                            buttonVariants({
                                                variant: "outline",
                                            }),
                                            "w-full"
                                        )}
                                    >
                                        Login
                                    </Link>

                                    <Link
                                        href="/seller/onboarding"
                                        className={cn(
                                            buttonVariants(),
                                            "mt-3 w-full"
                                        )}
                                    >
                                        Become a Seller
                                    </Link>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </Container>
        </header>
    );
}