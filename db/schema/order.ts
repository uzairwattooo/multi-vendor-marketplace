import { relations } from "drizzle-orm";
import {
    index,
    integer,
    numeric,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
} from "drizzle-orm/pg-core";

import { user } from "@/auth-schema";
import { product } from "./product";
import { store } from "./store";

export const orderStatusEnum = pgEnum("order_status", [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
]);
export const paymentMethodEnum = pgEnum(
    "payment_method",
    ["stripe", "cod"],
);
export const paymentStatusEnum = pgEnum("payment_status", [
    "pending",
    "paid",
    "failed",
    "refunded",
]);

export const order = pgTable(
    "order",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => crypto.randomUUID()),

        orderNumber: text("order_number").notNull(),

        buyerId: text("buyer_id")
            .notNull()
            .references(() => user.id, {
                onDelete: "restrict",
            }),

        storeId: text("store_id")
            .notNull()
            .references(() => store.id, {
                onDelete: "restrict",
            }),

        status: orderStatusEnum("status")
            .default("pending")
            .notNull(),

        paymentStatus: paymentStatusEnum("payment_status")
            .default("pending")
            .notNull(),
        paymentMethod: paymentMethodEnum(
            "payment_method",
        )
            .default("stripe")
            .notNull(),

        stripePaymentIntentId: text(
            "stripe_payment_intent_id",
        ),

        currency: text("currency")
            .default("usd")
            .notNull(),
        subtotal: numeric("subtotal", {
            precision: 12,
            scale: 2,
        }).notNull(),

        shippingAmount: numeric("shipping_amount", {
            precision: 12,
            scale: 2,
        })
            .default("0")
            .notNull(),

        taxAmount: numeric("tax_amount", {
            precision: 12,
            scale: 2,
        })
            .default("0")
            .notNull(),

        discountAmount: numeric("discount_amount", {
            precision: 12,
            scale: 2,
        })
            .default("0")
            .notNull(),
        platformFee: integer("platform_fee")
            .default(0)
            .notNull(),
        sellerAmount: integer("seller_amount")
            .default(0)
            .notNull(),
        totalAmount: numeric("total_amount", {
            precision: 12,
            scale: 2,
        }).notNull(),

        customerNote: text("customer_note"),

        cancelledReason: text("cancelled_reason"),

        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),

        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        uniqueIndex("order_number_unique").on(
            table.orderNumber,
        ),

        index("order_buyer_id_idx").on(
            table.buyerId,
        ),

        index("order_store_id_idx").on(
            table.storeId,
        ),

        index("order_status_idx").on(
            table.status,
        ),

        index("order_payment_status_idx").on(
            table.paymentStatus,
        ),

        index("order_created_at_idx").on(
            table.createdAt,
        ),
    ],
);

export const orderItem = pgTable(
    "order_item",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => crypto.randomUUID()),

        orderId: text("order_id")
            .notNull()
            .references(() => order.id, {
                onDelete: "cascade",
            }),

        productId: text("product_id")
            .notNull()
            .references(() => product.id, {
                onDelete: "restrict",
            }),
        storeId: text("store_id")
            .notNull()
            .references(() => store.id, {
                onDelete: "restrict",
            }),
        productName: text("product_name")
            .notNull(),

        sku: text("sku").notNull(),

        unitPrice: numeric("unit_price", {
            precision: 12,
            scale: 2,
        }).notNull(),

        quantity: integer("quantity")
            .notNull(),

        totalPrice: numeric("total_price", {
            precision: 12,
            scale: 2,
        }).notNull(),

        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),
    },
    (table) => [
        index("order_item_order_id_idx").on(
            table.orderId,
        ),

        index("order_item_product_id_idx").on(
            table.productId,
        ),
    ],
);

export const shippingAddress = pgTable(
    "shipping_address",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => crypto.randomUUID()),

        orderId: text("order_id")
            .notNull()
            .references(() => order.id, {
                onDelete: "cascade",
            }),

        fullName: text("full_name")
            .notNull(),

        email: text("email")
            .notNull(),

        phone: text("phone")
            .notNull(),

        address: text("address")
            .notNull(),

        apartment: text("apartment"),

        city: text("city")
            .notNull(),

        state: text("state")
            .notNull(),

        postalCode: text("postal_code"),

        country: text("country")
            .default("Pakistan")
            .notNull(),

        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),
    },
    (table) => [
        uniqueIndex(
            "shipping_address_order_id_unique",
        ).on(table.orderId),
    ],
);

export const payment = pgTable(
    "payment",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => crypto.randomUUID()),

        orderId: text("order_id")
            .notNull()
            .references(() => order.id, {
                onDelete: "cascade",
            }),

        provider: text("provider")
            .notNull(),

        transactionId: text("transaction_id"),

        amount: numeric("amount", {
            precision: 12,
            scale: 2,
        }).notNull(),

        platformFee: numeric("platform_fee", {
            precision: 12,
            scale: 2,
        })
            .default("0")
            .notNull(),

        sellerAmount: numeric("seller_amount", {
            precision: 12,
            scale: 2,
        }).notNull(),

        status: paymentStatusEnum("status")
            .default("pending")
            .notNull(),

        paidAt: timestamp("paid_at"),

        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),

        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        uniqueIndex("payment_order_id_unique").on(
            table.orderId,
        ),

        index("payment_status_idx").on(
            table.status,
        ),
    ],
);

export const orderRelations = relations(
    order,
    ({ one, many }) => ({
        buyer: one(user, {
            fields: [order.buyerId],
            references: [user.id],
        }),

        store: one(store, {
            fields: [order.storeId],
            references: [store.id],
        }),

        items: many(orderItem),

        shippingAddress: one(shippingAddress),

        payment: one(payment),
    }),
);

export const orderItemRelations = relations(
    orderItem,
    ({ one }) => ({
        order: one(order, {
            fields: [orderItem.orderId],
            references: [order.id],
        }),

        product: one(product, {
            fields: [orderItem.productId],
            references: [product.id],
        }),
    }),
);

export const shippingAddressRelations = relations(
    shippingAddress,
    ({ one }) => ({
        order: one(order, {
            fields: [shippingAddress.orderId],
            references: [order.id],
        }),
    }),
);

export const paymentRelations = relations(
    payment,
    ({ one }) => ({
        order: one(order, {
            fields: [payment.orderId],
            references: [order.id],
        }),
    }),
);