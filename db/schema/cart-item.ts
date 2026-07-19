import {
    integer,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
} from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";

import { cart } from "./cart";
import { product } from "./product";
import { store } from "./store";

export const cartItem = pgTable(
    "cart_item",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => crypto.randomUUID()),

        cartId: text("cart_id")
            .notNull()
            .references(() => cart.id, {
                onDelete: "cascade",
            }),

        productId: text("product_id")
            .notNull()
            .references(() => product.id, {
                onDelete: "cascade",
            }),

        storeId: text("store_id")
            .notNull()
            .references(() => store.id, {
                onDelete: "cascade",
            }),

        quantity: integer("quantity")
            .default(1)
            .notNull(),

        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),
    },
    (table) => [
        uniqueIndex("cart_product_unique").on(
            table.cartId,
            table.productId,
        ),
    ],
);

export const cartItemRelations = relations(
    cartItem,
    ({ one }) => ({
        cart: one(cart, {
            fields: [cartItem.cartId],
            references: [cart.id],
        }),

        product: one(product, {
            fields: [cartItem.productId],
            references: [product.id],
        }),

        store: one(store, {
            fields: [cartItem.storeId],
            references: [store.id],
        }),
    }),
);