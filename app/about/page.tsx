import { AboutGrid } from "@/components/about_components/AboutGrid";
import Created from "@/components/about_components/Created";
import GuidedBy from "@/components/about_components/about_helper_components/GuidedBy";
import React from "react";
import { VelocityScroll } from "@/components/ui/magicui/scroll-based-velocity";

const AboutPage = () => {
  return (
    <div className="flex flex-col gap-20 md:gap-32 max-w-5xl mx-auto py-28 lg:py-32   px-5">
      <div className="flex flex-col gap-10">
        <h1 className="text-3xl tracking-tighter font-bold">About Us</h1>
        <div className="">
          <AboutGrid />
        </div>
      </div>
      <div className="flex flex-col gap-10">
        <h1 className="text-3xl tracking-tighter font-bold">
          Why we created this?
        </h1>
        <div className="">
          <Created />
        </div>
      </div>
      <div>
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <VelocityScroll> • Made with ❤️ and Passion </VelocityScroll>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
        </div>
      </div>
      <div>
        <GuidedBy />
      </div>
    </div>
  );
};

export default AboutPage;
