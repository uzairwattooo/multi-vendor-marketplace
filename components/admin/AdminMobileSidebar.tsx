"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, ShieldCheck } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { adminNavigation } from "./admin-navigation";

export default function AdminMobileSidebar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
                aria-label="Open admin navigation"
                className={cn(
                    buttonVariants({
                        variant: "outline",
                        size: "icon",
                    }),
                    "rounded-xl lg:hidden",
                )}
            >
                <Menu className="size-5" />
            </SheetTrigger>

            <SheetContent
                side="left"
                className="w-[310px] gap-0 overflow-y-auto hide-scrollbar  bg-[#111827] p-0 text-white sm:max-w-[340px]"
            >
                <SheetHeader className="border-b border-white/10 px-5 py-5 text-left">
                    <SheetTitle className="text-white">
                        <Link
                            href="/admin"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3"
                        >
                            <span className="flex size-11 items-center justify-center rounded-2xl bg-primary">
                                <ShieldCheck className="size-5" />
                            </span>

                            <span>
                                <span className="block font-bold">
                                    MarketNest Admin
                                </span>
                                <span className="mt-0.5 block text-xs font-normal text-zinc-400">
                                    Marketplace control center
                                </span>
                            </span>
                        </Link>
                    </SheetTitle>
                </SheetHeader>

                <nav className="space-y-6 px-4 py-5">
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
                                            onClick={() =>
                                                setOpen(false)
                                            }
                                            className={cn(
                                                "flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-zinc-400 transition-colors",
                                                "hover:bg-white/10 hover:text-white",
                                                active &&
                                                    "bg-primary text-white",
                                            )}
                                        >
                                            <Icon className="size-[18px]" />
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>
            </SheetContent>
        </Sheet>
    );
}
