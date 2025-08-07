// drizzle.config.ts
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/server/db/schema.ts",
  dialect: "singlestore",
  out: "./drizzle/migrations",
  dbCredentials: {
    host:     process.env.SINGLESTORE_HOST!,
    port:     Number(process.env.SINGLESTORE_PORT!),
    user:     process.env.SINGLESTORE_USER!,
    password: process.env.SINGLESTORE_PASS!,
    database: process.env.SINGLESTORE_DB_NAME!,

    // ← this enables TLS but skips loading any CA bundle
    ssl: {
      rejectUnauthorized: false,
    },
  },
  tablesFilter: ["drive_tutorial_*"],
});
