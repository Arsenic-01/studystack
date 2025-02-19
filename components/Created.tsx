import React from "react";
import { IconCloudDemo } from "./IconCloudDemo";
import { BlurFade } from "./magicui/blur-fade";

const Created = () => {
  return (
    <div>
      <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-10 border border-neutral-200 dark:border-neutral-800 p-5 rounded-xl">
        <div className="text-xl font-bold tracking-tighter max-w-lg">
          <BlurFade delay={0.25} inView>
        <h2 className="text-xl font-bold tracking-tighter sm:text-4xl xl:text-4xl/none">
          Problems faced:
        </h2><br/>
      </BlurFade>
      <BlurFade delay={0.25 * 2} inView>
        <span className="text-pretty text-base tracking-tighter sm:text-2xl xl:text-2xl/none">
        • Various Softwares Required to be used.
        </span><br/>
        <span className="text-pretty text-base tracking-tighter sm:text-2xl xl:text-2xl/none">
        • Not getting Resources during exam.
        </span><br/>
        <span className="text-pretty text-base tracking-tighter sm:text-2xl xl:text-2xl/none">
        • Security of Notes.
        </span><br/>
        <span className="text-pretty text-base tracking-tighter sm:text-2xl xl:text-2xl/none">
        • Large Storage of Teacher Notes.
        </span><br/>
      </BlurFade>
          {/* <TextReveal text="Various Softwares Required to be used."/>
          <TextReveal text="Not getting Resources during exam."/>
          <TextReveal text="Security of Notes."/>
          <TextReveal text="Large Storage of Teacher Notes."/> */}
        </div>
        <IconCloudDemo />
      </div>
    </div>
  );
};

export default Created;
