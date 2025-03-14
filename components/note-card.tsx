"use client";

import { memo, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowUpRight, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CardOwner from "./CardOwner";
import { Skeleton } from "./ui/skeleton";

export interface NoteCardProps {
  note: {
    noteId: string;
    title: string;
    description: string;
    type_of_file:
      | "Notes"
      | "PPTS"
      | "Modal_Solutions"
      | "MSBTE_QP"
      | "Videos"
      | "Animations"
      | "Programs"
      | "Other";
    createdAt: string;
    fileId: string;
    users: {
      name: string;
      userId: string;
    };
  };
}

// 🔥 Fetch file metadata (cached with React Query)
const fetchFileType = async (fileId: string) => {
  const res = await fetch(
    `https://cloud.appwrite.io/v1/storage/buckets/67a6452c003b5b6b6502/files/${fileId}?project=679a700c0013ee3706ba`
  );
  if (!res.ok) throw new Error("Failed to fetch file metadata");
  const data = await res.json();
  return data.mimeType;
};

const NoteCard = memo(({ note }: NoteCardProps) => {
  const { data: fileType, isLoading } = useQuery({
    queryKey: ["fileType", note.fileId],
    queryFn: () => fetchFileType(note.fileId),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 1,
  });

  const filePreviewUrl = `https://cloud.appwrite.io/v1/storage/buckets/67a6452c003b5b6b6502/files/${note.fileId}/view?project=679a700c0013ee3706ba`;

  return (
    <Card className="flex flex-col h-full">
      {/* Card Header */}
      <CardHeader className="flex-row justify-between items-center">
        <CardTitle className="text-lg font-semibold truncate pr-1">
          {note.title}
        </CardTitle>
        <CardOwner
          note={note}
          formattedDate={new Date(note.createdAt).toLocaleString()}
        />
      </CardHeader>

      {/* Card Content */}
      <CardContent className="flex-grow">
        <div className="aspect-video relative mb-4">
          {isLoading ? (
            <Skeleton className="w-full h-full rounded-md" />) : fileType?.startsWith("image/") ? (
            <Suspense
              fallback={<Skeleton className="w-full h-full rounded-md" />}
            >
              <Image
                src={filePreviewUrl}
                alt={note.title}
                fill
                className="object-cover rounded-md pointer-events-none select-none"
                loading="lazy"
              />
            </Suspense>
          ) : (
            <div className="flex flex-col gap-2 items-center justify-center w-full h-full border border-neutral-300 dark:border-neutral-800 rounded-md bg-neutral-100 dark:bg-neutral-900">
              <div className="flex items-center">
                <FileText className="size-5 text-neutral-500 dark:text-neutral-400" />
                <p className="text-sm text-muted-foreground ml-2">
                  Preview unavailable
                </p>
              </div>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                File Type: {fileType}
              </span>
            </div>
          )}
        </div>
        <p className="text-base text-muted-foreground mb-2 line-clamp-2">
          {note.description}
        </p>
      </CardContent>

      {/* Card Footer */}
      <CardFooter>
        <Button className="w-full" asChild>
          <Link href={filePreviewUrl} target="_blank">
            View Online <ArrowUpRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
});

NoteCard.displayName = "NoteCard";

export default NoteCard;
