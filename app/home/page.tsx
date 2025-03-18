import FAQ from "@/components/FAQ";
import Hero from "@/components/Hero";
import { HeroVideoDialogDemoTopInBottomOut } from "@/components/HeroVideoDialogDemo";
import { InfiniteMovingCardsDemo } from "@/components/InfiniteMovingCardsDemo";
import React from "react";
import FeaturesSection from "../../components/FeaturesSection";

const page = () => {
  return (
    <div className="overflow-x-clip">
      <Hero />
      <HeroVideoDialogDemoTopInBottomOut />
      <FeaturesSection />
      <InfiniteMovingCardsDemo />
      <FAQ />
    </div>
  );
};

export default page;
