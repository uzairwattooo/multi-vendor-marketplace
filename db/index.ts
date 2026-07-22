import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

const connectionString =
    process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error(
        "DATABASE_URL is missing",
    );
}

const isTransactionPooler =
    connectionString.includes(":6543");

const globalForDatabase =
    globalThis as typeof globalThis & {
        postgresClient?: ReturnType<
            typeof postgres
        >;
    };

const client =
    globalForDatabase.postgresClient ??
    postgres(connectionString, {
        /*
         * Supabase transaction pooler 6543
         * prepared statements support nahi karta.
         */
        prepare: false,

        /*
         * 6543 par single connection rakho.
         * 5432 session pooler par 2 connections.
         */
        max: isTransactionPooler ? 1 : 2,

        connect_timeout: 30,
        idle_timeout: 20,

        /*
         * Purani/stale connection ko bohat der
         * reuse nahi karega.
         */
        max_lifetime: 60 * 5,

        onnotice: () => { },
    });

if (
    process.env.NODE_ENV !== "production"
) {
    globalForDatabase.postgresClient =
        client;
}

export const db = drizzle(client, {
    schema,
});