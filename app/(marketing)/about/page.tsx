import { Metadata } from "next";
import { AboutGrid } from "./_components/AboutGrid";
import Created from "./_components/Created";
import GuidedBy from "./_components/_helper/GuidedBy";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn more about the StudyStack team and how we created this platform.",
};

const AboutPage = () => {
  return (
    <div className="flex flex-col gap-20 md:gap-32 max-w-5xl mx-auto py-28 lg:py-32 px-5">
      <div className="flex flex-col gap-10">
        <h1 className="text-3xl tracking-tighter font-bold">About Us</h1>
        <AboutGrid />
      </div>
      <div className="flex flex-col gap-10">
        <h1 className="text-3xl tracking-tighter font-bold">
          Why we created this?
        </h1>
        <Created />
      </div>
      <GuidedBy />
    </div>
  );
};

export default AboutPage;
