import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/db";
import { platformSettings } from "@/db/schema";
import { requireAdminApi } from "@/lib/admin/admin-api";

const settingsSchema = z
    .object({
        marketplaceName: z.string().trim().min(2).max(80),
        supportEmail: z.union([z.string().trim().email(), z.literal("")]),
        supportPhone: z.string().trim().max(30),
        currency: z.enum(["PKR", "USD"]),
        commissionRate: z.number().min(0).max(50),
        minimumOrderAmount: z.number().min(0).max(100000000),
        stripeEnabled: z.boolean(),
        codEnabled: z.boolean(),
    })
    .refine((value) => value.stripeEnabled || value.codEnabled, {
        message: "At least one payment method must remain enabled",
        path: ["stripeEnabled"],
    });

export async function PATCH(request: Request) {
    try {
        const authorization = await requireAdminApi(request);

        if (authorization.response) {
            return authorization.response;
        }

        const result = settingsSchema.safeParse(await request.json());

        if (!result.success) {
            return NextResponse.json(
                {
                    message: "Please correct the invalid settings",
                    errors: result.error.flatten().fieldErrors,
                },
                { status: 400 },
            );
        }

        await db
            .insert(platformSettings)
            .values({
                id: "default",
                ...result.data,
                commissionRate: result.data.commissionRate.toFixed(2),
                minimumOrderAmount:
                    result.data.minimumOrderAmount.toFixed(2),
                updatedAt: new Date(),
            })
            .onConflictDoUpdate({
                target: platformSettings.id,
                set: {
                    ...result.data,
                    commissionRate: result.data.commissionRate.toFixed(2),
                    minimumOrderAmount:
                        result.data.minimumOrderAmount.toFixed(2),
                    updatedAt: new Date(),
                },
            });

        return NextResponse.json({
            message: "Platform settings saved successfully",
        });
    } catch (error) {
        console.error("ADMIN_SETTINGS_UPDATE_ERROR:", error);

        return NextResponse.json(
            { message: "Unable to save platform settings" },
            { status: 500 },
        );
    }
}