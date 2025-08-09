// ~/server/db/queries.ts
import "server-only";

import { db } from "~/server/db";
import {
  files_table as filesSchema,
  folders_table as foldersSchema,
} from "~/server/db/schema";
import { eq, isNull, and } from "drizzle-orm";

export const QUERIES = {
  getFolders(folderId: number) {
    return db
      .select()
      .from(foldersSchema)
      .where(eq(foldersSchema.parent, folderId))
      .orderBy(foldersSchema.id);
  },

  getFiles(folderId: number) {
    return db
      .select()
      .from(filesSchema)
      .where(eq(filesSchema.parent, folderId))
      .orderBy(filesSchema.id);
  },

  /**
   * Returns:
   * - null if the starting folder doesn't exist
   * - [] if it exists but has no parents (root)
   * - [ ...parents ] otherwise
   */
  async getAllParentsForFolder(folderId: number) {
    const [start] = await db
      .select()
      .from(foldersSchema)
      .where(eq(foldersSchema.id, folderId))
      .limit(1);

    if (!start) return null;

    const parents: typeof start[] = [];
    let currentParentId: number | null = start.parent;

    while (currentParentId !== null) {
      const [parent] = await db
        .select()
        .from(foldersSchema)
        .where(eq(foldersSchema.id, currentParentId))
        .limit(1);

      if (!parent) {
        // Broken chain; stop instead of throwing
        break;
      }

      parents.unshift(parent);
      currentParentId = parent.parent;
    }

    return parents;
  },

  async getFolderById(folderId: number) {
    const res = await db
      .select()
      .from(foldersSchema)
      .where(eq(foldersSchema.id, folderId))
      .limit(1);
    return res[0];
  },

  async getRootFolderForUser(userId: string) {
    const res = await db
      .select()
      .from(foldersSchema)
      .where(and(eq(foldersSchema.ownerId, userId), isNull(foldersSchema.parent)))
      .limit(1);
    return res[0];
  },
};

export const MUTATIONS = {
  async createFile(input: {
    file: { name: string; size: number; url: string; parent: number };
    userId: string;
  }) {
    return db.insert(filesSchema).values({
      ...input.file,
      ownerId: input.userId,
    });
  },

  async onboardUser(userId: string) {
    const rootFolder = await db
      .insert(foldersSchema)
      .values({ name: "Root", parent: null, ownerId: userId })
      .$returningId();

    const rootFolderId = rootFolder[0]!.id;

    await db.insert(foldersSchema).values([
      { name: "Trash", parent: rootFolderId, ownerId: userId },
      { name: "Shared", parent: rootFolderId, ownerId: userId },
      { name: "Documents", parent: rootFolderId, ownerId: userId },
    ]);

    return rootFolderId;
  },
};
