import React from "react";
import { IconCloudDemo } from "./IconCloudDemo";
import { BlurFade } from "./magicui/blur-fade";

const Created = () => {
  return (
    <div>
      <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-10 border border-neutral-200 dark:border-neutral-800 p-5 rounded-xl">
        <div className="text-xl font-bold tracking-tighter max-w-lg">
          <BlurFade delay={0.25} inView>
            {/* <span className="text-pretty text-base tracking-tighter sm:text-2xl xl:text-2xl/none">
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
        </span><br/> */}
            <div>
              Diploma students in Computer Technology (MSBTE) struggle with
              scattered notes, multiple software requirements, and difficult
              resource retrieval on platforms like Google Classroom. Study Stack
              simplifies this by providing a centralized, secure, and organized
              space where teachers upload and students easily access study
              materials—no more endless searching. Everything you need, all in
              one place! 🚀
            </div>
          </BlurFade>
        </div>
        <IconCloudDemo />
      </div>
    </div>
  );
};

export default Created;
