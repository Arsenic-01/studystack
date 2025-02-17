import { AnimatedPinDemo } from "@/components/AnimatedPinDemo";
import React from "react";
import { gb } from "@/data";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { IconCloudDemo } from "@/components/IconCloudDemo";

const AboutPage = () => {
  return (
    <div>
      <AnimatedPinDemo />
      {/* <div className="flex flex-row">
        <IconCloudDemo />
      </div> */}
      <div className="pb-10 text-start justify-center flex flex-col items-center gap-5 tracking-wide text-xl text-slate-950 dark:text-white/80">
        <h2>Guided By:</h2>
        <div className="flex flex-row gap-10">
          <AnimatedTooltip items={gb} />
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
