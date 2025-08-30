// components/project_components/ProjectOverviewHero.tsx

import { ArrowDown } from "lucide-react";
import Link from "next/link";
import { RainbowButton } from "../ui/rainbow-button";

export default function ProjectOverviewHero() {
  return (
    <section className="w-full bg-gradient-to-br from-background via-muted/20 to-blue-500/5 dark:from-background dark:via-muted/10 dark:to-blue-500/5 mt-12 text-center relative overflow-hidden">
      {/* Background radial gradient for subtle blue glow */}
      <div className="absolute inset-0 z-0 opacity-20 dark:opacity-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob dark:bg-blue-800" />
        <div className="absolute bottom-1/4 right-1/2 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 dark:bg-primary-foreground" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <p className="mb-4 text-sm text-blue-600 dark:text-blue-300 p-2 px-4 bg-blue-200 dark:bg-blue-950/80 inline-block rounded-full font-medium">
          Introducing StudyStack
        </p>
        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground text-balance mx-auto max-w-4xl">
          Your Intelligent Platform for Academic Excellence
        </h1>
        <p className="mt-6 max-w-4xl mx-auto text-lg text-neutral-700 dark:text-neutral-400 text-balance">
          StudyStack is more than just a resource hub; it&#39;s a dynamic
          ecosystem designed to centralize, organize, and elevate the
          educational experience for students, teachers, and administrators.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link href="#deep-dive">
            <RainbowButton className="flex items-center gap-2">
              Learn Our Story <ArrowDown className="size-4" />
            </RainbowButton>
          </Link>
        </div>
      </div>
    </section>
  );
}
