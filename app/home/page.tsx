import FAQ from "@/components/FAQ";
import Hero from "@/components/Hero";
import { HeroVideoDialogDemoTopInBottomOut } from "@/components/HeroVideoDialogDemo";
import { InfiniteMovingCardsDemo } from "@/components/InfiniteMovingCardsDemo";
import React from "react";

const page = () => {
  return (
    <div className="overflow-x-clip">
      <Hero />
      <HeroVideoDialogDemoTopInBottomOut />
      <InfiniteMovingCardsDemo />
      <FAQ />
    </div>
  );
};

export default page;
