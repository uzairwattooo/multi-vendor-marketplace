import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";

import { db } from "@/db";
import * as schema from "@/db/schema";

const trustedOrigins = [
    "http://localhost:3000",
    process.env.NEXT_PUBLIC_APP_URL,
].filter((origin): origin is string => Boolean(origin));

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema,
    }),

    emailAndPassword: {
        enabled: true,
        minPasswordLength: 8,
    },

    user: {
        additionalFields: {
            phone: {
                type: "string",
                required: true,
            },

            role: {
                type: "string",
                required: true,
                defaultValue: "buyer",
            },
        },
    },

    rateLimit: {
        enabled: true,
        window: 60,
        max: 100,

        customRules: {
            "/sign-in/email": {
                window: 60,
                max: 5,
            },

            "/sign-up/email": {
                window: 60,
                max: 3,
            },
        },
    },
    baseURL: process.env.BETTER_AUTH_URL,
    trustedOrigins,
    plugins: [
        admin({
            defaultRole: "buyer",
            adminRoles: ["admin"],
        }),
    ],
});