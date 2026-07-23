import { asc, count, sql } from "drizzle-orm";

import { db } from "@/db";
import { category, product } from "@/db/schema";

const productCountExpression = sql<number>`(
    SELECT COUNT(*)
    FROM ${product}
    WHERE LOWER(${product.category}) = LOWER(${category.name})
)`;

const childCountExpression = sql<number>`(
    SELECT COUNT(*)
    FROM ${category} AS child_category
    WHERE child_category.parent_id = ${category.id}
)`;

export async function getAdminCategories() {
    const [rows, statsRows] = await Promise.all([
        db
            .select({
                id: category.id,
                name: category.name,
                slug: category.slug,
                description: category.description,
                image: category.image,
                parentId: category.parentId,
                createdAt: category.createdAt,
                updatedAt: category.updatedAt,
                productCount: productCountExpression,
                childCount: childCountExpression,
            })
            .from(category)
            .orderBy(asc(category.name)),

        db
            .select({
                total: count(),
                root: sql<number>`COUNT(*) FILTER (WHERE ${category.parentId} IS NULL)`,
                child: sql<number>`COUNT(*) FILTER (WHERE ${category.parentId} IS NOT NULL)`,
            })
            .from(category),
    ]);

    const parentNames = new Map(
        rows.map((currentCategory) => [
            currentCategory.id,
            currentCategory.name,
        ]),
    );

    const categories = rows.map((currentCategory) => ({
        ...currentCategory,
        parentName: currentCategory.parentId
            ? parentNames.get(currentCategory.parentId) ?? "Unknown parent"
            : null,
        productCount: Number(currentCategory.productCount ?? 0),
        childCount: Number(currentCategory.childCount ?? 0),
    }));

    const stats = statsRows[0];

    return {
        categories,
        stats: {
            total: Number(stats?.total ?? 0),
            root: Number(stats?.root ?? 0),
            child: Number(stats?.child ?? 0),
            used: categories.filter(
                (currentCategory) => currentCategory.productCount > 0,
            ).length,
            empty: categories.filter(
                (currentCategory) => currentCategory.productCount === 0,
            ).length,
        },
    };
}

export type AdminCategoryItem = Awaited<
    ReturnType<typeof getAdminCategories>
>["categories"][number];
