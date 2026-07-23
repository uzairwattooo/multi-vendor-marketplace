import Link from "next/link";
import {
    ExternalLink,
    Mail,
    MonitorSmartphone,
    ShoppingBag,
    Store as StoreIcon,
} from "lucide-react";

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

type AdminUserRow = {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    image: string | null;
    role: string;
    emailVerified: boolean;
    banned: boolean | null;
    banReason: string | null;
    banExpires: Date | null;
    createdAt: Date;
    storeId: string | null;
    storeName: string | null;
    storeStatus: "pending" | "approved" | "rejected" | "suspended" | null;
    orderCount: number;
    activeSessions: number;
};

type AdminUsersTableProps = {
    users: AdminUserRow[];
    currentAdminId: string;
};

export default function AdminUsersTable({
    users,
    currentAdminId,
}: AdminUsersTableProps) {
    if (users.length === 0) {
        return (
            <div className="rounded-3xl border border-dashed bg-card px-6 py-16 text-center">
                <Mail className="mx-auto size-10 text-muted-foreground" />
                <h3 className="mt-4 font-semibold">No users found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                    Try changing the search or filter values.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hiddenrounded-3xl border bg-card shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead className="min-w-[240px] px-5">
                            User
                        </TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Account</TableHead>
                        <TableHead>Activity</TableHead>
                        <TableHead>Store</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="px-5 text-right">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {users.map((currentUser) => (
                        <TableRow key={currentUser.id}>
                            <TableCell className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-sm font-bold text-primary">
                                        {currentUser.name
                                            .split(" ")
                                            .filter(Boolean)
                                            .map((word) => word.charAt(0))
                                            .join("")
                                            .slice(0, 2)
                                            .toUpperCase()}
                                    </div>

                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="truncate font-semibold">
                                                {currentUser.name}
                                            </p>
                                            {currentUser.id ===
                                                currentAdminId && (
                                                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                                                        You
                                                    </span>
                                                )}
                                        </div>
                                        <p className="mt-1 truncate text-xs text-muted-foreground">
                                            {currentUser.email}
                                        </p>
                                    </div>
                                </div>
                            </TableCell>

                            <TableCell>
                                <AdminStatusBadge
                                    value={currentUser.role}
                                />
                            </TableCell>

                            <TableCell>
                                <div className="flex flex-col items-start gap-1.5">
                                    <AdminStatusBadge
                                        value={
                                            currentUser.banned
                                                ? "banned"
                                                : "active"
                                        }
                                    />
                                    <span className="text-[11px] text-muted-foreground">
                                        {currentUser.emailVerified
                                            ? "Email verified"
                                            : "Email unverified"}
                                    </span>
                                </div>
                            </TableCell>

                            <TableCell>
                                <div className="space-y-1.5 text-xs text-muted-foreground">
                                    <p className="flex items-center gap-2">
                                        <ShoppingBag className="size-3.5" />
                                        {currentUser.orderCount} orders
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <MonitorSmartphone className="size-3.5" />
                                        {currentUser.activeSessions} sessions
                                    </p>
                                </div>
                            </TableCell>

                            <TableCell>
                                {currentUser.storeId &&
                                    currentUser.storeName ? (
                                    <Link
                                        href={`/admin/stores/${currentUser.storeId}`}
                                        className="group inline-flex max-w-[170px] items-center gap-2 text-sm font-medium hover:text-primary"
                                    >
                                        <StoreIcon className="size-4 shrink-0" />
                                        <span className="truncate">
                                            {currentUser.storeName}
                                        </span>
                                        <ExternalLink className="size-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                                    </Link>
                                ) : (
                                    <span className="text-sm text-muted-foreground">
                                        No store
                                    </span>
                                )}
                            </TableCell>

                            <TableCell className="text-sm text-muted-foreground">
                                {formatDate(currentUser.createdAt)}
                            </TableCell>

                            <TableCell className="px-5 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <Link
                                        href={`/admin/users/${currentUser.id}`}
                                        className={cn(
                                            buttonVariants({
                                                variant: "ghost",
                                                size: "sm",
                                            }),
                                            "rounded-xl",
                                        )}
                                    >
                                        View
                                    </Link>

                                    <AdminUserActions
                                        userId={currentUser.id}
                                        userName={currentUser.name}
                                        phone={currentUser.phone}
                                        role={currentUser.role}
                                        banned={currentUser.banned}
                                        emailVerified={
                                            currentUser.emailVerified
                                        }
                                        storeStatus={
                                            currentUser.storeStatus
                                        }
                                        isCurrentAdmin={
                                            currentUser.id ===
                                            currentAdminId
                                        }
                                    />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
