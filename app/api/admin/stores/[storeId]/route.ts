import { and, eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/db";
import { store, user } from "@/db/schema";
import { requireAdminApi } from "@/lib/admin/admin-api";

const manageStoreSchema = z.discriminatedUnion("action", [
    z.object({
        action: z.literal("approve"),
    }),
    z.object({
        action: z.literal("reject"),
        reason: z.string().trim().min(5).max(500),
    }),
    z.object({
        action: z.literal("suspend"),
        reason: z.string().trim().min(5).max(500),
    }),
    z.object({
        action: z.literal("restore"),
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
        const authorization = await requireAdminApi(request);

        if (authorization.response) {
            return authorization.response;
        }

        const { storeId } = await context.params;
        const result = manageStoreSchema.safeParse(
            await request.json(),
        );

        if (!result.success) {
            return NextResponse.json(
                {
                    message: "Invalid store management request",
                    errors: result.error.flatten().fieldErrors,
                },
                { status: 400 },
            );
        }

        const [existingStore] = await db
            .select({
                id: store.id,
                ownerId: store.ownerId,
                name: store.name,
                status: store.status,
                ownerBanned: user.banned,
            })
            .from(store)
            .innerJoin(user, eq(user.id, store.ownerId))
            .where(eq(store.id, storeId))
            .limit(1);

        if (!existingStore) {
            return NextResponse.json(
                { message: "Store not found" },
                { status: 404 },
            );
        }

        if (result.data.action === "approve") {
            if (existingStore.ownerBanned) {
                return NextResponse.json(
                    {
                        message:
                            "Unban the store owner before approving the store",
                    },
                    { status: 409 },
                );
            }

            if (
                existingStore.status !== "pending" &&
                existingStore.status !== "rejected"
            ) {
                return NextResponse.json(
                    {
                        message:
                            "Only pending or rejected stores can be approved",
                    },
                    { status: 409 },
                );
            }

            await db.transaction(async (tx) => {
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
                            inArray(store.status, [
                                "pending",
                                "rejected",
                            ]),
                        ),
                    )
                    .returning({ id: store.id });

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
            });

            return NextResponse.json({
                message: "Store approved successfully",
            });
        }

        if (result.data.action === "reject") {
            if (existingStore.status !== "pending") {
                return NextResponse.json(
                    {
                        message: "Only pending stores can be rejected",
                    },
                    { status: 409 },
                );
            }

            const [updatedStore] = await db
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
                .returning({ id: store.id });

            if (!updatedStore) {
                return NextResponse.json(
                    { message: "Store could not be rejected" },
                    { status: 409 },
                );
            }

            return NextResponse.json({
                message: "Store application rejected",
            });
        }

        if (result.data.action === "suspend") {
            if (existingStore.status !== "approved") {
                return NextResponse.json(
                    {
                        message: "Only approved stores can be suspended",
                    },
                    { status: 409 },
                );
            }

            const [updatedStore] = await db
                .update(store)
                .set({
                    status: "suspended",
                    rejectionReason: result.data.reason,
                    updatedAt: new Date(),
                })
                .where(
                    and(
                        eq(store.id, storeId),
                        eq(store.status, "approved"),
                    ),
                )
                .returning({ id: store.id });

            if (!updatedStore) {
                return NextResponse.json(
                    { message: "Store could not be suspended" },
                    { status: 409 },
                );
            }

            return NextResponse.json({
                message: "Store suspended successfully",
            });
        }

        if (existingStore.ownerBanned) {
            return NextResponse.json(
                {
                    message:
                        "Unban the store owner before restoring the store",
                },
                { status: 409 },
            );
        }

        if (existingStore.status !== "suspended") {
            return NextResponse.json(
                {
                    message: "Only suspended stores can be restored",
                },
                { status: 409 },
            );
        }

        await db.transaction(async (tx) => {
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
                        eq(store.status, "suspended"),
                    ),
                )
                .returning({ id: store.id });

            if (!updatedStore) {
                throw new Error("Store could not be restored");
            }

            await tx
                .update(user)
                .set({
                    role: "seller",
                    updatedAt: new Date(),
                })
                .where(eq(user.id, existingStore.ownerId));
        });

        return NextResponse.json({
            message: "Store restored successfully",
        });
    } catch (error) {
        console.error("ADMIN_MANAGE_STORE_ERROR:", error);

        const message =
            error instanceof Error
                ? error.message
                : "Unable to manage store";

        return NextResponse.json(
            { message },
            { status: 500 },
        );
    }
}
