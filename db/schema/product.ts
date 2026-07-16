import { relations } from "drizzle-orm";
import {
    index,
    integer,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    boolean,
} from "drizzle-orm/pg-core";

import { store } from "./store";

export const productStatusEnum = pgEnum("product_status", [
    "draft",
    "active",
    "out_of_stock",
    "archived",
]);

export const product = pgTable(
    "product",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => crypto.randomUUID()),
        storeId: text("store_id")
            .notNull()
            .references(() => store.id, {
                onDelete: "cascade",
            }),
        name: text("name").notNull(),
        featured: boolean("featured")
    .default(false)
    .notNull(),
        slug: text("slug").notNull(),
        description: text("description").notNull(),
        category: text("category").notNull(),
        brand: text("brand"),
        sku: text("sku").notNull(),
        price: integer("price").notNull(),
        salePrice: integer("sale_price"),
        stock: integer("stock")
            .default(0)
            .notNull(),
        lowStockThreshold: integer("low_stock_threshold")
            .default(5)
            .notNull(),
        status: productStatusEnum("status")
            .default("draft")
            .notNull(),
        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        uniqueIndex("product_store_slug_unique").on(
            table.storeId,
            table.slug,
        ),

        uniqueIndex("product_store_sku_unique").on(
            table.storeId,
            table.sku,
        ),
        index("product_store_id_idx").on(table.storeId),
        index("product_status_idx").on(table.status),
        index("product_category_idx").on(table.category),
    ],
);

export const productRelations = relations(
    product,
    ({ one, many }) => ({
        store: one(store, {
            fields: [product.storeId],
            references: [store.id],
        }),
        images: many(productImage),
    }),
);

export const productImage = pgTable(
    "product_image",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => crypto.randomUUID()),
        productId: text("product_id")
            .notNull()
            .references(() => product.id, {
                onDelete: "cascade",
            }),
        url: text("url").notNull(),
        altText: text("alt_text"),
        position: integer("position")
            .default(0)
            .notNull(),
        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),
    },
    (table) => [
        index("product_image_product_id_idx").on(
            table.productId,
        ),
    ],
);

export const productImageRelations = relations(
    productImage,
    ({ one }) => ({
        product: one(product, {
            fields: [productImage.productId],
            references: [product.id],
        }),
    }),
);