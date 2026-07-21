import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";

type DashboardButtonProps = {
    role?: string | null;
    mobile?: boolean;
};

export default function DashboardButton({
    role,
    mobile = false,
}: DashboardButtonProps) {
    const className = cn(
        buttonVariants(),
        mobile && "w-full",
    );

    const normalizedRole = role?.trim().toLowerCase();

    if (normalizedRole === "seller") {
        return (
            <Link href="/seller/dashboard" className={className}>
                Seller Dashboard
            </Link>
        );
    }

    if (normalizedRole === "admin") {
        return (
            <Link href="/admin" className={className}>
                Admin Dashboard
            </Link>
        );
    }

    if (normalizedRole === "buyer") {
        return (
            <Link href="/dashboard" className={className}>
                Dashboard
            </Link>
        );
    }

    return (
        <Link href="/seller/onboarding" className={className}>
            Become a Seller
        </Link>
    );
}