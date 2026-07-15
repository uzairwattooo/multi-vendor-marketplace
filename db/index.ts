import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL is missing");
}

const globalForDatabase = globalThis as unknown as {
    postgresClient?: ReturnType<typeof postgres>;
};

const client =
    globalForDatabase.postgresClient ??
    postgres(connectionString, {
        prepare: false,
        max: 1,
        idle_timeout: 10,
        connect_timeout: 10,
    });

if (process.env.NODE_ENV !== "production") {
    globalForDatabase.postgresClient = client;
}

export const db = drizzle(client);