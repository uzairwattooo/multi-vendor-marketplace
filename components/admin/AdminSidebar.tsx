"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import { adminNavigation } from "./admin-navigation";

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-white/10 bg-[#111827] text-white lg:flex lg:flex-col">
            <div className="flex h-20 shrink-0 items-center gap-3 border-b border-white/10 px-6">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
                    <ShieldCheck className="size-5" />
                </div>

                <div>
                    <h2 className="font-bold">MarketNest Admin</h2>
                    <p className="mt-0.5 text-xs text-zinc-400">
                        Marketplace control center
                    </p>
                </div>
            </div>

            <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-5">
                {adminNavigation.map((group) => (
                    <div key={group.label}>
                        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                            {group.label}
                        </p>

                        <div className="space-y-1">
                            {group.items.map((item) => {
                                const Icon = item.icon;

                                const active = item.exact
                                    ? pathname === item.href
                                    : pathname === item.href ||
                                      pathname.startsWith(
                                          `${item.href}/`,
                                      );

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-zinc-400 transition-colors",
                                            "hover:bg-white/10 hover:text-white",
                                            active &&
                                                "bg-primary text-white shadow-sm shadow-primary/20",
                                        )}
                                    >
                                        <Icon className="size-[18px]" />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="border-t border-white/10 p-4">
                <div className="rounded-2xl bg-white/5 p-4">
                    <p className="text-xs font-semibold text-white">
                        Admin access
                    </p>
                    <p className="mt-1 text-xs leading-5 text-zinc-400">
                        Marketplace activity and sensitive actions are
                        restricted to administrators.
                    </p>
                </div>
            </div>
        </aside>
    );
}
