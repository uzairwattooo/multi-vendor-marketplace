import { and, count, eq, isNull, ne, or } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/db";
import { store, user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { requireAdminApi } from "@/lib/admin/admin-api";

const updateUserSchema = z.discriminatedUnion("action", [
    z.object({
        action: z.literal("set_role"),
        role: z.enum(["buyer", "seller", "admin"]),
    }),
    z.object({
        action: z.literal("ban"),
        reason: z.string().trim().min(5).max(500),
        durationDays: z.number().int().positive().max(3650).nullable(),
    }),
    z.object({
        action: z.literal("unban"),
    }),
    z.object({
        action: z.literal("revoke_sessions"),
    }),
    z.object({
        action: z.literal("verify_email"),
    }),
    z.object({
        action: z.literal("update_profile"),
        name: z.string().trim().min(2).max(100),
        phone: z.string().trim().min(7).max(30),
    }),
    z.object({
        action: z.literal("set_password"),
        newPassword: z.string().min(8).max(128),
    }),
]);

type RouteContext = {
    params: Promise<{
        userId: string;
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

        if (!authorization.session) {
            return NextResponse.json(
                { message: "Authentication required" },
                { status: 401 },
            );
        }

        const { userId } = await context.params;
        const result = updateUserSchema.safeParse(
            await request.json(),
        );

        if (!result.success) {
            return NextResponse.json(
                {
                    message: "Invalid user management request",
                    errors: result.error.flatten().fieldErrors,
                },
                { status: 400 },
            );
        }

        const [targetUser] = await db
            .select({
                id: user.id,
                name: user.name,
                role: user.role,
                banned: user.banned,
            })
            .from(user)
            .where(eq(user.id, userId))
            .limit(1);

        if (!targetUser) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 },
            );
        }

        const isProtectedSelfAction =
            authorization.session.user.id === userId &&
            (result.data.action === "set_role" ||
                result.data.action === "ban" ||
                result.data.action === "revoke_sessions");

        if (isProtectedSelfAction) {
            return NextResponse.json(
                {
                    message:
                        "You cannot change your own role, ban yourself or revoke your current admin sessions from this screen",
                },
                { status: 409 },
            );
        }

        const removesAdminAccess =
            targetUser.role === "admin" &&
            (result.data.action === "ban" ||
                (result.data.action === "set_role" &&
                    result.data.role !== "admin"));

        if (removesAdminAccess) {
            const activeAdminCondition = or(
                eq(user.banned, false),
                isNull(user.banned),
            );

            const [adminCountResult] = await db
                .select({ total: count() })
                .from(user)
                .where(
                    and(
                        eq(user.role, "admin"),
                        ne(user.id, userId),
                        activeAdminCondition,
                    ),
                );

            if (Number(adminCountResult?.total ?? 0) === 0) {
                return NextResponse.json(
                    {
                        message:
                            "At least one active administrator must remain",
                    },
                    { status: 409 },
                );
            }
        }

        if (result.data.action === "set_role") {
            const [approvedStore] = await db
                .select({ id: store.id })
                .from(store)
                .where(
                    and(
                        eq(store.ownerId, userId),
                        eq(store.status, "approved"),
                    ),
                )
                .limit(1);

            if (
                result.data.role === "seller" &&
                !approvedStore
            ) {
                return NextResponse.json(
                    {
                        message:
                            "Seller access can only be granted after the user's store is approved",
                    },
                    { status: 409 },
                );
            }

            if (
                targetUser.role === "seller" &&
                result.data.role !== "seller" &&
                approvedStore
            ) {
                return NextResponse.json(
                    {
                        message:
                            "Suspend the user's approved store before removing seller access",
                    },
                    { status: 409 },
                );
            }

            await auth.api.setRole({
                body: {
                    userId,
                    role: result.data.role,
                },
                headers: request.headers,
            });

            return NextResponse.json({
                message: "User role updated successfully",
            });
        }

        if (result.data.action === "ban") {
            const [approvedStore] = await db
                .select({ id: store.id })
                .from(store)
                .where(
                    and(
                        eq(store.ownerId, userId),
                        eq(store.status, "approved"),
                    ),
                )
                .limit(1);

            if (approvedStore) {
                return NextResponse.json(
                    {
                        message:
                            "Suspend the user's approved store before banning the seller account",
                    },
                    { status: 409 },
                );
            }

            await auth.api.banUser({
                body: {
                    userId,
                    banReason: result.data.reason,
                    banExpiresIn:
                        result.data.durationDays === null
                            ? undefined
                            : result.data.durationDays * 24 * 60 * 60,
                },
                headers: request.headers,
            });

            return NextResponse.json({
                message: "User banned and active sessions revoked",
            });
        }

        if (result.data.action === "unban") {
            await auth.api.unbanUser({
                body: { userId },
                headers: request.headers,
            });

            return NextResponse.json({
                message: "User unbanned successfully",
            });
        }

        if (result.data.action === "revoke_sessions") {
            await auth.api.revokeUserSessions({
                body: { userId },
                headers: request.headers,
            });

            return NextResponse.json({
                message: "All user sessions revoked successfully",
            });
        }

        if (result.data.action === "update_profile") {
            await auth.api.adminUpdateUser({
                body: {
                    userId,
                    data: {
                        name: result.data.name,
                        phone: result.data.phone,
                    },
                },
                headers: request.headers,
            });

            return NextResponse.json({
                message: "User profile updated successfully",
            });
        }

        if (result.data.action === "set_password") {
            await auth.api.setUserPassword({
                body: {
                    userId,
                    newPassword: result.data.newPassword,
                },
                headers: request.headers,
            });

            return NextResponse.json({
                message: "User password updated successfully",
            });
        }

        await auth.api.adminUpdateUser({
            body: {
                userId,
                data: {
                    emailVerified: true,
                },
            },
            headers: request.headers,
        });

        return NextResponse.json({
            message: "User email marked as verified",
        });
    } catch (error) {
        console.error("ADMIN_UPDATE_USER_ERROR:", error);

        const message =
            error instanceof Error
                ? error.message
                : "Unable to update user";

        return NextResponse.json(
            { message },
            { status: 500 },
        );
    }
}
