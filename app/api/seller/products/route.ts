import { and, eq, desc } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { category, inventory, product, productImage, store } from "@/db/schema";
import { createSlug } from "@/lib/slug";
import { createProductSchema } from "@/lib/validations/product";

export async function POST(request: Request) {
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

    if (session.user.role !== "seller") {
      return NextResponse.json(
        {
          message: "Seller access required",
        },
        {
          status: 403,
        },
      );
    }

    const [sellerStore] = await db
      .select({
        id: store.id,
        status: store.status,
      })
      .from(store)
      .where(
        and(eq(store.ownerId, session.user.id), eq(store.status, "approved")),
      )
      .limit(1);

    if (!sellerStore) {
      return NextResponse.json(
        {
          message: "An approved store is required",
        },
        {
          status: 403,
        },
      );
    }

    const body = await request.json();

    const result = createProductSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          message: "Please check the submitted information",
          errors: result.error.flatten().fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    const [existingCategory] = await db
      .select({
        id: category.id,
        name: category.name,
      })
      .from(category)
      .where(eq(category.id, result.data.categoryId))
      .limit(1);

    if (!existingCategory) {
      return NextResponse.json(
        {
          message: "Selected category does not exist",
        },
        {
          status: 404,
        },
      );
    }

    const [existingSku] = await db
      .select({
        id: product.id,
      })
      .from(product)
      .where(
        and(
          eq(product.storeId, sellerStore.id),
          eq(product.sku, result.data.sku),
        ),
      )
      .limit(1);

    if (existingSku) {
      return NextResponse.json(
        {
          message: "A product with this SKU already exists",
        },
        {
          status: 409,
        },
      );
    }

    const baseSlug = createSlug(result.data.name);

    const [sameSlugProduct] = await db
      .select({
        id: product.id,
      })
      .from(product)
      .where(
        and(eq(product.storeId, sellerStore.id), eq(product.slug, baseSlug)),
      )
      .limit(1);

    const slug = sameSlugProduct
      ? `${baseSlug}-${crypto.randomUUID().slice(0, 6)}`
      : baseSlug;

    const createdProduct = await db.transaction(async (tx) => {
      const [newProduct] = await tx
        .insert(product)
        .values({
          storeId: sellerStore.id,
          name: result.data.name,
          slug,
          description: result.data.description,

          category: existingCategory.name,

          sku: result.data.sku,
          price: String(result.data.price),
          status: result.data.status,

          stock: result.data.quantity,
          lowStockThreshold: result.data.lowStockThreshold,
        })
        .returning({
          id: product.id,
          name: product.name,
          slug: product.slug,
          status: product.status,
        });
      if (result.data.images.length > 0) {
        const hasPrimaryImage = result.data.images.some(
          (image) => image.isPrimary,
        );

        await tx.insert(productImage).values(
          result.data.images.map((image, index) => ({
            productId: newProduct.id,
            url: image.url,
            isPrimary: hasPrimaryImage ? image.isPrimary : index === 0,
            sortOrder: image.sortOrder ?? index,
          })),
        );
      }

      return newProduct;
    });
    return NextResponse.json(
      {
        message: "Product created successfully",
        product: createdProduct,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("CREATE_PRODUCT_ERROR:", error);
    return NextResponse.json(
      {
        message: "Unable to create product",
      },
      {
        status: 500,
      },
    );
  }
}

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 },
      );
    }

    const [sellerStore] = await db
      .select({
        id: store.id,
      })
      .from(store)
      .where(
        and(
          eq(store.ownerId, session.user.id),
          eq(store.status, "approved"),
        ),
      )
      .limit(1);

    if (!sellerStore) {
      return NextResponse.json(
        { message: "Approved store not found" },
        { status: 404 },
      );
    }

    const sellerProducts = await db
      .select()
      .from(product)
      .where(eq(product.storeId, sellerStore.id))
      .orderBy(desc(product.createdAt));

    return NextResponse.json(sellerProducts);
  } catch (error) {
    console.error("GET_PRODUCTS_ERROR:", error);

    return NextResponse.json(
      {
        message: "Unable to fetch products",
        error:
          error instanceof Error
            ? error.message
            : "Unknown server error",
      },
      { status: 500 },
    );
  }
}