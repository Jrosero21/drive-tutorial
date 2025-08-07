// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { singlestoreTable, int, text } from "drizzle-orm/singlestore-core";

export const users = singlestoreTable("users_table", {
  id:   int("id").primaryKey().autoincrement(),
  name: text("name"),
  age:  int("age"),
});


;
