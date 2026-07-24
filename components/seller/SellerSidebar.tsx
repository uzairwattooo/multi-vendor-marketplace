"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BarChart3,
    Boxes,
    CreditCard,
    House,
    LayoutDashboard,
    Package,
    PanelLeftClose,
    PanelLeftOpen,
    Plus,
    Settings,
    ShoppingBag,
    Store,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
    {
        id: "dashboard",
        name: "Dashboard",
        href: "/seller/dashboard",
        icon: LayoutDashboard,
    },
    {
        id: "products",
        name: "Products",
        href: "/seller/products",
        icon: Package,
    },
    {
        id: "addproducts",
        name: "Add Product",
        href: "/seller/products/new",
        icon: Plus,
    },
    {
        id: "orders",
        name: "Orders",
        href: "/seller/orders",
        icon: ShoppingBag,
    },
    {
        id: "inventory",
        name: "Inventory",
        href: "/seller/inventory",
        icon: Boxes,
    },
    {
        id: "analytics",
        name: "Analytics",
        href: "/seller/analytics",
        icon: BarChart3,
    },
    {
        id: "payouts",
        name: "Payouts",
        href: "/seller/payouts",
        icon: CreditCard,
    },
    {
        id: "home",
        name: "Home",
        href: "/",
        icon: House,
    },
    {
        id: "settings",
        name: "Store Settings",
        href: "/seller/settings",
        icon: Settings,
    },
];

type SellerSidebarProps = {
    collapsed: boolean;
    onToggle: () => void;
};

export default function SellerSidebar({
    collapsed,
    onToggle,
}: SellerSidebarProps) {
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
                    href="/seller/dashboard"
                    aria-label="Seller dashboard"
                    className="flex min-w-0 items-center gap-3"
                >
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary">
                        <Store className="size-5" />
                    </div>

                    {!collapsed && (
                        <div className="min-w-0">
                            <h2 className="whitespace-nowrap font-bold">
                                Seller Center
                            </h2>

                            <p className="whitespace-nowrap text-xs text-zinc-400">
                                Manage your store
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
                            : link.href === "/seller/products"
                                ? pathname === "/seller/products"
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
                                    "bg-primary text-white",
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
        </aside>
    );
}