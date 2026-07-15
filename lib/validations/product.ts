import { z } from "zod";

export const createProductSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Product name must be at least 3 characters")
        .max(150, "Product name must be less than 150 characters"),

    categoryId: z
        .string()
        .min(1, "Please select a category"),

    description: z
        .string()
        .trim()
        .min(20, "Description must be at least 20 characters")
        .max(5000, "Description must be less than 5000 characters"),

    price: z.coerce
        .number()
        .positive("Price must be greater than zero"),

    comparePrice: z.coerce
        .number()
        .positive("Compare price must be greater than zero")
        .optional()
        .or(z.literal("")),

    sku: z
        .string()
        .trim()
        .min(2, "SKU must be at least 2 characters")
        .max(80, "SKU must be less than 80 characters"),

    quantity: z.coerce
        .number()
        .int("Quantity must be a whole number")
        .min(0, "Quantity cannot be negative"),

    lowStockThreshold: z.coerce
        .number()
        .int("Low stock threshold must be a whole number")
        .min(0, "Low stock threshold cannot be negative")
        .default(5),

    status: z
        .enum(["draft", "active"])
        .default("draft"),

    featured: z.boolean().default(false),

    images: z
        .array(
            z.object({
                url: z.url(
                    "Please enter a valid image URL",
                ),
                path: z.string().min(1),
                isPrimary: z.boolean().default(false),
                sortOrder: z
                    .number()
                    .int()
                    .min(0)
                    .default(0),
            }),
        )
        .max(
            8,
            "You can upload a maximum of 8 images",
        )
        .default([]), images: z
            .array(
                z.object({
                    url: z.url("Please enter a valid image URL"),
                    isPrimary: z.boolean().default(false),
                    sortOrder: z.number().int().min(0).default(0),
                }),
            )
            .max(8, "You can upload a maximum of 8 images")
            .default([]),
});

export type CreateProductInput = z.infer<
    typeof createProductSchema
>; ``