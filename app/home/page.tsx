import FAQ from "@/components/FAQ";
import Hero from "@/components/Hero";
import { HeroVideoDialogDemoTopInBottomOut } from "@/components/HeroVideoDialogDemo";
import { InfiniteMovingCardsDemo } from "@/components/InfiniteMovingCardsDemo";
import React from "react";

const page = () => {
  return (
    <div>
      <Hero />
      {/* <CardHoverEffectDemo /> */}
      <HeroVideoDialogDemoTopInBottomOut />
      <InfiniteMovingCardsDemo />
      <FAQ />
    </div>
  );
};

export default page;
