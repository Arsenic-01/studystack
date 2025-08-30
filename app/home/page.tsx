import FAQ from "@/components/home_components/FAQ";
import Hero from "@/components/home_components/Hero";
import React from "react";
import { Testimonials } from "@/components/home_components/Testimonials";
import { HeroYouTubeVideo } from "@/components/home_components/home_helper_components/HeroYouTubeVideo";
import Features from "../../components/home_components/Features";
import { Metadata } from "next";

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
