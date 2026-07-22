import { relations } from "drizzle-orm";
import {
    boolean,
    index,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
} from "drizzle-orm/pg-core";

import { user } from "@/auth-schema";

export const storeStatusEnum = pgEnum("store_status", [
    "pending",
    "approved",
    "rejected",
    "suspended",
]);

export const store = pgTable(
    "store",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => crypto.randomUUID()),

        ownerId: text("owner_id")
            .notNull()
            .references(() => user.id, {
                onDelete: "cascade",
            }),

        name: text("name").notNull(),
        slug: text("slug").notNull(),
        description: text("description"),
        category: text("category").notNull(),

        email: text("email").notNull(),
        phone: text("phone").notNull(),

        businessType: text("business_type")
            .default("individual")
            .notNull(),
        businessName: text("business_name"),
        registrationNumber: text("registration_number"),
        ntn: text("ntn"),
        strn: text("strn"),

        logo: text("logo"),
        banner: text("banner"),
        primaryColor: text("primary_color")
            .default("#2563eb")
            .notNull(),
        secondaryColor: text("secondary_color")
            .default("#111827")
            .notNull(),

        address: text("address").notNull(),
        city: text("city").notNull(),
        state: text("state"),
        postalCode: text("postal_code"),
        landmark: text("landmark"),
        mapsUrl: text("maps_url"),
        country: text("country")
            .default("Pakistan")
            .notNull(),

        status: storeStatusEnum("status")
            .default("pending")
            .notNull(),
        rejectionReason: text("rejection_reason"),

        stripeAccountId: text("stripe_account_id"),
        isStripeConnected: boolean("is_stripe_connected")
            .default(false)
            .notNull(),
        stripeChargesEnabled: boolean("stripe_charges_enabled")
            .default(false)
            .notNull(),
        stripePayoutsEnabled: boolean("stripe_payouts_enabled")
            .default(false)
            .notNull(),
        stripeDetailsSubmitted: boolean("stripe_details_submitted")
            .default(false)
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
        uniqueIndex("store_owner_id_unique").on(table.ownerId),
        uniqueIndex("store_slug_unique").on(table.slug),
        index("store_status_idx").on(table.status),
    ],
);

export const storeRelations = relations(store, ({ one }) => ({
    owner: one(user, {
        fields: [store.ownerId],
        references: [user.id],
    }),
}));
