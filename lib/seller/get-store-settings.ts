import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { store } from "@/db/schema";
import type { StoreSettingsData } from "@/types/store-settings";

export async function getStoreSettings(
    ownerId: string,
): Promise<StoreSettingsData | null> {
    const [sellerStore] = await db
        .select({
            id: store.id,
            name: store.name,
            slug: store.slug,
            description: store.description,
            category: store.category,
            email: store.email,
            phone: store.phone,

            businessType: store.businessType,
            businessName: store.businessName,
            registrationNumber: store.registrationNumber,
            ntn: store.ntn,
            strn: store.strn,

            logo: store.logo,
            banner: store.banner,
            primaryColor: store.primaryColor,
            secondaryColor: store.secondaryColor,

            address: store.address,
            city: store.city,
            state: store.state,
            postalCode: store.postalCode,
            landmark: store.landmark,
            mapsUrl: store.mapsUrl,
            country: store.country,

            status: store.status,
            rejectionReason: store.rejectionReason,
            stripeAccountId: store.stripeAccountId,
            isStripeConnected: store.isStripeConnected,
            stripeChargesEnabled: store.stripeChargesEnabled,
            stripePayoutsEnabled: store.stripePayoutsEnabled,
            stripeDetailsSubmitted: store.stripeDetailsSubmitted,
        })
        .from(store)
        .where(eq(store.ownerId, ownerId))
        .limit(1);

    if (!sellerStore) {
        return null;
    }

    return {
        id: sellerStore.id,
        name: sellerStore.name,
        slug: sellerStore.slug,
        description: sellerStore.description ?? "",
        category: sellerStore.category,
        email: sellerStore.email,
        phone: sellerStore.phone,

        businessType:
            sellerStore.businessType === "company"
                ? "company"
                : "individual",
        businessName: sellerStore.businessName ?? "",
        registrationNumber: sellerStore.registrationNumber ?? "",
        ntn: sellerStore.ntn ?? "",
        strn: sellerStore.strn ?? "",

        logo: sellerStore.logo ?? "",
        banner: sellerStore.banner ?? "",
        primaryColor: sellerStore.primaryColor,
        secondaryColor: sellerStore.secondaryColor,

        address: sellerStore.address,
        city: sellerStore.city,
        state: sellerStore.state ?? "",
        postalCode: sellerStore.postalCode ?? "",
        landmark: sellerStore.landmark ?? "",
        mapsUrl: sellerStore.mapsUrl ?? "",
        country: sellerStore.country,

        status: sellerStore.status,
        rejectionReason: sellerStore.rejectionReason,
        stripeAccountId: sellerStore.stripeAccountId,
        isStripeConnected: sellerStore.isStripeConnected,
        stripeChargesEnabled: sellerStore.stripeChargesEnabled,
        stripePayoutsEnabled: sellerStore.stripePayoutsEnabled,
        stripeDetailsSubmitted: sellerStore.stripeDetailsSubmitted,
    };
}
