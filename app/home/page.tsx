import { CardHoverEffectDemo } from "@/components/CardHoverEffectDemo";
import FAQ from "@/components/FAQ";
import Hero from "@/components/Hero";
import { InfiniteMovingCardsDemo } from "@/components/InfiniteMovingCardsDemo";
import React from "react";

const page = () => {
  return (
    <div>
      <Hero />
      <CardHoverEffectDemo />
      <InfiniteMovingCardsDemo />
      <FAQ />
    </div>
  );
};

export default page;
