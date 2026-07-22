"use client";

import Link from "next/link";
import { Bell, ExternalLink } from "lucide-react";
import { usePathname } from "next/navigation";

import UserMenu from "@/components/auth/UserMenu";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import AdminMobileSidebar from "./AdminMobileSidebar";
import { getAdminPageTitle } from "./admin-navigation";

type AdminHeaderProps = {
    adminName: string;
};

export default function AdminHeader({
    adminName,
}: AdminHeaderProps) {
    const pathname = usePathname();
    const title = getAdminPageTitle(pathname);

    return (
        <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur-xl">
            <div className="flex min-h-18 items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
                <div className="flex min-w-0 items-center gap-3">
                    <AdminMobileSidebar />

                    <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-muted-foreground">
                            Welcome back, {adminName}
                        </p>
                        <h2 className="truncate text-lg font-semibold">
                            {title}
                        </h2>
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    <Link
                        href="/"
                        className={cn(
                            buttonVariants({
                                variant: "outline",
                                size: "sm",
                            }),
                            "hidden gap-2 rounded-xl md:inline-flex",
                        )}
                    >
                        View Marketplace
                        <ExternalLink className="size-3.5" />
                    </Link>

                    <button
                        type="button"
                        aria-label="Admin notifications"
                        className={cn(
                            buttonVariants({
                                variant: "outline",
                                size: "icon",
                            }),
                            "relative rounded-xl",
                        )}
                    >
                        <Bell className="size-4.5" />
                    </button>

                    <UserMenu />
                </div>
            </div>
        </header>
    );
}
