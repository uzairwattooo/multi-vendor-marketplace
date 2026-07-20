import {
    pgTable,
    text,
    timestamp,
    jsonb,
} from "drizzle-orm/pg-core";

import { user } from "@/auth-schema";

export const checkoutSession =
    pgTable("checkout_session", {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => crypto.randomUUID()),

        userId: text("user_id")
            .notNull()
            .references(() => user.id, {
                onDelete: "cascade",
            }),

        paymentIntentId: text(
            "payment_intent_id",
        ).notNull(),

        shipping: jsonb("shipping")
            .notNull(),

        createdAt: timestamp(
            "created_at",
        )
            .defaultNow()
            .notNull(),
    });