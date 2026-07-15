"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BarChart3,
    Boxes,
    CreditCard,
    LayoutDashboard,
    Package,
    Plus,
    Settings,
    ShoppingBag,
    Store,
} from "lucide-react";

import { cn } from "@/lib/utils";

const links = [
    {
        name: "Dashboard",
        href: "/seller/dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Products",
        href: "/seller/products",
        icon: Package,
    },
    {
        name: "Add Product",
        href: "/seller/products/new",
        icon: Plus,
    },
    {
        name: "Orders",
        href: "#",
        icon: ShoppingBag,
    },
    {
        name: "Inventory",
        href: "/seller/inventory",
        icon: Boxes,
    },
    {
        name: "Analytics",
        href: "#",
        icon: BarChart3,
    },
    {
        name: "Payouts",
        href: "#",
        icon: CreditCard,
    },
    {
        name: "Store Settings",
        href: "#",
        icon: Settings,
    },
];

export default function SellerSidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-white/10 bg-[#111827] text-white lg:block">
            <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary">
                    <Store className="size-5" />
                </div>

                <div>
                    <h2 className="font-bold">Seller Center</h2>
                    <p className="text-xs text-zinc-400">
                        Manage your store
                    </p>
                </div>
            </div>

            <nav className="space-y-1 p-4">
                {links.map((link) => {
                    const Icon = link.icon;

                    const active =
                        pathname === link.href ||
                        (link.href !== "/seller/dashboard" &&
                            pathname.startsWith(link.href));

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-400 transition",
                                "hover:bg-white/10 hover:text-white",
                                active && "bg-primary text-white",
                            )}
                        >
                            <Icon className="size-5" />
                            {link.name}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}