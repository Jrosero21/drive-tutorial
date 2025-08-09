// app/f/[folderId]/page.tsx
import { notFound } from "next/navigation";
import DriveContents from "./drive-contents";
import { QUERIES } from "~/server/db/queries";

export default async function GoogleDriveClone({
  params,
}: {
  params: Promise<{ folderId: string }>;
}) {

  const { folderId } = await params;

  const parsedFolderId = Number(folderId);
  if (!Number.isFinite(parsedFolderId)) {
    return <div>Invalid folder ID</div>;
  }


  const currentFolder = await QUERIES.getFolderById(parsedFolderId);
  if (!currentFolder) {
    notFound();
  }

  const [folders, files, parents] = await Promise.all([
    QUERIES.getFolders(parsedFolderId),
    QUERIES.getFiles(parsedFolderId),
    QUERIES.getAllParentsForFolder(parsedFolderId), // safe helper
  ]);

  return (
    <DriveContents
      files={files}
      folders={folders}
      parents={parents ?? []}
      currentFolderId={parsedFolderId}
    />
  );
}
