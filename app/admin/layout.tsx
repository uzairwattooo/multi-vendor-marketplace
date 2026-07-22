import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { requireAdmin } from "@/lib/authorization";

export default async function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await requireAdmin();

    return (
        <div className="min-h-screen bg-muted/30">
            <AdminSidebar />

            <div className="min-h-screen lg:pl-72">
                <AdminHeader
                    adminName={
                        session.user.name ?? "Admin"
                    }
                />

                <main className="px-4 py-6 sm:px-6 lg:px-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
