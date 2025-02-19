import { Info } from "lucide-react";
import Link from "next/link";
import React from "react";

const GuidedBy = () => {
  return (
    <div className="border border-neutral-200 dark:border-neutral-800 p-5 rounded-xl flex gap-2 items-center justify-start">
      <Info className="w-4 h-4" />
      <div>
        Guided by{" "}
        <Link
          href={"mailto:gbkatkade@kkwagh.edu.in"}
          className="font-bold hover:underline hover:underline-offset-4 transition-all ease-in-out duration-300"
        >
          Prof. G.B. Katkade
        </Link>{" "}
        and{" "}
        <Link
          href={"mailto:adtalole@kkwagh.edu.in"}
          className="font-bold hover:underline hover:underline-offset-4 transition-all ease-in-out duration-300"
        >
          Prof. A.D. Talole
        </Link>
      </div>
    </div>
  );
};

export default GuidedBy;
