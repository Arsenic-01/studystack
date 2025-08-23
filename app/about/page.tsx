import { AboutGrid } from "@/components/about_components/AboutGrid";
import Created from "@/components/about_components/Created";
import GuidedBy from "@/components/about_components/about_helper_components/GuidedBy";

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
        <GuidedBy />
      </div>
    </div>
  );
};

export default AboutPage;
