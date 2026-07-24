import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import SellerShell from "@/components/seller/SellerShell";
import { db } from "@/db";
import { store } from "@/db/schema";
import { auth } from "@/lib/auth";
import { requireSeller } from "@/lib/authorization";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SellerDashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
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

    if (!sellerStore) {
        notFound();
    }

    return (
        <SellerShell
            sellerName={session.user.name ?? "Seller"}
            storeName={sellerStore.name}
        >
            {children}
        </SellerShell>
    );
}