// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { singlestoreTable, int, text, index, singlestoreTableCreator } from "drizzle-orm/singlestore-core";


export const createTable = singlestoreTableCreator(
  (name) => `drive-tutorial_${name}`,
);

export const files = createTable("files_table",
   {
  id: int("id").primaryKey().autoincrement(),
  name: text("name"),
  size: int("size"),
  url: text("url"),
  parent: int("parent").notNull(),
}, 
(t) => {
  return [index("parent_index").on(t.parent)]
},
);

export const folders = createTable("folders_table",
  {
 id: int("id").primaryKey().autoincrement(),
 name: text("name").notNull(),
 parent: int("parent"),
}, 
(t) => {
 return [index("parent_index").on(t.parent)]
},
);
