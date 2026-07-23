import { eq, ilike } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/db";
import { category } from "@/db/schema";
import { requireAdminApi } from "@/lib/admin/admin-api";
import { createSlug } from "@/lib/slug";

const categorySchema = z.object({
    name: z.string().trim().min(2).max(100),
    description: z.string().trim().max(1000).nullable(),
    image: z.string().trim().url().max(2000).nullable(),
    parentId: z.string().trim().min(1).nullable(),
});

export async function POST(request: Request) {
    try {
        const authorization = await requireAdminApi(request);

        if (authorization.response) {
            return authorization.response;
        }

        const result = categorySchema.safeParse(
            await request.json(),
        );

        if (!result.success) {
            return NextResponse.json(
                {
                    message: "Invalid category details",
                    errors: result.error.flatten().fieldErrors,
                },
                { status: 400 },
            );
        }

        const slug = createSlug(result.data.name);

        if (!slug) {
            return NextResponse.json(
                { message: "Category name cannot create a valid slug" },
                { status: 400 },
            );
        }

        const [duplicate] = await db
            .select({ id: category.id })
            .from(category)
            .where(ilike(category.slug, slug))
            .limit(1);

        if (duplicate) {
            return NextResponse.json(
                { message: "A category with this name already exists" },
                { status: 409 },
            );
        }

        if (result.data.parentId) {
            const [parent] = await db
                .select({ id: category.id })
                .from(category)
                .where(eq(category.id, result.data.parentId))
                .limit(1);

            if (!parent) {
                return NextResponse.json(
                    { message: "Parent category not found" },
                    { status: 404 },
                );
            }
        }

        const [createdCategory] = await db
            .insert(category)
            .values({
                name: result.data.name,
                slug,
                description: result.data.description || null,
                image: result.data.image || null,
                parentId: result.data.parentId,
            })
            .returning({
                id: category.id,
                name: category.name,
            });

        return NextResponse.json(
            {
                message: "Category created successfully",
                category: createdCategory,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("ADMIN_CREATE_CATEGORY_ERROR:", error);

        return NextResponse.json(
            {
                message:
                    error instanceof Error
                        ? error.message
                        : "Unable to create category",
            },
            { status: 500 },
        );
    }
}
