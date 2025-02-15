"use client";
import React from "react";
import { AnimatedTooltip } from "./ui/animated-tooltip";
const tsc = [
  {
    id: 1,
    name: "Victus03",
    designation: "Discord",
    image:
      "/about_logos/discord.png",
  },
  {
    id: 2,
    name: "TanayHingane",
    designation: "Github",
    image:
      "/github.svg",
  },
  {
    id: 3,
    name: "tanayhingane03@gmail.com",
    designation: "Mail",
    image:
      "/about_logos/Email.webp",
  },
  {
    id: 4,
    name: "Tanay Hingane",
    designation: "Linkedin",
    image:
      "/about_logos/linkedin.webp",
  },
];

const vsc = [
    {
      id: 1,
      name: "Victus03",
      designation: "Discord",
      image:
        "/about_logos/discord.png",
    },
    {
      id: 2,
      name: "TanayHingane",
      designation: "Github",
      image:
        "/github.svg",
    },
    {
      id: 3,
      name: "tanayhingane03@gmail.com",
      designation: "Mail",
      image:
        "/about_logos/Email.webp",
    },
    {
      id: 4,
      name: "Tanay Hingane",
      designation: "Linkedin",
      image:
        "/about_logos/linkedin.webp",
    },
  ];

export function AnimatedTooltipPreview() {
  return (
    <div className="flex flex-row items-center justify-center mb-10 w-full">
      <div className="flex flex-row items-center justify-center mb-10 mr-52">
        <AnimatedTooltip items={tsc} />
    </div>
    <div className="flex flex-row items-center justify-center mb-10">
      <AnimatedTooltip items={vsc} />
    </div>
    </div>
  );
}
