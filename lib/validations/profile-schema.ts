import { z } from "zod";

export const profileSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters.")
        .max(100),

    phone: z
        .string()
        .trim()
        .optional()
        .or(z.literal("")),

    image: z
        .string()
        .nullable()
        .optional(),
});

export type ProfileSchema = z.infer<
    typeof profileSchema
>;