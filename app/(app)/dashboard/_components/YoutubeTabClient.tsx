"use client";

import { YouTubeCard } from "@/app/(app)/semester/[sem]/[sub]/_components/_cards/YouTubeCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { getUserYoutubeLinks } from "@/lib/actions/Youtube.actions";
import { SessionUser, Youtube } from "@/lib/appwrite_types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const LINKS_PER_PAGE = 3;

interface YoutubeTabClientProps {
  initialLinks: { documents: Youtube[]; total: number };
  userName: string;
  user: SessionUser;
}

export default function YoutubeTabClient({
  initialLinks,
  userName,
  user,
}: YoutubeTabClientProps) {
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["userYoutubeLinks", userName],
      queryFn: async ({ pageParam = 0 }) => {
        const res = await getUserYoutubeLinks({
          userName,
          limit: LINKS_PER_PAGE,
          offset: pageParam,
        });
        return { ...res, offset: pageParam };
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        const currentCount = lastPage.offset + lastPage.documents.length;
        if (currentCount < lastPage.total) {
          return currentCount;
        }
        return undefined;
      },
      initialData: {
        pages: [
          {
            documents: initialLinks.documents,
            total: initialLinks.total,
            offset: 0,
          },
        ],
        pageParams: [0],
      },
      staleTime: 5 * 60 * 1000,
    });

  const links = data?.pages.flatMap((page) => page.documents) ?? [];

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

      {hasNextPage && (
        <div className="flex justify-center mt-8">
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}

      {/* Video Player Dialog */}
      <Dialog
        open={!!playingVideoId}
        onOpenChange={() => setPlayingVideoId(null)}
      >
        <DialogContent className="max-w-3xl p-0 border-0">
          {/* Note: An explicit DialogTitle is good for accessibility, even if hidden */}
          <DialogTitle className="sr-only">YouTube Video Player</DialogTitle>
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
