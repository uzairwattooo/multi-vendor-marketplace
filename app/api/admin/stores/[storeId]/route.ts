import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/db";
import { store, user } from "@/db/schema";
import { auth } from "@/lib/auth";

const moderateStoreSchema = z.discriminatedUnion("action", [
    z.object({
        action: z.literal("approve"),
    }),

    z.object({
        action: z.literal("reject"),
        reason: z
            .string()
            .trim()
            .min(10, "Rejection reason must be at least 10 characters")
            .max(500, "Rejection reason must be less than 500 characters"),
    }),
]);

type RouteContext = {
    params: Promise<{
        storeId: string;
    }>;
};

export async function PATCH(
    request: Request,
    context: RouteContext,
) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json(
                {
                    message: "Authentication required",
                },
                {
                    status: 401,
                },
            );
        }

        if (session.user.role !== "admin") {
            return NextResponse.json(
                {
                    message: "Admin access required",
                },
                {
                    status: 403,
                },
            );
        }

        const { storeId } = await context.params;
        const body = await request.json();

        const result = moderateStoreSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    message: "Invalid moderation request",
                    errors: result.error.flatten().fieldErrors,
                },
                {
                    status: 400,
                },
            );
        }

        const [existingStore] = await db
            .select({
                id: store.id,
                ownerId: store.ownerId,
                name: store.name,
                status: store.status,
            })
            .from(store)
            .where(eq(store.id, storeId))
            .limit(1);

        if (!existingStore) {
            return NextResponse.json(
                {
                    message: "Store not found",
                },
                {
                    status: 404,
                },
            );
        }

        if (existingStore.status !== "pending") {
            return NextResponse.json(
                {
                    message: "Only pending stores can be moderated",
                },
                {
                    status: 409,
                },
            );
        }

        if (result.data.action === "approve") {
            const approvedStore = await db.transaction(async (tx) => {
                const [updatedStore] = await tx
                    .update(store)
                    .set({
                        status: "approved",
                        rejectionReason: null,
                        updatedAt: new Date(),
                    })
                    .where(
                        and(
                            eq(store.id, storeId),
                            eq(store.status, "pending"),
                        ),
                    )
                    .returning({
                        id: store.id,
                        name: store.name,
                        status: store.status,
                    });

                if (!updatedStore) {
                    throw new Error("Store could not be approved");
                }

                await tx
                    .update(user)
                    .set({
                        role: "seller",
                        updatedAt: new Date(),
                    })
                    .where(eq(user.id, existingStore.ownerId));

                return updatedStore;
            });

            return NextResponse.json({
                message: "Store approved successfully",
                store: approvedStore,
            });
        }

        const [rejectedStore] = await db
            .update(store)
            .set({
                status: "rejected",
                rejectionReason: result.data.reason,
                updatedAt: new Date(),
            })
            .where(
                and(
                    eq(store.id, storeId),
                    eq(store.status, "pending"),
                ),
            )
            .returning({
                id: store.id,
                name: store.name,
                status: store.status,
                rejectionReason: store.rejectionReason,
            });

        if (!rejectedStore) {
            return NextResponse.json(
                {
                    message: "Store could not be rejected",
                },
                {
                    status: 409,
                },
            );
        }

        return NextResponse.json({
            message: "Store rejected successfully",
            store: rejectedStore,
        });
    } catch (error) {
        console.error("MODERATE_STORE_ERROR:", error);

        return NextResponse.json(
            {
                message: "Unable to moderate store",
            },
            {
                status: 500,
            },
        );
    }
}