import { and, eq, ilike, ne, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/db";
import { category, product } from "@/db/schema";
import { requireAdminApi } from "@/lib/admin/admin-api";
import { createSlug } from "@/lib/slug";

const categorySchema = z.object({
    name: z.string().trim().min(2).max(100),
    description: z.string().trim().max(1000).nullable(),
    image: z.string().trim().url().max(2000).nullable(),
    parentId: z.string().trim().min(1).nullable(),
});

type RouteContext = {
    params: Promise<{
        categoryId: string;
    }>;
};

async function createsCircularHierarchy(
    categoryId: string,
    parentId: string,
) {
    const rows = await db
        .select({
            id: category.id,
            parentId: category.parentId,
        })
        .from(category);

    const parentMap = new Map<string, string | null>(
        rows.map((row) => [row.id, row.parentId]),
    );

    let currentId: string | null = parentId;
    const visited = new Set<string>();

    while (currentId) {
        if (currentId === categoryId) {
            return true;
        }

        if (visited.has(currentId)) {
            return true;
        }

        visited.add(currentId);
        currentId = parentMap.get(currentId);
    }

    return false;
}

export async function PATCH(
    request: Request,
    context: RouteContext,
) {
    try {
        const authorization = await requireAdminApi(request);

        if (authorization.response) {
            return authorization.response;
        }

        const { categoryId } = await context.params;
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

        const [existingCategory] = await db
            .select({
                id: category.id,
                name: category.name,
            })
            .from(category)
            .where(eq(category.id, categoryId))
            .limit(1);

        if (!existingCategory) {
            return NextResponse.json(
                { message: "Category not found" },
                { status: 404 },
            );
        }

        if (result.data.parentId === categoryId) {
            return NextResponse.json(
                { message: "A category cannot be its own parent" },
                { status: 409 },
            );
        }

        if (
            result.data.parentId &&
            (await createsCircularHierarchy(
                categoryId,
                result.data.parentId,
            ))
        ) {
            return NextResponse.json(
                {
                    message:
                        "This parent selection would create a circular category hierarchy",
                },
                { status: 409 },
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
            .where(
                and(
                    ilike(category.slug, slug),
                    ne(category.id, categoryId),
                ),
            )
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

        await db.transaction(async (tx) => {
            await tx
                .update(category)
                .set({
                    name: result.data.name,
                    slug,
                    description: result.data.description || null,
                    image: result.data.image || null,
                    parentId: result.data.parentId,
                    updatedAt: new Date(),
                })
                .where(eq(category.id, categoryId));

            if (existingCategory.name !== result.data.name) {
                await tx
                    .update(product)
                    .set({
                        category: result.data.name,
                        updatedAt: new Date(),
                    })
                    .where(
                        sql`LOWER(${product.category}) = LOWER(${existingCategory.name})`,
                    );
            }
        });

        return NextResponse.json({
            message: "Category updated successfully",
        });
    } catch (error) {
        console.error("ADMIN_UPDATE_CATEGORY_ERROR:", error);

        return NextResponse.json(
            {
                message:
                    error instanceof Error
                        ? error.message
                        : "Unable to update category",
            },
            { status: 500 },
        );
    }
}

export async function DELETE(
    request: Request,
    context: RouteContext,
) {
    try {
        const authorization = await requireAdminApi(request);

        if (authorization.response) {
            return authorization.response;
        }

        const { categoryId } = await context.params;

        const [existingCategory] = await db
            .select({
                id: category.id,
                name: category.name,
            })
            .from(category)
            .where(eq(category.id, categoryId))
            .limit(1);

        if (!existingCategory) {
            return NextResponse.json(
                { message: "Category not found" },
                { status: 404 },
            );
        }

        const [usage] = await db
            .select({
                products: sql<number>`(
                    SELECT COUNT(*)
                    FROM ${product}
                    WHERE LOWER(${product.category}) = LOWER(${existingCategory.name})
                )`,
                children: sql<number>`(
                    SELECT COUNT(*)
                    FROM ${category} AS child_category
                    WHERE child_category.parent_id = ${categoryId}
                )`,
            })
            .from(category)
            .where(eq(category.id, categoryId));

        if (Number(usage?.products ?? 0) > 0) {
            return NextResponse.json(
                {
                    message:
                        "Move products to another category before deleting this category",
                },
                { status: 409 },
            );
        }

        if (Number(usage?.children ?? 0) > 0) {
            return NextResponse.json(
                {
                    message:
                        "Move or delete child categories before deleting this category",
                },
                { status: 409 },
            );
        }

        await db
            .delete(category)
            .where(eq(category.id, categoryId));

        return NextResponse.json({
            message: "Category deleted successfully",
        });
    } catch (error) {
        console.error("ADMIN_DELETE_CATEGORY_ERROR:", error);

        return NextResponse.json(
            {
                message:
                    error instanceof Error
                        ? error.message
                        : "Unable to delete category",
            },
            { status: 500 },
        );
    }
}
