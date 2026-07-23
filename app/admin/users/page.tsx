import {
    Ban,
    ShieldCheck,
    Store,
    UserRound,
    Users,
} from "lucide-react";

import AdminPagination from "@/components/admin/AdminPagination";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminUsersTable from "@/components/admin/users/AdminUsersTable";
import CreateUserDialog from "@/components/admin/users/CreateUserDialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAdminUsers } from "@/lib/admin/get-admin-users";
import { requireAdmin } from "@/lib/authorization";

function readParam(
    value: string | string[] | undefined,
) {
    return Array.isArray(value) ? value[0] : value;
}

type AdminUsersPageProps = {
    searchParams: Promise<
        Record<string, string | string[] | undefined>
    >;
};

export default async function AdminUsersPage({
    searchParams,
}: AdminUsersPageProps) {
    const session = await requireAdmin();
    const rawParams = await searchParams;

    const query = readParam(rawParams.q)?.trim() ?? "";
    const role = readParam(rawParams.role) ?? "all";
    const status = readParam(rawParams.status) ?? "all";
    const verification =
        readParam(rawParams.verification) ?? "all";
    const sort = readParam(rawParams.sort) ?? "newest";
    const page = Number(readParam(rawParams.page) ?? 1);

    const result = await getAdminUsers({
        query,
        role:
            role === "buyer" ||
            role === "seller" ||
            role === "admin"
                ? role
                : "all",
        status:
            status === "active" || status === "banned"
                ? status
                : "all",
        verification:
            verification === "verified" ||
            verification === "unverified"
                ? verification
                : "all",
        sort:
            sort === "oldest" || sort === "name"
                ? sort
                : "newest",
        page: Number.isFinite(page) ? page : 1,
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                        User management
                    </p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight">
                        Marketplace users
                    </h1>
                    <p className="mt-2 max-w-2xl text-muted-foreground">
                        Manage buyers, sellers, administrators, bans,
                        verification and active sessions.
                    </p>
                </div>

                <CreateUserDialog />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <AdminStatCard
                    title="Total Users"
                    value={result.stats.total.toLocaleString()}
                    description="All marketplace accounts"
                    icon={Users}
                />
                <AdminStatCard
                    title="Buyers"
                    value={result.stats.buyers.toLocaleString()}
                    description="Shopping accounts"
                    icon={UserRound}
                />
                <AdminStatCard
                    title="Sellers"
                    value={result.stats.sellers.toLocaleString()}
                    description="Seller dashboard access"
                    icon={Store}
                />
                <AdminStatCard
                    title="Administrators"
                    value={result.stats.admins.toLocaleString()}
                    description="Full admin access"
                    icon={ShieldCheck}
                />
                <AdminStatCard
                    title="Banned"
                    value={result.stats.banned.toLocaleString()}
                    description="Restricted accounts"
                    icon={Ban}
                />
            </div>

            <form className="grid gap-3 rounded-3xl border bg-card p-4 shadow-sm lg:grid-cols-[minmax(175px,1fr)_repeat(4,170px)_auto]">
                <input
                    type="search"
                    name="q"
                    defaultValue={query}
                    placeholder="Search name, email or phone..."
                    className="h-10 rounded-xl border bg-background px-3 text-sm outline-none focus:border-primary/50 focus:ring-3 focus:ring-primary/10"
                />

                <select
                    name="role"
                    defaultValue={role}
                    className="h-10 rounded-xl border bg-background px-3 text-sm outline-none"
                >
                    <option value="all">All roles</option>
                    <option value="buyer">Buyers</option>
                    <option value="seller">Sellers</option>
                    <option value="admin">Admins</option>
                </select>

                <select
                    name="status"
                    defaultValue={status}
                    className="h-10 rounded-xl border bg-background px-3 text-sm outline-none"
                >
                    <option value="all">All statuses</option>
                    <option value="active">Active</option>
                    <option value="banned">Banned</option>
                </select>

                <select
                    name="verification"
                    defaultValue={verification}
                    className="h-10 rounded-xl border bg-background px-3 text-sm outline-none"
                >
                    <option value="all">All verification</option>
                    <option value="verified">Verified email</option>
                    <option value="unverified">Unverified email</option>
                </select>

                <select
                    name="sort"
                    defaultValue={sort}
                    className="h-10 rounded-xl border bg-background px-3 text-sm outline-none"
                >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="name">Name A–Z</option>
                </select>

                <button
                    type="submit"
                    className={cn(
                        buttonVariants(),
                        "h-10 rounded-xl px-2",
                    )}
                >
                    Apply
                </button>
            </form>

            <AdminUsersTable
                users={result.users}
                currentAdminId={session.user.id}
            />

            <AdminPagination
                page={result.pagination.page}
                pageCount={result.pagination.pageCount}
                total={result.pagination.total}
                pathname="/admin/users"
                searchParams={{
                    q: query || undefined,
                    role,
                    status,
                    verification,
                    sort,
                }}
            />
        </div>
    );
}
