"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user } from "@/db/schema";
import {
    changePasswordSchema,
    type ChangePasswordSchema,
} from "@/lib/validations/change-password-schema";
import {
    profileSchema,
    type ProfileSchema,
} from "@/lib/validations/profile-schema";


export async function getProfile() {
    try {
        const session =
            await auth.api.getSession({
                headers: await headers(),
            });

        if (!session?.user) {
            throw new Error("Unauthorized");
        }

        const profile =
            await db.query.user.findFirst({
                where: eq(
                    user.id,
                    session.user.id,
                ),
            });

        if (!profile) {
            throw new Error(
                "User not found."
            );
        }

        return profile;
    } catch (error) {
    console.error("GET_PROFILE_ERROR:", error);
    return null;
}
}
export async function updateProfile(
    values: ProfileSchema,
) {
    try {
        const session =
            await auth.api.getSession({
                headers: await headers(),
            });

        if (!session?.user) {
            throw new Error("Unauthorized");
        }

        const data =
            profileSchema.parse(values);

        await db
            .update(user)
            .set({
                name: data.name,
                phone: data.phone || null,
                image:
                    data.image || null,
            })
            .where(
                eq(
                    user.id,
                    session.user.id,
                ),
            );

        revalidatePath("/profile");
        revalidatePath("/dashboard");
        revalidatePath(
            "/dashboard/profile",
        );

        return {
            success: true,
            message:
                "Profile updated successfully.",
        };
    } catch (error) {
        console.error(
            "UPDATE_PROFILE_ERROR:",
            error,
        );

        throw new Error(
            "Failed to update profile."
        );
    }
}

export async function changePassword(
    values: ChangePasswordSchema,
) {
    const data =
        changePasswordSchema.parse(values);

    const session =
        await auth.api.getSession({
            headers: await headers(),
        });

    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    await auth.api.changePassword({
        body: {
            currentPassword:
                data.currentPassword,

            newPassword:
                data.newPassword,

            revokeOtherSessions: false,
        },

        headers: await headers(),
    });

    return {
        success: true,
        message:
            "Password updated successfully.",
    };
}