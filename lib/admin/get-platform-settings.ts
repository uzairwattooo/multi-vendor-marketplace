import { eq } from "drizzle-orm";

import { db } from "@/db";
import { platformSettings } from "@/db/schema";

export const defaultPlatformSettings = {
    marketplaceName: "Marketplace",
    supportEmail: "",
    supportPhone: "",
    currency: "PKR",
    commissionRate: 10,
    minimumOrderAmount: 0,
    stripeEnabled: true,
    codEnabled: true,
};

export type PlatformSettingsData = typeof defaultPlatformSettings;

export async function getPlatformSettings(): Promise<PlatformSettingsData> {
    const [settings] = await db
        .select()
        .from(platformSettings)
        .where(eq(platformSettings.id, "default"))
        .limit(1);

    if (!settings) {
        return defaultPlatformSettings;
    }

    return {
        marketplaceName: settings.marketplaceName,
        supportEmail: settings.supportEmail,
        supportPhone: settings.supportPhone,
        currency: settings.currency,
        commissionRate: Number(settings.commissionRate),
        minimumOrderAmount: Number(settings.minimumOrderAmount),
        stripeEnabled: settings.stripeEnabled,
        codEnabled: settings.codEnabled,
    };
}