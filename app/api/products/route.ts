import { and, count, desc, eq, ilike, or, sql, } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { product, productImage, store, } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { wishlist } from "@/db/schema";


export async function GET(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        const { searchParams } = new URL(request.url);

        const search = searchParams.get("search")?.trim() || "";
        const category = searchParams.get("category")?.trim() || "";
        const sort = searchParams.get("sort") || "newest";

        const page = Math.max(
            Number(searchParams.get("page")) || 1,
            1,
        );

        const limit = 12;
        const offset = (page - 1) * limit;

        const conditions = [
            eq(product.status, "active"),
            eq(store.status, "approved"),
        ];

        if (search) {
            conditions.push(
                or(
                    ilike(product.name, `%${search}%`),
                    ilike(product.description, `%${search}%`),
                    ilike(product.brand, `%${search}%`),
                    ilike(product.category, `%${search}%`),
                )!,
            );
        }

        if (category && category !== "all") {
            conditions.push(
                ilike(
                    product.category,
                    category.replaceAll("-", " "),
                ),
            );
        }

        const orderBy =
            sort === "price-low"
                ? sql`COALESCE(${product.salePrice}, ${product.price}) ASC`
                : sort === "price-high"
                    ? sql`COALESCE(${product.salePrice}, ${product.price}) DESC`
                    : desc(product.createdAt);

        const products = await db
            .select({
                id: product.id,
                name: product.name,
                slug: product.slug,
                description: product.description,
                category: product.category,
                brand: product.brand,
                price: product.price,
                salePrice: product.salePrice,
                stock: product.stock,
                storeId: store.id,
                storeName: store.name,
                storeSlug: store.slug,
                isWishlisted: session?.user
                    ? sql<boolean>`
                    EXISTS (
                        SELECT 1
                        FROM ${wishlist}
                        WHERE ${wishlist.productId} = ${product.id}
                        AND ${wishlist.userId} = ${session.user.id}
                    )
                `
                    : sql<boolean>`false`,
                image: sql<string | null>`
                    (
                        SELECT ${productImage.url}
                        FROM ${productImage}
                        WHERE ${productImage.productId} = ${product.id}
                        ORDER BY ${productImage.createdAt} ASC
                        LIMIT 1
                    )
                `,
            })
            .from(product)
            .innerJoin(store, eq(product.storeId, store.id))
            .where(and(...conditions))
            .orderBy(orderBy)
            .limit(limit)
            .offset(offset);

        const [totalResult] = await db
            .select({
                total: count(product.id),
            })
            .from(product)
            .innerJoin(store, eq(product.storeId, store.id))
            .where(and(...conditions));

        const total = Number(totalResult?.total ?? 0);

        return NextResponse.json({
            products,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("GET_PUBLIC_PRODUCTS_ERROR:", error);

        return NextResponse.json(
            {
                message: "Unable to fetch products",
            },
            {
                status: 500,
            },
        );
    }
}