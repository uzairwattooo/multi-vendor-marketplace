import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import StoreSettingsClient from "@/components/seller/settings/StoreSettingsClient";
import { auth } from "@/lib/auth";
import { getStoreSettings } from "@/lib/seller/get-store-settings";

export default async function SellerSettingsPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/login");
    }

    const storeSettings = await getStoreSettings(session.user.id);

    if (!storeSettings) {
        notFound();
    }

    return <StoreSettingsClient initialData={storeSettings} />;
}
