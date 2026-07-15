import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { store } from "@/db/schema";
import { createSlug } from "@/lib/slug";
import { createStoreSchema } from "@/lib/validations/store";

export async function POST(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json(
                {
                    message: "You must be logged in to create a store",
                },
                {
                    status: 401,
                },
            );
        }

        const existingStore = await db
            .select({
                id: store.id,
            })
            .from(store)
            .where(eq(store.ownerId, session.user.id))
            .limit(1);

        if (existingStore.length > 0) {
            return NextResponse.json(
                {
                    message: "You already have a store",
                },
                {
                    status: 409,
                },
            );
        }

        const body = await request.json();

        const result = createStoreSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    message: "Please check the submitted information",
                    errors: result.error.flatten().fieldErrors,
                },
                {
                    status: 400,
                },
            );
        }

        const baseSlug = createSlug(result.data.name);

        const storeWithSameSlug = await db
            .select({
                id: store.id,
            })
            .from(store)
            .where(eq(store.slug, baseSlug))
            .limit(1);

        const slug =
            storeWithSameSlug.length > 0
                ? `${baseSlug}-${crypto.randomUUID().slice(0, 6)}`
                : baseSlug;

        const [createdStore] = await db
            .insert(store)
            .values({
                ownerId: session.user.id,
                name: result.data.name,
                slug,
                category: result.data.category,
                description: result.data.description,
                email: result.data.email,
                phone: result.data.phone,
                address: result.data.address,
                city: result.data.city,
                country: result.data.country,
            })
            .returning({
                id: store.id,
                name: store.name,
                slug: store.slug,
                status: store.status,
            });

        return NextResponse.json(
            {
                message: "Store application submitted successfully",
                store: createdStore,
            },
            {
                status: 201,
            },
        );
    } catch (error) {
        console.error("CREATE_STORE_ERROR:", error);

        return NextResponse.json(
            {
                message: "Unable to create store",
            },
            {
                status: 500,
            },
        );
    }
}