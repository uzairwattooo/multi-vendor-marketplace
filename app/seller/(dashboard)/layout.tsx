import SellerHeader from "@/components/seller/SellerHeader";
import SellerSidebar from "@/components/seller/SellerSidebar";
import { db } from "@/db";
import { store } from "@/db/schema";
import { auth } from "@/lib/auth";
import { requireSeller } from "@/lib/authorization";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

export default async function SellerDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await requireSeller();
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        notFound();
    }

    const [sellerStore] = await db
        .select({
            name: store.name,
        })
        .from(store)
        .where(eq(store.ownerId, session.user.id))
        .limit(1);
    return (
        <div className="min-h-screen bg-muted/30">
            <SellerSidebar />

            <div className="min-h-screen lg:pl-72">
                <SellerHeader
                    sellerName={session.user.name}
                    storeName={sellerStore.name}
                />

                <main className="px-4 py-5 sm:px-6 lg:px-8">
                    {children}
                </main>
            </div>
        </div>
    );
}