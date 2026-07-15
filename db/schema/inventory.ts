import { relations } from "drizzle-orm";
import {
    boolean,
    index,
    integer,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
} from "drizzle-orm/pg-core";

import { product } from "./product";

export const inventory = pgTable(
    "inventory",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => crypto.randomUUID()),

        productId: text("product_id")
            .notNull()
            .references(() => product.id, {
                onDelete: "cascade",
            }),

        quantity: integer("quantity")
            .default(0)
            .notNull(),

        reservedQuantity: integer("reserved_quantity")
            .default(0)
            .notNull(),

        lowStockThreshold: integer("low_stock_threshold")
            .default(5)
            .notNull(),

        trackQuantity: boolean("track_quantity")
            .default(true)
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
        uniqueIndex("inventory_product_id_unique").on(
            table.productId,
        ),

        index("inventory_quantity_idx").on(table.quantity),
    ],
);

export const inventoryRelations = relations(
    inventory,
    ({ one }) => ({
        product: one(product, {
            fields: [inventory.productId],
            references: [product.id],
        }),
    }),
);