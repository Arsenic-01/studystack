import { LinkPreview } from "@/components/ui/link-preview";
import { Info } from "lucide-react";

const GuidedBy = () => {
  return (
    <div className="border border-neutral-300 dark:border-neutral-800 p-5 rounded-xl flex gap-5 items-center justify-start">
      <Info className="w-4 h-4" />
      <div>
        Guided by{" "}
        <LinkPreview
          url={"mailto:gbkatkade@kkwagh.edu.in"}
          isStatic
          imageSrc="https://cdn.jsdelivr.net/gh/Arsenic-01/studystack/assets/mentor/gbk.jpeg"
          className="font-bold hover:underline hover:underline-offset-4 transition-all ease-in-out duration-300"
        >
          Prof. G.B. Katkade
        </LinkPreview>{" "}
        and{" "}
        <LinkPreview
          url={"mailto:adtalole@kkwagh.edu.in"}
          isStatic
          imageSrc="https://cdn.jsdelivr.net/gh/Arsenic-01/studystack/assets/mentor/adt.jpg"
          className="font-bold hover:underline hover:underline-offset-4 transition-all ease-in-out duration-300"
        >
          Prof. A.D. Talole
        </LinkPreview>
      </div>
    </div>
  );
};

export default GuidedBy;
