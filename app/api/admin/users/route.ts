import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { requireAdminApi } from "@/lib/admin/admin-api";

const createUserSchema = z.object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(160),
    phone: z.string().trim().min(7).max(30),
    password: z.string().min(8).max(128),
    role: z.enum(["buyer", "admin"]),
});

export async function POST(request: Request) {
    try {
        const authorization = await requireAdminApi(request);

        if (authorization.response) {
            return authorization.response;
        }

        const result = createUserSchema.safeParse(
            await request.json(),
        );

        if (!result.success) {
            return NextResponse.json(
                {
                    message: "Invalid user details",
                    errors: result.error.flatten().fieldErrors,
                },
                { status: 400 },
            );
        }

        const createdUser = await auth.api.createUser({
            body: {
                name: result.data.name,
                email: result.data.email,
                password: result.data.password,
                role: result.data.role,
                data: {
                    phone: result.data.phone,
                },
            },
            headers: request.headers,
        });

        return NextResponse.json(
            {
                message: "User created successfully",
                user: createdUser,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("ADMIN_CREATE_USER_ERROR:", error);

        const message =
            error instanceof Error
                ? error.message
                : "Unable to create user";

        return NextResponse.json(
            { message },
            { status: 500 },
        );
    }
}
