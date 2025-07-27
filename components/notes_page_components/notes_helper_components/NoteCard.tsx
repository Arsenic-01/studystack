"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  FileArchive,
  FileAudio,
  FileCode,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileType2,
  FileVideo,
  ImageOff,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import CardOwner from "./CardOwner";
import { Skeleton } from "../../ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";

export interface NoteCardProps {
  note: {
    noteId: string;
    title: string;
    description: string;
    type_of_file:
      | "Notes"
      | "PPTS"
      | "Assignments"
      | "SLA"
      | "Lab_Manuals"
      | "Modal_Solutions"
      | "MSBTE_QP"
      | "Videos"
      | "Animations"
      | "Programs"
      | "Syllabus"
      | "Other";
    createdAt: string;
    unit: string[];
    fileId: string;
    sem: string;
    users: {
      name: string;
      userId: string;
    };
  };
}

const fetchFileDetails = async (fileId: string) => {
  try {
    const res = await fetch(
      `https://cloud.appwrite.io/v1/storage/buckets/67a6452c003b5b6b6502/files/${fileId}?project=679a700c0013ee3706ba`
    );
    if (!res.ok) console.log(`Failed to fetch: ${res.statusText}`);
    const data = await res.json();

    return {
      mimeType: data.mimeType,
      fileName: data.name,
      fileSize: (data.sizeOriginal / (1024 * 1024)).toFixed(2) + " MB", // Convert bytes to MB
    };
  } catch (error) {
    console.error("Error fetching file details:", error);
    return { mimeType: null, fileName: "Unknown", fileSize: "Unknown" };
  }
};

const NoteCard = memo(({ note }: NoteCardProps) => {
  const { data: fileDetails, isLoading } = useQuery({
    queryKey: ["fileDetails", note.fileId],
    queryFn: () => fetchFileDetails(note.fileId),
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
    retry: 2,
  });

  const filePreviewUrl = `https://cloud.appwrite.io/v1/storage/buckets/67a6452c003b5b6b6502/files/${note.fileId}/view?project=679a700c0013ee3706ba`;

  return (
    <Card className="flex flex-col h-full">
      {/* Card Header */}
      <CardHeader className="flex-row justify-between items-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <CardTitle className="text-lg font-semibold truncate pr-1">
                <div>{note.title}</div>
              </CardTitle>
            </TooltipTrigger>
            <TooltipContent>
              <p>{note.title}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <CardOwner
          note={note}
          formattedDate={new Date(note.createdAt).toLocaleString()}
          fileName={fileDetails?.fileName}
          fileSize={fileDetails?.fileSize}
        />
      </CardHeader>

      {/* Card Content */}
      <CardContent className="flex-grow">
        <div className="aspect-video relative mb-4">
          {isLoading ? (
            <Skeleton className="w-full h-full rounded-md" />
          ) : fileDetails?.mimeType?.startsWith("image/") ? (
            <Image
              src={filePreviewUrl}
              alt={note.title}
              fill
              className="object-cover rounded-md pointer-events-none select-none"
              loading="lazy"
            />
          ) : (
            // <div className="flex flex-col gap-2 items-center justify-center w-full h-full border border-neutral-300 dark:border-neutral-800 rounded-md bg-neutral-100 dark:bg-neutral-900">
            //   <div className="flex items-center">
            //     <FileText className="size-5 text-neutral-500 dark:text-neutral-400" />
            //     <p className="text-sm text-muted-foreground ml-2">
            //       Preview unavailable
            //     </p>
            //   </div>
            //   {fileDetails && (
            //     <span className="text-xs text-neutral-500 dark:text-neutral-400">
            //       File Type: {fileDetails.mimeType || "Unknown"}
            //     </span>
            //   )}
            // </div>
            <div className="flex flex-col gap-1 items-center justify-center w-full h-full border border-neutral-300 dark:border-neutral-800 rounded-md bg-neutral-100 dark:bg-neutral-900 p-4">
              <div className="flex flex-col items-center justify-center text-neutral-500 dark:text-neutral-400">
                {/* Dynamic Icon based on file type */}
                {fileDetails?.mimeType?.includes("pdf") ? (
                  <ImageOff className="h-8 w-8 mb-2" />
                ) : fileDetails?.mimeType?.includes("word") ? (
                  <FileText className="h-8 w-8 mb-2" />
                ) : fileDetails?.mimeType?.includes("presentation") ||
                  fileDetails?.mimeType?.includes("powerpoint") ? (
                  <FileSpreadsheet className="h-8 w-8 mb-2" />
                ) : fileDetails?.mimeType?.startsWith("image/") ? (
                  <FileImage className="h-8 w-8 mb-2" />
                ) : fileDetails?.mimeType?.startsWith("video/") ? (
                  <FileVideo className="h-8 w-8 mb-2" />
                ) : fileDetails?.mimeType?.startsWith("audio/") ? (
                  <FileAudio className="h-8 w-8 mb-2" />
                ) : fileDetails?.mimeType?.startsWith("text/") ? (
                  <FileCode className="h-8 w-8 mb-2" />
                ) : fileDetails?.mimeType?.includes("zip") ||
                  fileDetails?.mimeType?.includes("rar") ? (
                  <FileArchive className="h-8 w-8 mb-2" />
                ) : (
                  <FileType2 className="h-8 w-8 mb-2" /> // fallback
                )}

                <p className="text-sm">Preview unavailable</p>
              </div>

              {fileDetails && (
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  File Type: {fileDetails.mimeType || "Unknown"}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-row gap-1 my-2">
          <span className="text-sm font-semibold ml-1 bg-neutral-50 border border-neutral-300 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:border-neutral-800 px-2 py-1 rounded-md">
            {note.type_of_file}
          </span>
          <span className="text-sm overflow-x-clip text-nowrap truncate font-semibold ml-1 bg-neutral-50 border border-neutral-300 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:border-neutral-800 px-2 py-1 rounded-md">
            {note.unit}
          </span>
        </div>

        <p className="text-sm  px-2 py-1 rounded-md">{note.description}</p>
      </CardContent>

      {/* Card Footer */}
      <CardFooter>
        <Button className="w-full" asChild>
          <Link href={filePreviewUrl} target="_blank" rel="noopener noreferrer">
            <span className="hidden lg:block">View Online</span>
            <span className="lg:hidden block">View</span>
            <ArrowUpRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
});

NoteCard.displayName = "NoteCard";

export default NoteCard;
