import { z } from "zod";

export const createOrderSchema = z.object({
    shippingAddress: z.object({
        fullName: z
            .string()
            .trim()
            .min(2, "Full name is required"),

        phone: z
            .string()
            .trim()
            .regex(
                /^(\+92|0)?3\d{9}$/,
                "Enter a valid Pakistani phone number",
            ),

        address: z
            .string()
            .trim()
            .min(10, "Complete address is required"),

        city: z
            .string()
            .trim()
            .min(2, "City is required"),

        state: z
            .string()
            .trim()
            .min(2, "Province is required"),

        postalCode: z
            .string()
            .trim()
            .nullable()
            .optional(),

        country: z
            .string()
            .trim()
            .default("Pakistan"),
    }),

    customerNote: z
        .string()
        .trim()
        .max(500)
        .nullable()
        .optional(),

    paymentMethod: z.enum(["cod"]),

    items: z
        .array(
            z.object({
                productId: z.string().uuid(),
                quantity: z
                    .number()
                    .int()
                    .min(1),
            }),
        )
        .min(1, "Cart is empty"),
});

export type CreateOrderInput = z.infer<
    typeof createOrderSchema
>;