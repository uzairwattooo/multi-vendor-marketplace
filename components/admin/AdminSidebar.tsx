"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    PanelLeftClose,
    PanelLeftOpen,
    ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { adminNavigation } from "./admin-navigation";

type AdminSidebarProps = {
    collapsed: boolean;
    onToggle: () => void;
};

export default function AdminSidebar({
    collapsed,
    onToggle,
}: AdminSidebarProps) {
    const pathname = usePathname();

    return (
        <TooltipProvider delay={100}>
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
                        href="/admin"
                        aria-label="Admin dashboard"
                        className="flex shrink-0 items-center gap-3 overflow-hidden"
                    >
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
                            <ShieldCheck className="size-5" />
                        </div>

                        {!collapsed && (
                            <div className="whitespace-nowrap">
                                <h2 className="font-bold">
                                    MarketNest Admin
                                </h2>

                                <p className="mt-0.5 text-xs text-zinc-400">
                                    Marketplace control center
                                </p>
                            </div>
                        )}
                    </Link>

                    <Tooltip>
                        <TooltipTrigger
                            render={
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={onToggle}
                                    aria-label={
                                        collapsed
                                            ? "Expand sidebar"
                                            : "Collapse sidebar"
                                    }
                                    className="absolute -right-3.5 top-1/2 z-10 size-7 -translate-y-1/2 rounded-full border-zinc-700 bg-[#111827] text-zinc-300 shadow-md hover:bg-zinc-800 hover:text-white"
                                />
                            }
                        >
                            {collapsed ? (
                                <PanelLeftOpen className="size-3.5" />
                            ) : (
                                <PanelLeftClose className="size-3.5" />
                            )}
                        </TooltipTrigger>

                        <TooltipContent side="right">
                            {collapsed
                                ? "Expand sidebar"
                                : "Collapse sidebar"}
                        </TooltipContent>
                    </Tooltip>
                </div>

                <nav
                    className={cn(
                        "hide-scrollbar flex-1 space-y-6 overflow-x-hidden overflow-y-auto py-5",
                        collapsed ? "px-3" : "px-4",
                    )}
                >
                    {adminNavigation.map((group) => (
                        <div key={group.label}>
                            {collapsed ? (
                                <div className="mx-auto mb-2 h-px w-6 bg-white/10" />
                            ) : (
                                <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                    {group.label}
                                </p>
                            )}

                            <div className="space-y-1">
                                {group.items.map((item) => {
                                    const Icon = item.icon;

                                    const active = item.exact
                                        ? pathname === item.href
                                        : pathname === item.href ||
                                        pathname.startsWith(
                                            `${item.href}/`,
                                        );

                                    const navigationLink = (
                                        <Link
                                            href={item.href}
                                            aria-label={item.label}
                                            className={cn(
                                                "flex h-11 items-center rounded-xl text-sm font-medium text-zinc-400 transition-colors hover:bg-white/10 hover:text-white",
                                                collapsed
                                                    ? "justify-center px-0"
                                                    : "gap-3 px-3.5",
                                                active &&
                                                "bg-primary text-white shadow-sm shadow-primary/20",
                                            )}
                                        >
                                            <Icon className="size-[18px] shrink-0" />

                                            {!collapsed && (
                                                <span>{item.label}</span>
                                            )}
                                        </Link>
                                    );

                                    if (!collapsed) {
                                        return (
                                            <div key={item.href}>
                                                {navigationLink}
                                            </div>
                                        );
                                    }

                                    return (
                                        <Tooltip key={item.href}>
                                            <TooltipTrigger
                                                render={
                                                    <Link
                                                        href={item.href}
                                                        aria-label={item.label}
                                                        className={cn(
                                                            "flex h-11 items-center justify-center rounded-xl px-0 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/10 hover:text-white",
                                                            active &&
                                                            "bg-primary text-white shadow-sm shadow-primary/20",
                                                        )}
                                                    />
                                                }
                                            >
                                                <Icon className="size-[18px] shrink-0" />
                                            </TooltipTrigger>

                                            <TooltipContent side="right">
                                                {item.label}
                                            </TooltipContent>
                                        </Tooltip>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {!collapsed && (
                    <div className="border-t border-white/10 p-4">
                        <div className="rounded-2xl bg-white/5 p-4">
                            <p className="text-xs font-semibold text-white">
                                Admin access
                            </p>

                            <p className="mt-1 text-xs leading-5 text-zinc-400">
                                Marketplace activity and sensitive actions
                                are restricted to administrators.
                            </p>
                        </div>
                    </div>
                )}
            </aside>
        </TooltipProvider>
    );
}