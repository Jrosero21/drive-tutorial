// drizzle.config.ts
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  // 1) Where your Drizzle schema lives:
  schema: "./src/server/db/schema.ts",

  // 2) Use the SingleStore dialect:
  dialect: "singlestore",


  // 4) (Optional) only apply tables matching your prefix
  tablesFilter: ["drive_tutorial_*"],
});
