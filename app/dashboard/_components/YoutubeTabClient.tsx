"use client";

import { YouTubeCard } from "@/components/notes_page_components/youtube_components/YouTubeCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/search-dialog";
import { getUserYoutubeLinks } from "@/lib/actions/Youtube.actions";
import { SessionUser, Youtube } from "@/lib/appwrite_types";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const LINKS_PER_PAGE = 3;

interface YoutubeTabClientProps {
  initialLinks: Youtube[];
  totalLinks: number;
  userName: string;
  user: SessionUser;
}

export default function YoutubeTabClient({
  initialLinks,
  totalLinks,
  userName,
  user,
}: YoutubeTabClientProps) {
  const [links, setLinks] = useState<Youtube[]>(initialLinks);
  const [offset, setOffset] = useState(initialLinks.length);
  const [isLoading, setIsLoading] = useState(false);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  const loadMoreLinks = async () => {
    setIsLoading(true);
    const { documents: newLinks } = await getUserYoutubeLinks({
      userName,
      limit: LINKS_PER_PAGE,
      offset,
    });
    setLinks((prev) => [...prev, ...newLinks]);
    setOffset((prev) => prev + newLinks.length);
    setIsLoading(false);
  };

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
              onPlay={setPlayingVideoId}
              semester={link.semester}
              abbreviation={link.abbreviation}
            />
          );
        })}
      </div>

      {links.length < totalLinks && (
        <div className="flex justify-center mt-8">
          <Button onClick={loadMoreLinks} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}

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
