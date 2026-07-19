"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    House,
    Heart,
    LayoutDashboard,
    MapPin,
    ShoppingBag,
    User,
} from "lucide-react";

import { cn } from "@/lib/utils";

const links = [
    {
        id: "dashboard",
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        exact: true,
    },
    {
        id: "orders",
        name: "My Orders",
        href: "/dashboard/orders",
        icon: ShoppingBag,
        exact: false
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

export default function BuyerSidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-white/10 bg-[#111827] text-white lg:block">
            <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary">
                    <User className="size-5" />
                </div>

                <div>
                    <h2 className="font-bold">
                        My Account
                    </h2>

                    <p className="text-xs text-zinc-400">
                        Manage your orders & profile
                    </p>
                </div>
            </div>

            <nav className="space-y-1 p-4">
                {links.map((link) => {
                    const Icon = link.icon;
                    const active =
                        link.href === "/"
                            ? pathname === "/"
                            : link.href === "/dashboard"
                                ? pathname === "/dashboard"
                                : pathname === link.href ||
                                pathname.startsWith(`${link.href}/`);
                    return (
                        <Link
                            key={link.id}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
                                "text-zinc-400 hover:bg-white/10 hover:text-white",
                                active &&
                                "bg-primary text-primary-foreground"
                            )}
                        >
                            <Icon className="size-5" />
                            {link.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="absolute bottom-0 w-full border-t border-white/10 p-4">
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
        </aside>
    );
}