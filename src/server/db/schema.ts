// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import "server-only";

import { singlestoreTable, bigint, text, index, singlestoreTableCreator } from "drizzle-orm/singlestore-core";


export const createTable = singlestoreTableCreator(
  (name) => `drive-tutorial_${name}`,
);

export const files_table = createTable("files_table",
   {
  id: bigint("id", {mode: "number", unsigned: true}).primaryKey().autoincrement(),
  name: text("name"),
  size: bigint("size", {mode: "number", unsigned: true}),
  url: text("url"),
  parent: bigint("parent", {mode: "number", unsigned: true}).notNull(),
}, 
(t) => {
  return [index("parent_index").on(t.parent)]
},
);
export type DB_FileType = typeof files_table.$inferSelect;

export const folders_table = createTable("folders_table",
  {
 id: bigint("id", {mode: "number", unsigned: true}).primaryKey().autoincrement(),
 name: text("name").notNull(),
 parent: bigint("parent", {mode: "number", unsigned: true}),
}, 
(t) => {
 return [index("parent_index").on(t.parent)]
},
);

export type DB_Folderype = typeof folders_table.$inferSelect