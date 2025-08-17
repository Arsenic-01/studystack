"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Note } from "@/lib/appwrite_types";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";
import CardOwner from "./CardOwner";

const NoteCard = memo(({ note }: { note: Note }) => {
  return (
    <Card className="flex flex-col h-full">
      {/* Card Header */}
      <CardHeader className="flex-row justify-between items-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <CardTitle className="text-lg font-semibold  pr-1">
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
        />
      </CardHeader>

      {/* Card Content */}
      <CardContent className="flex-grow">
        <div className="aspect-video relative mb-4">
          {note.thumbNail ? (
            <Image
              src={note.thumbNail}
              alt={note.title}
              fill
              className="object-cover rounded-md pointer-events-none select-none"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col gap-1 items-center justify-center w-full h-full border border-neutral-300 dark:border-neutral-800 rounded-md bg-neutral-100 dark:bg-neutral-900 p-4">
              <div className="flex flex-col items-center justify-center text-neutral-500 dark:text-neutral-400">
                {/* Dynamic Icon based on file type */}
                {note.mimeType?.includes("pdf") ? (
                  <ImageOff className="h-8 w-8 mb-2" />
                ) : note.mimeType?.includes("word") ? (
                  <FileText className="h-8 w-8 mb-2" />
                ) : note.mimeType?.includes("presentation") ||
                  note.mimeType?.includes("powerpoint") ? (
                  <FileSpreadsheet className="h-8 w-8 mb-2" />
                ) : note.mimeType?.startsWith("image/") ? (
                  <FileImage className="h-8 w-8 mb-2" />
                ) : note.mimeType?.startsWith("video/") ? (
                  <FileVideo className="h-8 w-8 mb-2" />
                ) : note.mimeType?.startsWith("audio/") ? (
                  <FileAudio className="h-8 w-8 mb-2" />
                ) : note.mimeType?.startsWith("text/") ? (
                  <FileCode className="h-8 w-8 mb-2" />
                ) : note.mimeType?.includes("zip") ||
                  note.mimeType?.includes("rar") ? (
                  <FileArchive className="h-8 w-8 mb-2" />
                ) : (
                  <FileType2 className="h-8 w-8 mb-2" /> // fallback
                )}

                <p className="text-sm">Preview unavailable</p>
              </div>

              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                File Type: {note.mimeType || "Unknown"}
              </span>
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
          <Link href={note.fileUrl} target="_blank" rel="noopener noreferrer">
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
