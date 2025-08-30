import DeepDiveAbout from "@/components/project_components/DeepDiveAbout";
import ProjectOverviewHero from "@/components/project_components/ProjectOverviewHero";
import ProjectImpactStats from "@/components/project_components/ProjectStats";
import ProjectReferences from "@/components/project_components/References";
import SystemArchitecture from "@/components/project_components/SystemArchitecture";
import TechStackDisplay from "@/components/project_components/TechStackDisplay";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Project",
  description:
    "Learn more about the StudyStack project and how it was created.",
};

export default function AboutProjectPage() {
  return (
    <main className="flex flex-col py-20 md:py-24 lg:py-32">
      <ProjectOverviewHero />
      <div className="container mx-auto px-5">
        {/* Added responsive padding */}
        <div className="flex flex-col items-center gap-12 md:gap-28 lg:gap-36 py-16 md:py-24">
          <DeepDiveAbout />
          <SystemArchitecture />
          <TechStackDisplay />
          <ProjectImpactStats />
          <ProjectReferences />
        </div>
      </div>
    </main>
  );
}
