import { requireGuest } from "@/lib/authorization";

export default async function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await requireGuest();

    return <>{children}</>;
}