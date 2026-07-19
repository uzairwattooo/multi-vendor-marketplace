import BuyerSidebar from "@/components/buyer/BuyerSidebar";

export default function BuyerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-muted/30">
            <BuyerSidebar />

            <main className="lg:ml-72">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}