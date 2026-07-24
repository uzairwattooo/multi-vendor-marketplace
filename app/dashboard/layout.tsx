import BuyerShell from "@/components/buyer/BuyerShell";
import { getProfile } from "@/lib/actions/profile";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BuyerLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await getProfile();

    if (!user) {
        notFound();
    }

    return (
        <BuyerShell
            user={{
                name: user.name,
                image: user.image,
            }}
        >
            {children}
        </BuyerShell>
    );
}