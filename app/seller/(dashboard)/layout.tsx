import SellerHeader from "@/components/seller/SellerHeader";
import SellerSidebar from "@/components/seller/SellerSidebar";
import { requireSeller } from "@/lib/authorization";

export default async function SellerDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await requireSeller();

    return (
        <div className="min-h-screen bg-muted/30">
            <SellerSidebar />

            <div className="min-h-screen lg:pl-72">
                <SellerHeader />

                <main className="px-4 py-5 sm:px-6 lg:px-8">
                    {children}
                </main>
            </div>
        </div>
    );
}