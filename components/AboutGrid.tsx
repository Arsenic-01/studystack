"use client";

import Image from "next/image";
import { AnimatedTooltip } from "./ui/animated-tooltip";
import { vsc } from "@/data";
import { Chip } from "@heroui/react";

export function AboutGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-5 lg:grid-cols-4 gap-10 sm:gap-5 md:gap-10">
      <div className=" sm:col-span-2 lg:col-span-1 flex flex-col justify-center items-center border border-neutral-200 dark:border-neutral-800 p-5 rounded-xl">
        <Image
          src="/jerry.jpg"
          alt="jerry"
          width={200}
          height={200}
          className="rounded-xl h-72 md:h-full w-full object-cover pointer-events-none select-none"
        />
        <div className="flex w-full items-center justify-center mt-6 mb-2 pr-4">
          <AnimatedTooltip items={vsc} />
        </div>
      </div>
      <div className="sm:col-span-3 lg:col-span-3 p-5 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-center rounded-xl">
        <p className="text-xl font-bold tracking-tighter">
          &quot; I am a motivated and versatile individual, always eager to take
          on new challenges. With a passion for learning I am dedicated to
          delivering high-quality results. With a positive attitude and a growth
          mindset, I am ready to make a meaningful contribution and achieve
          great things. &quot;
        </p>
        <div className="mt-5 flex flex-col  items-end">
          {" "}
          <div className="font-semibold">Vedant B. Bhor</div>
          <div className="text-sm text-neutral-700 dark:text-white/70">
            SYCM-LIN 2025
          </div>
        </div>
        <div className="mt-5 flex flex-wrap flex-row gap-1">
          <Chip color="danger">Front End</Chip>
          <Chip color="warning">Back End</Chip>
          <Chip color="success">Database Management</Chip>
          <Chip color="primary">Front End</Chip>
        </div>
      </div>

      <div className="sm:col-span-3 lg:col-span-3 p-5 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-center rounded-xl">
        <p className="text-xl font-bold tracking-tighter">
          &quot; I am a motivated and versatile individual, always eager to take
          on new challenges. With a passion for learning I am dedicated to
          delivering high-quality results. With a positive attitude and a growth
          mindset, I am ready to make a meaningful contribution and achieve
          great things. &quot;
        </p>
        <div className="mt-5 flex flex-col  items-end">
          {" "}
          <div className="font-semibold">Tanay K. Hingane</div>
          <div className="text-sm text-neutral-700 dark:text-white/70">
            SYCM-LIN 2025
          </div>
        </div>
        <div className="mt-5 flex flex-wrap flex-row gap-1">
          <Chip color="danger" className="w-fit">
            Front End
          </Chip>
          <Chip color="primary">Designing</Chip>
          <Chip color="success">Data Filling</Chip>
        </div>
      </div>

      <div className="sm:col-span-2 lg:col-span-1 flex flex-col justify-center items-center border border-neutral-200 dark:border-neutral-800 p-5 rounded-xl">
        <Image
          src="/tomm.jpg"
          alt="jerry"
          width={200}
          height={200}
          className="rounded-xl h-72 md:h-full w-full object-cover pointer-events-none select-none"
        />
        <div className="flex w-full items-center justify-center mt-6 mb-2 pr-4">
          <AnimatedTooltip items={vsc} />
        </div>
      </div>
    </div>
  );
}
