import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error(
        "DATABASE_URL is missing",
    );
}

const globalForDatabase = globalThis as typeof globalThis & {
    postgresClient?: ReturnType<typeof postgres>;
};

const client =
    globalForDatabase.postgresClient ??
    postgres(connectionString, {
        prepare: false,
        max: Number(
            process.env.DB_POOL_MAX ?? 5,
        ),

        idle_timeout: 30,
        connect_timeout: 30,
        max_lifetime: 60 * 30,
    });

globalForDatabase.postgresClient = client;

export const db = drizzle(client, {
    schema,
});