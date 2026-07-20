import { z } from "zod";

export const addressSchema = z.object({
    fullName: z.string().min(2),
    phone: z.string().min(10),
    address: z.string().min(5),
    apartment: z.string().optional(),
    city: z.string().min(2),
    state: z.string().min(2),
    postalCode: z.string().optional(),
    country: z.string().min(2),
    isDefault: z.boolean(),
});

export type AddressSchema = z.infer<typeof addressSchema>;