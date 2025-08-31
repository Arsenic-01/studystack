// components/project_components/ProjectOverviewHero.tsx

import { ArrowDown } from "lucide-react";
import Link from "next/link";
import { RainbowButton } from "../ui/rainbow-button";

export default function ProjectOverviewHero() {
  return (
    <section className="w-full mt-12 text-center">
      <div className="container mx-auto px-4 relative z-10">
        <p className="mb-4 text-sm text-blue-600 dark:text-white p-2 px-4 bg-blue-200 dark:bg-blue-950 inline-block rounded-full font-medium">
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
