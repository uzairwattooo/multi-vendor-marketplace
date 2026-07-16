"use client";

import Link from "next/link";
import {
    Menu,
    Search,
    ShoppingCart,
    Store,
} from "lucide-react";
import Container from "@/components/common/Container";
import { Button, buttonVariants } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import UserMenu from "../auth/UserMenu";
import { useCart } from "@/components/providers/CartProvider";


const links = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Stores", href: "/stores" },
    { label: "Categories", href: "/categories" },
];
type NavbarUser = {
    name: string;
    role: string | null;
};

type NavbarClientProps = {
    user: NavbarUser | null;
};
export default function NavbarClient({
    user,
}: NavbarClientProps) {
    const { totalItems } = useCart();
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    const normalizedRole = user?.role?.trim().toLowerCase();

    function DashboardButton({
        mobile = false,
    }: {
        mobile?: boolean;
    }) {
        const className = cn(
            buttonVariants(),
            mobile && "w-full",
        );

        if (normalizedRole === "seller") {
            return (
                <Link
                    href="/seller/dashboard"
                    className={className}
                >
                    Seller Dashboard
                </Link>
            );
        }

        if (normalizedRole === "admin") {
            return (
                <Link
                    href="/admin"
                    className={className}
                >
                    Admin Dashboard
                </Link>
            );
        }

        return (
            <Link
                href="/seller/onboarding"
                className={className}
            >
                Become a Seller
            </Link>
        );
    }


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
                            type="button"
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
                                }),
                                "relative",
                            )}
                        >
                            <ShoppingCart className="size-5" />

                            {mounted && totalItems > 0 && (
                                <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                                    {totalItems > 99 ? "99+" : totalItems}
                                </span>
                            )}
                        </Link>

                        <UserMenu />

                        <DashboardButton />
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

                                <div className="mt-4 space-y-3 border-t pt-4">
                                    {!user && (
                                        <Link
                                            href="/login"
                                            className={cn(
                                                buttonVariants({
                                                    variant: "outline",
                                                }),
                                                "w-full",
                                            )}
                                        >
                                            Login
                                        </Link>
                                    )}

                                    <DashboardButton mobile />
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </Container>
        </header>
    );
}