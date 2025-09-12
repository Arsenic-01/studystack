import { Metadata } from "next";
import Features from "./_components/Features";
import Hero from "./_components/Hero";
import { HeroYouTubeVideo } from "./_components/_helper/HeroYouTubeVideo";
import dynamic from "next/dynamic";
const Testimonials = dynamic(() =>
  import("./_components/Testimonials").then((mod) => mod.Testimonials)
);
const FAQ = dynamic(() => import("./_components/FAQ"));

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
