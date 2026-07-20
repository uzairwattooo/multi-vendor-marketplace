import BuyerSidebar from "@/components/buyer/BuyerSidebar";
import { getProfile } from "@/lib/actions/profile";
import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";

export default async function BuyerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getProfile();
    if (!user) {
        notFound();
    }
    return (
        <div className="min-h-screen bg-muted/30">
            <BuyerSidebar user={user} />

            <main className="lg:ml-72">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}