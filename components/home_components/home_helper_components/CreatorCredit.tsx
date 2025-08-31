"use client";

import { useState, useEffect } from "react";
import { X, Code, Heart, GitPullRequestDraft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CreatorCreditProps {
  creators: Array<{
    name: string;
    role?: string;
    avatar?: string;
  }>;
  guide: Array<{
    name: string;
    role: string;
  }>;
  className?: string;
}

export function CreatorCredit({
  creators,
  guide,
  className,
}: CreatorCreditProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the banner has been dismissed before
    const isDismissed =
      localStorage.getItem("creatorCreditDismissed") === "true";
    if (!isDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    // Save dismissal state to localStorage
    localStorage.setItem("creatorCreditDismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-5 right-2 lg:bottom-20 lg:right-4 z-50 w-64 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-card p-4 shadow-lg",
        "animate-in fade-in slide-in-from-right-5 duration-300",
        "backdrop-blur-3xl bg-opacity-95",
        className
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Code className="h-4 w-4 text-primary" />
          <h4 className="text-sm font-semibold">Created By</h4>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full hover:bg-muted"
          onClick={handleDismiss}
          aria-label="Dismiss"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      <div className="space-y-3">
        {creators.map((creator, index) => (
          <div key={index} className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={creator.avatar}
                alt={creator.name}
                className="select-none pointer-events-none"
              />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {creator.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{creator.name}</span>
              {creator.role && (
                <span className="text-xs text-muted-foreground">
                  {creator.role}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-2 mt-5">
        <div className="flex items-center gap-2">
          <GitPullRequestDraft className="h-4 w-4 text-primary" />
          <h4 className="text-sm font-semibold">Guided By</h4>
        </div>

        {guide.map((guide, index) => (
          <div key={index} className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={guide.avatar}
                alt={guide.name}
                className="select-none pointer-events-none"
              />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {guide.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{guide.name}</span>
              {guide.role && (
                <span className="text-xs text-muted-foreground">
                  {guide.role}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-2 border-t border-t-neutral-200 dark:border-t-neutral-800 flex items-center justify-center text-xs text-muted-foreground">
        <Heart className="h-3 w-3 mr-1 fill-red-600 text-red-600" />
        <span>Made with passion</span>
      </div>
    </div>
  );
}
