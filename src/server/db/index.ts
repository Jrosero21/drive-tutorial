import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { createPool, type Pool } from "mysql2/promise";

import { env } from "~/env";
import * as schema from "./schema";

// 1) Tell TypeScript that our global cache can hold both a Pool and a Client
const globalForDb = globalThis as unknown as {
  conn?: Pool;
  client?: Client;
};

export const conn: Pool =
  globalForDb.conn ??
  createPool({
    host:     env.SINGLESTORE_HOST,
    port:     Number(env.SINGLESTORE_PORT),
    user:     env.SINGLESTORE_USER,
    password: env.SINGLESTORE_PASS,
    database: env.SINGLESTORE_DB_NAME,
    ssl:      {},
    maxIdle:  0,
  });


if (env.NODE_ENV !== "production") {
  globalForDb.conn = conn;
}

;(conn as any).addListener("error", (err: any) => {
  console.error("Database connection error:", err);
});

export const client: Client =
  globalForDb.client ??
  createClient({ url: env.DATABASE_URL });

if (env.NODE_ENV !== "production") {
  globalForDb.client = client;
}

export const db = drizzle(client, { schema });
