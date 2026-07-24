"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Heart,
    House,
    LayoutDashboard,
    MapPin,
    PanelLeftClose,
    PanelLeftOpen,
    ShoppingBag,
    User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
    {
        id: "dashboard",
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        id: "orders",
        name: "My Orders",
        href: "/dashboard/orders",
        icon: ShoppingBag,
    },
    {
        id: "wishlist",
        name: "Wishlist",
        href: "/dashboard/wishlist",
        icon: Heart,
    },
    {
        id: "addresses",
        name: "Addresses",
        href: "/dashboard/addresses",
        icon: MapPin,
    },
    {
        id: "profile",
        name: "My Profile",
        href: "/dashboard/profile",
        icon: User,
    },
    {
        id: "home",
        name: "Back to Home",
        href: "/",
        icon: House,
    },
];

type BuyerSidebarProps = {
    user: {
        name: string;
        image: string | null;
    };
    collapsed: boolean;
    onToggle: () => void;
};

export default function BuyerSidebar({
    user,
    collapsed,
    onToggle,
}: BuyerSidebarProps) {
    const pathname = usePathname();

    return (
        <aside
            className={cn(
                "fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-white/10 bg-[#111827] text-white transition-[width] duration-300 ease-in-out lg:flex",
                collapsed ? "w-20" : "w-72",
            )}
        >
            <div
                className={cn(
                    "relative flex h-20 shrink-0 items-center border-b border-white/10",
                    collapsed
                        ? "justify-center px-3"
                        : "gap-3 px-6",
                )}
            >
                <Link
                    href="/dashboard"
                    aria-label="Buyer dashboard"
                    className="flex min-w-0 items-center gap-3"
                >
                    {user.image ? (
                        <Image
                            src={user.image}
                            alt={user.name}
                            width={44}
                            height={44}
                            className="size-11 shrink-0 rounded-full object-cover"
                        />
                    ) : (
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <User className="size-5" />
                        </div>
                    )}

                    {!collapsed && (
                        <div className="min-w-0">
                            <h2 className="truncate font-bold">
                                {user.name}
                            </h2>

                            <p className="whitespace-nowrap text-xs text-zinc-400">
                                Manage your account
                            </p>
                        </div>
                    )}
                </Link>

                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={onToggle}
                    title={
                        collapsed
                            ? "Expand sidebar"
                            : "Collapse sidebar"
                    }
                    aria-label={
                        collapsed
                            ? "Expand sidebar"
                            : "Collapse sidebar"
                    }
                    className="absolute -right-3.5 top-1/2 z-50 size-7 -translate-y-1/2 rounded-full border-zinc-700 bg-[#111827] text-zinc-300 shadow-md hover:bg-zinc-800 hover:text-white"
                >
                    {collapsed ? (
                        <PanelLeftOpen className="size-3.5" />
                    ) : (
                        <PanelLeftClose className="size-3.5" />
                    )}
                </Button>
            </div>

            <nav
                className={cn(
                    "flex-1 space-y-1 overflow-x-hidden overflow-y-auto py-4",
                    collapsed ? "px-3" : "px-4",
                )}
            >
                {links.map((link) => {
                    const Icon = link.icon;

                    const active =
                        link.href === "/"
                            ? pathname === "/"
                            : link.href === "/dashboard"
                                ? pathname === "/dashboard"
                                : pathname === link.href ||
                                pathname.startsWith(
                                    `${link.href}/`,
                                );

                    return (
                        <div
                            key={link.id}
                            className="group relative"
                        >
                            <Link
                                href={link.href}
                                aria-label={link.name}
                                className={cn(
                                    "flex h-11 items-center rounded-xl text-sm font-medium text-zinc-400 transition-colors hover:bg-white/10 hover:text-white",
                                    collapsed
                                        ? "justify-center px-0"
                                        : "gap-3 px-4",
                                    active &&
                                    "bg-primary text-primary-foreground",
                                )}
                            >
                                <Icon className="size-5 shrink-0" />

                                {!collapsed && (
                                    <span className="whitespace-nowrap">
                                        {link.name}
                                    </span>
                                )}
                            </Link>

                            {collapsed && (
                                <div
                                    role="tooltip"
                                    className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-md bg-zinc-950 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
                                >
                                    {link.name}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            {!collapsed && (
                <div className="border-t border-white/10 p-4">
                    <div className="rounded-xl bg-white/5 p-4">
                        <p className="text-sm font-semibold">
                            Need Help?
                        </p>

                        <p className="mt-1 text-xs text-zinc-400">
                            Contact our support team anytime.
                        </p>

                        <Link
                            href="/contact"
                            className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                        >
                            Contact Support
                        </Link>
                    </div>
                </div>
            )}
        </aside>
    );
}