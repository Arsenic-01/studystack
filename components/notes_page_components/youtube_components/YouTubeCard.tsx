"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Pencil, PlayCircle, User } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { SessionUser } from "@/lib/appwrite_types";
import DeleteYoutubeLink from "./DeleteYoutubeLink";
import EditYoutubeLink from "./EditYoutubeLink";

// Define the shape of the 'link' and 'user' props
interface YouTubeLink {
  id: string;
  youtubeLink: string;
  title: string;
  createdBy: string;
}

interface YouTubeCardProps {
  link: YouTubeLink;
  videoId: string;
  user: SessionUser | null;
  onPlay: (videoId: string) => void;
  semester: string;
  abbreviation: string;
}

export const YouTubeCard: React.FC<YouTubeCardProps> = ({
  link,
  videoId,
  user,
  onPlay,
  semester,
  abbreviation,
}) => {
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Card className="flex flex-col h-full overflow-hidden group">
      <CardHeader className="p-0">
        <button
          onClick={() => onPlay(videoId)}
          className="relative aspect-video w-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-t-lg"
          aria-label={`Play video: ${link.title}`}
        >
          <Image
            src={thumbnailUrl}
            alt={link.title || "YouTube video thumbnail"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <PlayCircle className="h-16 w-16 text-white/80 transition-transform duration-300 group-hover:scale-110" />
          </div>
        </button>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <h3 className="font-semibold leading-snug truncate" title={link.title}>
          {link.title || "No title provided"}
        </h3>
        <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
          <User className="h-4 w-4" />
          <span>Added by {link.createdBy}</span>
        </p>
      </CardContent>
      {(user?.name === link.createdBy || user?.role === "admin") && (
        <CardFooter className="p-4 pt-0 flex justify-end gap-2">
          <Button
            variant="outline"
            className="mt-2 w-full"
            onClick={() => setIsEditing(true)}
          >
            <Pencil />
            Edit Video
          </Button>
          <DeleteYoutubeLink id={link.id} abbreviation={abbreviation} />
        </CardFooter>
      )}
      {isEditing && (
        <EditYoutubeLink
          open={isEditing}
          onOpenChange={setIsEditing}
          id={link.id}
          url={link.youtubeLink}
          title={link.title}
          semester={semester}
          abbreviation={abbreviation}
        />
      )}
    </Card>
  );
};
