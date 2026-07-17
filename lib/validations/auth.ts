import { z } from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";
export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),

    password: z
        .string()
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters"),
});

export const signupSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(2, "Name must be at least 2 characters")
            .max(50, "Name cannot exceed 50 characters"),

        email: z
            .string()
            .trim()
            .min(1, "Email is required")
            .email("Please enter a valid email address"),


        phone: z
            .string()
            .trim()
            .min(1, "Phone number is required")
            .refine(
                (value) => isValidPhoneNumber(value),
                {
                    message: "Please enter a valid phone number",
                }
            ),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(
                /[A-Z]/,
                "Password must contain one uppercase letter",
            )
            .regex(
                /[a-z]/,
                "Password must contain one lowercase letter",
            )
            .regex(/[0-9]/, "Password must contain one number"),

        confirmPassword: z
            .string()
            .min(1, "Please confirm your password"),

        role: z.enum(["buyer", "seller"], {
            message: "Please select an account type",
        }),
    })
    .refine(
        (values) => values.password === values.confirmPassword,
        {
            message: "Passwords do not match",
            path: ["confirmPassword"],
        },
    );

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;