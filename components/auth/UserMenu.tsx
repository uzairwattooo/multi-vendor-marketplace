"use client";

import Link from "next/link";
import { LogOut, User } from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function UserMenu() {
    const {
        data: session,
        isPending,
    } = authClient.useSession();

    async function handleLogout() {
        const { error } = await authClient.signOut();

        if (error) {
            toast.error(error.message || "Logout failed");
            return;
        }

        toast.success("Logout successful");
        window.location.href = "/";
    }

    if (isPending) {
        return (
            <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
        );
    }

    if (!session?.user) {
        return (
            <Link
                href="/login"
                className={cn(
                    buttonVariants({
                        variant: "outline",
                    })
                )}
            >
                <User className="size-4" />
                Login
            </Link>
        );
    }

    return (
        <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold">
                    {session.user.name}
                </p>

                <p className="max-w-25 truncate text-xs text-muted-foreground">
                    {session.user.email}
                </p>
            </div>

            <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleLogout}
                aria-label="Logout"
            >
                <LogOut className="size-4" />
            </Button>
        </div>
    );
}