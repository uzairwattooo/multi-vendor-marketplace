import { z } from "zod";

export const createStoreSchema = z.object({
    name: z
        .string()
        .min(3, "Store name must be at least 3 characters")
        .max(80, "Store name must be less than 80 characters"),

    category: z
        .string()
        .min(2, "Please select a store category"),

    description: z
        .string()
        .min(20, "Description must be at least 20 characters")
        .max(1000, "Description must be less than 1000 characters"),

    email: z
        .email("Please enter a valid email address"),

    phone: z
        .string()
        .min(10, "Please enter a valid phone number")
        .max(20, "Phone number is too long"),

    address: z
        .string()
        .min(5, "Please enter a complete address"),

    city: z
        .string()
        .min(2, "Please enter your city"),

    country: z
        .string()
        .min(2, "Please select your country"),
});

export type CreateStoreInput = z.infer<
    typeof createStoreSchema
>;