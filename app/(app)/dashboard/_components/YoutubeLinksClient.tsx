"use client";

import { YouTubeCard } from "@/app/(app)/semester/[sem]/[sub]/_components/_cards/YouTubeCard";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/search-dialog";
import { SessionUser, Youtube } from "@/lib/appwrite_types";
import { useState } from "react";

interface YoutubeLinksClientProps {
  links: Youtube[];
  user: SessionUser;
}

export default function YoutubeLinksClient({
  links,
  user,
}: YoutubeLinksClientProps) {
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {links.map((link) => {
          const videoIdMatch = link.youtubeLink.match(
            /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
          );
          const videoId = videoIdMatch ? videoIdMatch[1] : null;
          if (!videoId) return null;

          return (
            <YouTubeCard
              key={link.id}
              link={link}
              videoId={videoId}
              user={user}
              onPlay={setPlayingVideoId} // This is now valid as it's passed from a client component
              semester={link.semester}
              abbreviation={link.abbreviation}
            />
          );
        })}
      </div>

      <Dialog
        open={!!playingVideoId}
        onOpenChange={() => setPlayingVideoId(null)}
      >
        <DialogContent className="max-w-3xl p-0 border-0">
          <DialogTitle></DialogTitle>
          <div className="aspect-video">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${playingVideoId}?autoplay=1`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
