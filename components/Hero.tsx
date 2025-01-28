import React from "react";
import SelectSem from "./misc/SelectSemester";
import { AnimatedShinyText } from "./ui/animated-shiny-text";
import { ArrowRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { DotPattern } from "./ui/dot-pattern";

const Hero = () => {
  return (
    <div
      className="my-36 md:my-44 lg:my-56 2xl:my-0 2xl:h-screen flex items-center justify-center relative"
      id="hero"
    >
      <div className="flex flex-col items-center justify-center gap-20 px-5 z-10">
        <div className="flex flex-col items-center justify-center gap-14">
          <div
            className={cn(
              "group rounded-full border border-black/5  text-base text-white transition-all ease-in hover:cursor-pointer bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
            )}
          >
            <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
              <span>✨ For Computer Technology Students</span>
              <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
            </AnimatedShinyText>
          </div>
          <div className="flex flex-col items-center justify-center gap-5 xl:gap-7">
            <h1 className="text-7xl xl:text-[80px] font-bold bg-gradient-to-r dark:from-white dark:to-slate-300 from-black to-gray-700 bg-clip-text white:text-transparent tracking-tighter">
              All notes in one place.
            </h1>
            <h2 className="text-xl xl:text-2xl sm:max-w-md sm:text-center text-neutral-900/80 dark:text-neutral-50">
              Boost Your Marks by using the right Resources at the right time!
            </h2>
          </div>
        </div>
        <SelectSem />
      </div>
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]"
        )}
      />
    </div>
  );
};

export default Hero;
