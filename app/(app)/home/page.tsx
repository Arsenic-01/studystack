import { Metadata } from "next";
import Features from "./_components/Features";
import Hero from "./_components/Hero";
import { HeroYouTubeVideo } from "./_components/_helper/HeroYouTubeVideo";
import { Testimonials } from "./_components/Testimonials";
import FAQ from "./_components/FAQ";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Welcome to the StudyStack. Access your subjects and resources here.",
};

const page = () => {
  return (
    <div className="overflow-x-clip">
      <Hero />
      <HeroYouTubeVideo />
      <Features />
      <Testimonials />
      <FAQ />
    </div>
  );
};

export default page;
