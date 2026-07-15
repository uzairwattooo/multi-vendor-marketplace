import {
    index,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
} from "drizzle-orm/pg-core";

export const category = pgTable(
    "category",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => crypto.randomUUID()),
        name: text("name").notNull(),
        slug: text("slug").notNull(),
        description: text("description"),
        image: text("image"),
        parentId: text("parent_id"),
        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        uniqueIndex("category_slug_unique").on(table.slug),
        index("category_parent_id_idx").on(table.parentId),
    ],
);