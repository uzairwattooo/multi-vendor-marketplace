import {
    pgTable,
    text,
    timestamp,
    uniqueIndex,
} from "drizzle-orm/pg-core";
import { product } from "./product";
import { user } from "@/auth-schema";

export const wishlist = pgTable(
    "wishlist",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => crypto.randomUUID()),

        userId: text("user_id")
            .notNull()
            .references(() => user.id, {
                onDelete: "cascade",
            }),

        productId: text("product_id")
            .notNull()
            .references(() => product.id, {
                onDelete: "cascade",
            }),

        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),
    },
    (table) => [
        uniqueIndex("wishlist_user_product_unique").on(
            table.userId,
            table.productId,
        ),
    ],
);