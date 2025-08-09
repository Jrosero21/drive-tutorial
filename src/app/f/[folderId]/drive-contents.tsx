"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { usePostHog } from "posthog-js/react";
import { UploadButton } from "~/components/uploadthing";
import type { files_table, folders_table } from "~/server/db/schema";
import { FileRow, FolderRow } from "./file-row";

type Folder = typeof import("~/server/db/schema").folders_table.$inferSelect;
type File = typeof import("~/server/db/schema").files_table.$inferSelect;

export default function DriveContents(props: {
  files: File[];
  folders: Folder[];
  parents: Folder[]; // may be []
  currentFolderId: number;
}) {
  const router = useRouter();
  const posthog = usePostHog();

  // If parents array is empty, current folder is root; otherwise first parent is root
  const rootFolderId = props.parents.length
    ? props.parents[0]!.id
    : props.currentFolderId;

  const hasRows = props.folders.length > 0 || props.files.length > 0;

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-gray-100">
      <div className="mx-auto max-w-6xl">
        {/* Header / Breadcrumb + Auth */}
        <div className="mb-6 flex items-center justify-between">
          <nav className="flex items-center text-sm" aria-label="Breadcrumb">
            <Link
              href={`/f/${rootFolderId}`}
              className="mr-2 text-gray-300 hover:text-white"
            >
              My Drive
            </Link>

            {props.parents.map((folder) => (
              <div key={folder.id} className="flex items-center">
                <ChevronRight className="mx-2 text-gray-500" size={16} />
                <Link
                  href={`/f/${folder.id}`}
                  className="text-gray-300 hover:text-white"
                >
                  {folder.name}
                </Link>
              </div>
            ))}
          </nav>

          <div>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg bg-gray-800 shadow-xl">
          <div className="border-b border-gray-700 px-6 py-4">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-400">
              <div className="col-span-6">Name</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-3">Size</div>
              <div className="col-span-1" />
            </div>
          </div>

          {hasRows ? (
            <ul>
              {props.folders.map((folder) => (
                <FolderRow key={folder.id} folder={folder} />
              ))}
              {props.files.map((file) => (
                <FileRow key={file.id} file={file} />
              ))}
            </ul>
          ) : (
            <div className="px-6 py-12 text-center text-gray-400">
              <p className="mb-2 text-base">This folder is empty.</p>
              <p className="text-sm">
                Upload files or create a new folder to get started.
              </p>
            </div>
          )}
        </div>

        {/* Uploader */}
        <div className="mt-6">
          <UploadButton
            endpoint="driveUploader"
            input={{ folderId: props.currentFolderId }}
            onBeforeUploadBegin={(files) => {
              // Guard if posthog is not ready
              posthog?.capture("files_uploading", { fileCount: files.length });
              return files;
            }}
            onClientUploadComplete={() => {
              router.refresh();
            }}
            onUploadError={(error) => {
              posthog?.capture("files_upload_error", {
                message: error?.message ?? "Unknown error",
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}
