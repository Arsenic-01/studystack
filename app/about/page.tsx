import { AboutGrid } from "@/components/AboutGrid";
import Created from "@/components/Created";
import GuidedBy from "@/components/GuidedBy";
import React from "react";

const AboutPage = () => {
  return (
    <div className="flex flex-col gap-20 md:gap-32 max-w-5xl mx-auto py-32 md:py-36 xl:py-44  px-5">
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
        <GuidedBy />
      </div>
    </div>
  );
};

export default AboutPage;
