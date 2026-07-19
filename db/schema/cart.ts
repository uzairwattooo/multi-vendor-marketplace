import {
    pgTable,
    text,
    timestamp,
    uniqueIndex,
} from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";

import { user } from "@/auth-schema";
import { cartItem } from "./cart-item";

export const cart = pgTable(
    "cart",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => crypto.randomUUID()),

        userId: text("user_id")
            .notNull()
            .references(() => user.id, {
                onDelete: "cascade",
            }),

        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),

        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        uniqueIndex("cart_user_unique").on(
            table.userId,
        ),
    ],
);

export const cartRelations = relations(
    cart,
    ({ one, many }) => ({
        user: one(user, {
            fields: [cart.userId],
            references: [user.id],
        }),

        items: many(cartItem),
    }),
);