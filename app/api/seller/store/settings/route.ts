import { and, eq, ne } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { store } from "@/db/schema";
import { auth } from "@/lib/auth";
import { createSlug } from "@/lib/slug";
import { updateStoreSettingsSchema } from "@/lib/validations/store";
import type { StoreSettingsData } from "@/types/store-settings";

function emptyToNull(value: string) {
    const normalized = value.trim();
    return normalized.length > 0 ? normalized : null;
}

async function getUniqueSlug(name: string, currentStoreId: string) {
    const generatedSlug = createSlug(name);
    const baseSlug = generatedSlug || `store-${crypto.randomUUID().slice(0, 8)}`;

    for (let attempt = 0; attempt < 6; attempt += 1) {
        const candidate =
            attempt === 0
                ? baseSlug
                : `${baseSlug}-${crypto.randomUUID().slice(0, 6)}`;

        const [existingStore] = await db
            .select({ id: store.id })
            .from(store)
            .where(
                and(
                    eq(store.slug, candidate),
                    ne(store.id, currentStoreId),
                ),
            )
            .limit(1);

        if (!existingStore) {
            return candidate;
        }
    }

    return `${baseSlug}-${crypto.randomUUID().slice(0, 12)}`;
}

export async function PATCH(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 },
            );
        }

        const [currentStore] = await db
            .select({
                id: store.id,
                name: store.name,
                slug: store.slug,
                status: store.status,
                rejectionReason: store.rejectionReason,
                stripeAccountId: store.stripeAccountId,
                isStripeConnected: store.isStripeConnected,
                stripeChargesEnabled: store.stripeChargesEnabled,
                stripePayoutsEnabled: store.stripePayoutsEnabled,
                stripeDetailsSubmitted: store.stripeDetailsSubmitted,
            })
            .from(store)
            .where(eq(store.ownerId, session.user.id))
            .limit(1);

        if (!currentStore) {
            return NextResponse.json(
                { message: "Store not found" },
                { status: 404 },
            );
        }

        const body: unknown = await request.json();
        const result = updateStoreSettingsSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    message: "Please check the submitted information",
                    errors: result.error.flatten().fieldErrors,
                },
                { status: 400 },
            );
        }

        const values = result.data;
        const slug =
            values.name === currentStore.name
                ? currentStore.slug
                : await getUniqueSlug(values.name, currentStore.id);

        const [updatedStore] = await db
            .update(store)
            .set({
                name: values.name,
                slug,
                category: values.category,
                description: values.description,
                email: values.email,
                phone: values.phone,

                businessType: values.businessType,
                businessName: emptyToNull(values.businessName),
                registrationNumber: emptyToNull(values.registrationNumber),
                ntn: emptyToNull(values.ntn),
                strn: emptyToNull(values.strn),

                address: values.address,
                city: values.city,
                state: emptyToNull(values.state),
                postalCode: emptyToNull(values.postalCode),
                landmark: emptyToNull(values.landmark),
                mapsUrl: emptyToNull(values.mapsUrl),
                country: values.country,

                logo: emptyToNull(values.logo),
                banner: emptyToNull(values.banner),
                primaryColor: values.primaryColor,
                secondaryColor: values.secondaryColor,
            })
            .where(eq(store.id, currentStore.id))
            .returning({
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
            });

        const responseStore: StoreSettingsData = {
            id: updatedStore.id,
            name: updatedStore.name,
            slug: updatedStore.slug,
            description: updatedStore.description ?? "",
            category: updatedStore.category,
            email: updatedStore.email,
            phone: updatedStore.phone,

            businessType:
                updatedStore.businessType === "company"
                    ? "company"
                    : "individual",
            businessName: updatedStore.businessName ?? "",
            registrationNumber: updatedStore.registrationNumber ?? "",
            ntn: updatedStore.ntn ?? "",
            strn: updatedStore.strn ?? "",

            logo: updatedStore.logo ?? "",
            banner: updatedStore.banner ?? "",
            primaryColor: updatedStore.primaryColor,
            secondaryColor: updatedStore.secondaryColor,

            address: updatedStore.address,
            city: updatedStore.city,
            state: updatedStore.state ?? "",
            postalCode: updatedStore.postalCode ?? "",
            landmark: updatedStore.landmark ?? "",
            mapsUrl: updatedStore.mapsUrl ?? "",
            country: updatedStore.country,

            status: currentStore.status,
            rejectionReason: currentStore.rejectionReason,
            stripeAccountId: currentStore.stripeAccountId,
            isStripeConnected: currentStore.isStripeConnected,
            stripeChargesEnabled: currentStore.stripeChargesEnabled,
            stripePayoutsEnabled: currentStore.stripePayoutsEnabled,
            stripeDetailsSubmitted: currentStore.stripeDetailsSubmitted,
        };

        return NextResponse.json({
            message: "Store settings updated successfully",
            store: responseStore,
        });
    } catch (error) {
        console.error("UPDATE_STORE_SETTINGS_ERROR:", error);

        return NextResponse.json(
            { message: "Unable to update store settings" },
            { status: 500 },
        );
    }
}
