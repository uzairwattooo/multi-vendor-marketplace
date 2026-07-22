import { z } from "zod";

const storeNameSchema = z
    .string()
    .trim()
    .min(3, "Store name must be at least 3 characters")
    .max(80, "Store name must be less than 80 characters");

const categorySchema = z
    .string()
    .trim()
    .min(2, "Please select a store category")
    .max(80, "Store category is too long");

const descriptionSchema = z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters")
    .max(1000, "Description must be less than 1000 characters");

const emailSchema = z.email("Please enter a valid email address");

const phoneSchema = z
    .string()
    .trim()
    .min(10, "Please enter a valid phone number")
    .max(20, "Phone number is too long");

const optionalUrlSchema = z.union([
    z.literal(""),
    z.url("Please enter a valid URL"),
]);

const optionalShortText = (label: string, maxLength: number) =>
    z
        .string()
        .trim()
        .max(maxLength, `${label} must be less than ${maxLength} characters`);

const colorSchema = z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Please select a valid color");

export const createStoreSchema = z.object({
    name: storeNameSchema,
    category: categorySchema,
    description: descriptionSchema,
    email: emailSchema,
    phone: phoneSchema,
    address: z
        .string()
        .trim()
        .min(5, "Please enter a complete address")
        .max(250, "Address is too long"),
    city: z
        .string()
        .trim()
        .min(2, "Please enter your city")
        .max(80, "City name is too long"),
    country: z
        .string()
        .trim()
        .min(2, "Please select your country")
        .max(80, "Country name is too long"),
});

export const updateStoreSettingsSchema = createStoreSchema.extend({
    businessType: z.enum(["individual", "company"]),
    businessName: optionalShortText("Business name", 120),
    registrationNumber: optionalShortText("Registration number", 80),
    ntn: optionalShortText("NTN", 40),
    strn: optionalShortText("STRN", 40),

    state: optionalShortText("Province or state", 80),
    postalCode: optionalShortText("Postal code", 20),
    landmark: optionalShortText("Landmark", 120),
    mapsUrl: optionalUrlSchema,

    logo: optionalUrlSchema,
    banner: optionalUrlSchema,
    primaryColor: colorSchema,
    secondaryColor: colorSchema,
});

export type CreateStoreInput = z.infer<typeof createStoreSchema>;
export type StoreSettingsInput = z.infer<
    typeof updateStoreSettingsSchema
>;
