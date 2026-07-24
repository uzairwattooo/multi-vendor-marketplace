import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/authorization";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type AdminLayoutProps = Readonly<{
    children: React.ReactNode;
}>;

export default async function AdminLayout({
    children,
}: AdminLayoutProps) {
    const session = await requireAdmin();

    return (
        <AdminShell adminName={session.user.name ?? "Admin"}>
            {children}
        </AdminShell>
    );
}