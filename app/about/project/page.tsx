import HeroProject from "@/components/project_components/Hero";
import Architecture from "../../../components/project_components/SystemArchitecture";
import Team from "@/components/project_components/Team";
import Citations from "@/components/project_components/Citation";
import ProjStats from "@/components/project_components/ProjStats";

const AboutPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-8 ">
      <HeroProject />
      <Architecture />
      <ProjStats />
      <Team />
      <Citations />
    </div>
  );
};

export default AboutPage;
