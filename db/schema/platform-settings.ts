import {
    boolean,
    numeric,
    pgTable,
    text,
    timestamp,
} from "drizzle-orm/pg-core";

export const platformSettings = pgTable("platform_settings", {
    id: text("id").primaryKey().default("default"),
    marketplaceName: text("marketplace_name")
        .default("Marketplace")
        .notNull(),
    supportEmail: text("support_email").default("").notNull(),
    supportPhone: text("support_phone").default("").notNull(),
    currency: text("currency").default("PKR").notNull(),
    commissionRate: numeric("commission_rate", {
        precision: 5,
        scale: 2,
    })
        .default("10.00")
        .notNull(),
    minimumOrderAmount: numeric("minimum_order_amount", {
        precision: 12,
        scale: 2,
    })
        .default("0")
        .notNull(),
    stripeEnabled: boolean("stripe_enabled").default(true).notNull(),
    codEnabled: boolean("cod_enabled").default(true).notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});