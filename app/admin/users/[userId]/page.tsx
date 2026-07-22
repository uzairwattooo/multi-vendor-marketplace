import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
    ArrowLeft,
    CalendarDays,
    Heart,
    Mail,
    MapPin,
    MonitorSmartphone,
    Phone,
    ShoppingBag,
    Store as StoreIcon,
    WalletCards,
} from "lucide-react";

import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import AdminUserActions from "@/components/admin/users/AdminUserActions";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format-date";
import { getAdminUserDetails } from "@/lib/admin/get-admin-user-details";
import { requireAdmin } from "@/lib/authorization";

function formatMoney(amount: number) {
    return new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        maximumFractionDigits: 0,
    }).format(amount);
}

type AdminUserDetailsPageProps = {
    params: Promise<{
        userId: string;
    }>;
};

export default async function AdminUserDetailsPage({
    params,
}: AdminUserDetailsPageProps) {
    const session = await requireAdmin();
    const { userId } = await params;
    const data = await getAdminUserDetails(userId);

    if (!data) {
        notFound();
    }

    const { profile, stats, sessions, recentOrders } = data;

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div>
                    <Link
                        href="/admin/users"
                        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeft className="size-4" />
                        Back to users
                    </Link>

                    <div className="mt-5 flex items-center gap-4">
                        <div className="flex size-16 shrink-0 items-center justify-center rounded-3xl bg-primary/10 text-xl font-bold text-primary">
                            {profile.name
                                .split(" ")
                                .filter(Boolean)
                                .map((word) => word.charAt(0))
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                        </div>

                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="truncate text-3xl font-bold tracking-tight">
                                    {profile.name}
                                </h1>
                                <AdminStatusBadge value={profile.role} />
                                <AdminStatusBadge
                                    value={
                                        profile.banned
                                            ? "banned"
                                            : "active"
                                    }
                                />
                            </div>
                            <p className="mt-2 text-muted-foreground">
                                Marketplace account details, activity and
                                security sessions.
                            </p>
                        </div>
                    </div>
                </div>

                <AdminUserActions
                    userId={profile.id}
                    userName={profile.name}
                    phone={profile.phone}
                    role={profile.role}
                    banned={profile.banned}
                    emailVerified={profile.emailVerified}
                    storeStatus={profile.storeStatus}
                    isCurrentAdmin={profile.id === session.user.id}
                />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <AdminStatCard
                    title="Orders"
                    value={stats.orderCount.toLocaleString()}
                    description="Orders placed as a buyer"
                    icon={ShoppingBag}
                />
                <AdminStatCard
                    title="Paid Spending"
                    value={formatMoney(stats.totalSpent)}
                    description="Total from paid orders"
                    icon={WalletCards}
                    accent="success"
                />
                <AdminStatCard
                    title="Wishlist"
                    value={stats.wishlistCount.toLocaleString()}
                    description="Saved marketplace products"
                    icon={Heart}
                    accent="warning"
                />
                <AdminStatCard
                    title="Active Sessions"
                    value={stats.sessionCount.toLocaleString()}
                    description="Currently valid login sessions"
                    icon={MonitorSmartphone}
                    accent="blue"
                />
            </div>

            <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                <section className="rounded-3xl border bg-card p-6 shadow-sm">
                    <h2 className="text-lg font-semibold">
                        Account information
                    </h2>

                    <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                        <DetailItem
                            icon={<Mail className="size-4" />}
                            label="Email"
                            value={profile.email}
                        />
                        <DetailItem
                            icon={<Phone className="size-4" />}
                            label="Phone"
                            value={profile.phone || "Not provided"}
                        />
                        <DetailItem
                            icon={<CalendarDays className="size-4" />}
                            label="Joined"
                            value={formatDate(profile.createdAt)}
                        />
                        <DetailItem
                            icon={<CalendarDays className="size-4" />}
                            label="Last updated"
                            value={formatDate(profile.updatedAt)}
                        />
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2 border-t pt-6">
                        <AdminStatusBadge
                            value={
                                profile.emailVerified
                                    ? "verified"
                                    : "unverified"
                            }
                            label={
                                profile.emailVerified
                                    ? "Email verified"
                                    : "Email unverified"
                            }
                        />
                        {profile.banExpires && (
                            <span className="text-xs text-muted-foreground">
                                Ban expires {formatDate(profile.banExpires)}
                            </span>
                        )}
                    </div>

                    {profile.banned && profile.banReason && (
                        <div className="mt-5 rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-destructive">
                                Ban reason
                            </p>
                            <p className="mt-2 text-sm leading-6">
                                {profile.banReason}
                            </p>
                        </div>
                    )}
                </section>

                <section className="rounded-3xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold">
                                Seller store
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Store ownership and moderation state.
                            </p>
                        </div>
                        <StoreIcon className="size-5 text-muted-foreground" />
                    </div>

                    {profile.storeId && profile.storeName ? (
                        <div className="mt-6 rounded-2xl border bg-muted/30 p-5">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="font-semibold">
                                        {profile.storeName}
                                    </p>
                                    <div className="mt-2">
                                        <AdminStatusBadge
                                            value={
                                                profile.storeStatus ??
                                                "pending"
                                            }
                                        />
                                    </div>
                                </div>

                                <Link
                                    href={`/admin/stores/${profile.storeId}`}
                                    className={cn(
                                        buttonVariants({
                                            variant: "outline",
                                        }),
                                        "rounded-xl",
                                    )}
                                >
                                    View Store
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-6 rounded-2xl border border-dashed p-8 text-center">
                            <StoreIcon className="mx-auto size-9 text-muted-foreground" />
                            <p className="mt-3 font-medium">
                                No store connected
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                This user has not created a marketplace store.
                            </p>
                        </div>
                    )}
                </section>
            </div>

            <section className="overflow-hidden rounded-3xl border bg-card shadow-sm">
                <div className="border-b px-6 py-5">
                    <h2 className="text-lg font-semibold">Recent orders</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Latest buyer activity for this account.
                    </p>
                </div>

                {recentOrders.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50 hover:bg-muted/50">
                                <TableHead className="px-6">
                                    Order
                                </TableHead>
                                <TableHead>Store</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Payment</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead className="px-6">Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentOrders.map((currentOrder) => (
                                <TableRow key={currentOrder.id}>
                                    <TableCell className="px-6 font-semibold">
                                        {currentOrder.orderNumber}
                                    </TableCell>
                                    <TableCell>{currentOrder.storeName}</TableCell>
                                    <TableCell>
                                        <AdminStatusBadge
                                            value={currentOrder.status}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <AdminStatusBadge
                                            value={currentOrder.paymentStatus}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {formatMoney(
                                            Number(
                                                currentOrder.totalAmount,
                                            ),
                                        )}
                                    </TableCell>
                                    <TableCell className="px-6 text-muted-foreground">
                                        {formatDate(currentOrder.createdAt)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="px-6 py-12 text-center text-sm text-muted-foreground">
                        No orders found for this user.
                    </div>
                )}
            </section>

            <section className="overflow-hidden rounded-3xl border bg-card shadow-sm">
                <div className="border-b px-6 py-5">
                    <h2 className="text-lg font-semibold">Login sessions</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Recent devices, IP addresses and expiration times.
                    </p>
                </div>

                {sessions.length > 0 ? (
                    <div className="divide-y">
                        {sessions.map((currentSession) => (
                            <div
                                key={currentSession.id}
                                className="grid gap-4 px-6 py-5 md:grid-cols-[1fr_180px_150px] md:items-center"
                            >
                                <div className="min-w-0">
                                    <p className="flex items-center gap-2 font-medium">
                                        <MonitorSmartphone className="size-4 text-muted-foreground" />
                                        {currentSession.ipAddress ||
                                            "Unknown IP address"}
                                    </p>
                                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">
                                        {currentSession.userAgent ||
                                            "Unknown browser or device"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Last activity
                                    </p>
                                    <p className="mt-1 text-sm font-medium">
                                        {formatDate(currentSession.updatedAt)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Expires
                                    </p>
                                    <p className="mt-1 text-sm font-medium">
                                        {formatDate(currentSession.expiresAt)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="px-6 py-12 text-center text-sm text-muted-foreground">
                        No sessions found for this user.
                    </div>
                )}
            </section>
        </div>
    );
}

type DetailItemProps = {
    icon: ReactNode;
    label: string;
    value: string;
};

function DetailItem({ icon, label, value }: DetailItemProps) {
    return (
        <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {label}
            </p>
            <p className="mt-2 flex items-center gap-2 text-sm font-medium">
                <span className="text-muted-foreground">{icon}</span>
                <span className="truncate">{value}</span>
            </p>
        </div>
    );
}
