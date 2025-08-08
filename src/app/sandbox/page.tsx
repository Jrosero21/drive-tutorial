import { db } from "~/server/db";
import { mockFolders, mockFiles } from "~/lib/mock-data";
import { files, folders_table } from "~/server/db/schema";

export default function SandboxPage() {
  return (
    <div className="flex flex-col gap-4 p-6">
     Seed Function
      <form 
      action={async () =>  {
  "use server";

  console.log("sup nerds");

 const folderInsert = await db.insert(folders_table).values(
    mockFolders.map((folder, i) => ({
      id:     i + 1,
      name:   folder.name,
      parent: i !== 0 ? 1 : null,
    }))
  );

  console.log(folderInsert);

  const fileInsert = await db.insert(files).values(
    mockFiles.map((file, i) => ({
      id:     i + 1,
      name:   file.name,
      size:   5000,
      url:    file.url,
      parent: (i % 3) + 1,
    }))
  );

  console.log(fileInsert);
}}
>
        <button type="submit" >Seed</button>
      </form>
    </div>
  );
}
