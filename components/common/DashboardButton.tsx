import Link from "next/link";
import type {
    MouseEventHandler,
} from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DashboardButtonProps = {
    role?: string | null;
    mobile?: boolean;
    onClick?: MouseEventHandler<HTMLAnchorElement>;
};

export default function DashboardButton({
    role,
    mobile = false,
    onClick,
}: DashboardButtonProps) {
    const normalizedRole = role
        ?.trim()
        .toLowerCase();

    const className = cn(
        buttonVariants(),
        "rounded-xl",
        mobile && "w-full",
    );

    if (normalizedRole === "seller") {
        return (
            <Link
                href="/seller/dashboard"
                className={className}
                onClick={onClick}
            >
                Seller Dashboard
            </Link>
        );
    }

    if (normalizedRole === "admin") {
        return (
            <Link
                href="/admin"
                className={className}
                onClick={onClick}
            >
                Admin Dashboard
            </Link>
        );
    }

    if (normalizedRole === "buyer") {
        return (
            <Link
                href="/dashboard"
                className={className}
                onClick={onClick}
            >
                Buyer Dashboard
            </Link>
        );
    }

    return (
        <Link
            href="/seller/onboarding"
            className={className}
            onClick={onClick}
        >
            Become a Seller
        </Link>
    );
}