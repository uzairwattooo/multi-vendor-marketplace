import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";

export const shippingSchema = z.object({
    fullName: z.string().trim().min(3, "Full name is required."),
    email: z.email("Please enter a valid email address."),
    phone: z.string().min(1, "Phone number is required.")
        .refine((value) => isValidPhoneNumber(value),
            {message: "Please enter a valid phone number.",},),
    address: z.string().trim().min(5, "Address is required."),
    city: z.string().trim().min(2, "City is required."),
    state: z.string().trim().min(2, "State is required."),
    postalCode: z.string().trim().min(3, "Postal code is required."),
    country: z.string().trim().min(2, "Country is required."),
});

export type ShippingFormValues = z.infer<
    typeof shippingSchema
>;