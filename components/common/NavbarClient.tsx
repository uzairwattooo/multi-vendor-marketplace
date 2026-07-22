"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    useState,
    useSyncExternalStore,
} from "react";
import {
    Heart,
    Menu,
    Search,
    ShoppingCart,
    Store,
} from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import Container from "@/components/common/Container";
import { buttonVariants } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import UserMenu from "../auth/UserMenu";
import { useCart } from "@/components/providers/CartProvider";
import DashboardButton from "./DashboardButton";

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
    wishlistCount: number;
};

export default function NavbarClient({
    user,
    wishlistCount,
}: NavbarClientProps) {
    const pathname = usePathname();
    const { totalItems } = useCart();

    const [mobileOpen, setMobileOpen] =
        useState(false);

    const mounted = useSyncExternalStore(
        () => () => { },
        () => true,
        () => false,
    );

    const isActiveLink = (href: string) => {
        if (href === "/") {
            return pathname === "/";
        }

        return pathname.startsWith(href);
    };

    return (
        <header className="sticky top-0 z-50 border-b bg-background/90 shadow-sm backdrop-blur-xl">
            <Container>
                <div className="flex h-[76px] items-center justify-between gap-4">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex shrink-0 items-center gap-2.5"
                    >
                        <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                            <Store className="size-5" />
                        </div>

                        <div className="hidden sm:block">
                            <h2 className="text-lg font-bold leading-none tracking-tight">
                                MarketNest
                            </h2>

                            <p className="mt-1 text-[11px] text-muted-foreground">
                                Multi Vendor Marketplace
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden items-center gap-1 lg:flex">
                        {links.map((link) => {
                            const active = isActiveLink(link.href);

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "relative rounded-xl px-3.5 py-2 text-sm font-medium transition-colors",
                                        active
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                    )}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Desktop Search */}
                    <form
                        action="/products"
                        method="get"
                        className="hidden min-w-[260px] max-w-[420px] flex-1 items-center gap-2 rounded-2xl border bg-muted/40 px-3 transition-colors focus-within:border-primary/50 focus-within:bg-background xl:flex"
                    >
                        <Search className="size-[18px] shrink-0 text-muted-foreground" />

                        <input
                            type="search"
                            name="search"
                            placeholder="Search products, stores..."
                            className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                        />

                        <button
                            type="submit"
                            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                        >
                            Search
                        </button>
                    </form>

                    {/* Desktop Actions */}
                    <div className="hidden shrink-0 items-center gap-2 lg:flex">
                        {/* Search icon for medium desktop */}
                        <Link
                            href="/products"
                            aria-label="Search products"
                            className={cn(
                                buttonVariants({
                                    variant: "ghost",
                                    size: "icon",
                                }),
                                "rounded-xl xl:hidden",
                            )}
                        >
                            <Search className="size-5" />
                        </Link>

                        {/* Wishlist */}
                        <Link
                            href="/wishlist"
                            aria-label="Open wishlist"
                            className={cn(
                                buttonVariants({
                                    variant: "ghost",
                                    size: "icon",
                                }),
                                "relative rounded-xl",
                            )}
                        >
                            <Heart className="size-5" />

                            {wishlistCount > 0 && (
                                <span className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-[#7C3AED] px-1 text-[10px] font-bold text-white">
                                    {wishlistCount > 99
                                        ? "99+"
                                        : wishlistCount}
                                </span>
                            )}
                        </Link>

                        {/* Cart */}
                        <Link
                            href="/cart"
                            aria-label="Open cart"
                            className={cn(
                                buttonVariants({
                                    variant: "ghost",
                                    size: "icon",
                                }),
                                "relative rounded-xl",
                            )}
                        >
                            <ShoppingCart className="size-5" />

                            {mounted && totalItems > 0 && (
                                <span className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                                    {totalItems > 99
                                        ? "99+"
                                        : totalItems}
                                </span>
                            )}
                        </Link>

                        {/* User/Login */}
                        {user ? (
                            <UserMenu />
                        ) : (
                            <Link
                                href="/login"
                                className={cn(
                                    buttonVariants({
                                        variant: "outline",
                                    }),
                                    "rounded-xl",
                                )}
                            >
                                Login
                            </Link>
                        )}

                        {/* Role-based dashboard */}
                        <DashboardButton role={user?.role} />
                    </div>

                    {/* Mobile Navigation */}
                    <Sheet
                        open={mobileOpen}
                        onOpenChange={setMobileOpen}
                    >
                        <SheetTrigger
                            className={cn(
                                buttonVariants({
                                    variant: "outline",
                                    size: "icon",
                                }),
                                "rounded-xl lg:hidden",
                            )}
                            aria-label="Open navigation menu"
                        >
                            <Menu className="size-5" />
                        </SheetTrigger>

                        <SheetContent
                            side="right"
                            className="w-[320px] overflow-y-auto p-0 sm:w-[380px]"
                        >
                            <SheetHeader className="border-b px-6 py-5 text-left">
                                <SheetTitle>
                                    <Link
                                        href="/"
                                        onClick={() =>
                                            setMobileOpen(false)
                                        }
                                        className="flex items-center gap-2.5"
                                    >
                                        <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                                            <Store className="size-5" />
                                        </span>

                                        <span>
                                            <span className="block text-base font-bold">
                                                MarketNest
                                            </span>

                                            <span className="block text-[11px] font-normal text-muted-foreground">
                                                Multi Vendor Marketplace
                                            </span>
                                        </span>
                                    </Link>
                                </SheetTitle>
                            </SheetHeader>

                            <div className="px-5 py-6">
                                <form
                                    action="/products"
                                    method="get"
                                    onSubmit={() =>
                                        setMobileOpen(false)
                                    }
                                    className="flex items-center gap-2 rounded-2xl border bg-muted/40 p-1.5"
                                >
                                    <Search className="ml-2 size-[18px] shrink-0 text-muted-foreground" />

                                    <input
                                        type="search"
                                        name="search"
                                        placeholder="Search products..."
                                        className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none"
                                    />

                                    <button
                                        type="submit"
                                        className="h-10 rounded-xl bg-primary px-4 text-xs font-semibold text-primary-foreground"
                                    >
                                        Search
                                    </button>
                                </form>

                                {/* Mobile Links */}
                                <nav className="mt-6 grid gap-1.5">
                                    {links.map((link) => {
                                        const active =
                                            isActiveLink(link.href);

                                        return (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                onClick={() =>
                                                    setMobileOpen(false)
                                                }
                                                className={cn(
                                                    "rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                                                    active
                                                        ? "bg-primary/10 text-primary"
                                                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                                )}
                                            >
                                                {link.label}
                                            </Link>
                                        );
                                    })}
                                </nav>

                                {/* Wishlist and Cart */}
                                <div className="mt-6 grid grid-cols-2 gap-3 border-t pt-6">
                                    <Link
                                        href="/wishlist"
                                        onClick={() =>
                                            setMobileOpen(false)
                                        }
                                        className="relative flex min-h-[76px] flex-col items-center justify-center gap-2 rounded-2xl border bg-card text-sm font-medium transition-colors hover:bg-muted"
                                    >
                                        <Heart className="size-5" />

                                        <span>Wishlist</span>

                                        {wishlistCount > 0 && (
                                            <span className="absolute right-3 top-3 flex min-w-5 items-center justify-center rounded-full bg-[#7C3AED] px-1 text-[10px] font-bold text-white">
                                                {wishlistCount > 99
                                                    ? "99+"
                                                    : wishlistCount}
                                            </span>
                                        )}
                                    </Link>

                                    <Link
                                        href="/cart"
                                        onClick={() =>
                                            setMobileOpen(false)
                                        }
                                        className="relative flex min-h-[76px] flex-col items-center justify-center gap-2 rounded-2xl border bg-card text-sm font-medium transition-colors hover:bg-muted"
                                    >
                                        <ShoppingCart className="size-5" />

                                        <span>Cart</span>

                                        {mounted &&
                                            totalItems > 0 && (
                                                <span className="absolute right-3 top-3 flex min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                                                    {totalItems > 99
                                                        ? "99+"
                                                        : totalItems}
                                                </span>
                                            )}
                                    </Link>
                                </div>

                                {/* Authentication */}
                                <div className="mt-6 space-y-3 border-t pt-6">
                                    {user ? (
                                        <div className="flex items-center justify-between rounded-2xl border bg-muted/30 p-3">
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold">
                                                    {user.name}
                                                </p>

                                                <p className="mt-0.5 text-xs capitalize text-muted-foreground">
                                                    {user.role ?? "User"}
                                                </p>
                                            </div>

                                            <UserMenu />
                                        </div>
                                    ) : (
                                        <Link
                                            href="/login"
                                            onClick={() =>
                                                setMobileOpen(false)
                                            }
                                            className={cn(
                                                buttonVariants({
                                                    variant: "outline",
                                                }),
                                                "w-full rounded-xl",
                                            )}
                                        >
                                            Login
                                        </Link>
                                    )}

                                    <DashboardButton
                                        role={user?.role}
                                        mobile
                                        onClick={() =>
                                            setMobileOpen(false)
                                        }
                                    />
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </Container>
        </header>
    );
}