import { relations } from "drizzle-orm";
import { index, pgEnum, pgTable, text, timestamp, uniqueIndex,} from "drizzle-orm/pg-core";
import { user } from "@/auth-schema";
export const storeStatusEnum = pgEnum("store_status", ["pending","approved","rejected","suspended",]);

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
        logo: text("logo"),
        banner: text("banner"),
        address: text("address").notNull(),
        city: text("city").notNull(),
        country: text("country")
            .default("Pakistan")
            .notNull(),
        status: storeStatusEnum("status")
            .default("pending")
            .notNull(),
        rejectionReason: text("rejection_reason"),
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