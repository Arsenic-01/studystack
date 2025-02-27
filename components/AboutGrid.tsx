"use client";

import Image from "next/image";
import { AnimatedTooltip } from "./ui/animated-tooltip";
import { tsc, vsc } from "@/data";
import { Chip } from "@heroui/react";

export function AboutGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-5 lg:grid-cols-4 gap-10 sm:gap-5 md:gap-10">
      <div className=" sm:col-span-2 lg:col-span-1 flex flex-col justify-center items-center border border-neutral-200 dark:border-neutral-800 p-5 rounded-xl">
        <Image
          src="/pfp1.jpg"
          alt="jerry"
          width={200}
          height={200}
          priority
          loading="eager"
          className="rounded-xl h-72 md:h-full w-full object-cover pointer-events-none select-none"
        />
        <div className="flex w-full items-center justify-center mt-6 mb-2 pr-4">
          <AnimatedTooltip items={vsc} />
        </div>
      </div>
      <div className="sm:col-span-3 lg:col-span-3 p-5 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-center rounded-xl">
        <p className="text-lg font-bold tracking-tighter">
          &quot;As a curious and driven student, I thrive on learning and
          building innovative solutions. I have a deep passion for coding,
          software development, and tackling complex challenges. Constantly
          exploring new technologies, I strive to blend creativity with
          problem-solving to create meaningful projects. My enthusiasm for tech
          keeps me pushing boundaries and growing every day. 💡🚀 &quot;
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
          <Chip color="default">Auth</Chip>
          <Chip color="primary">S3 Storage</Chip>
        </div>
      </div>

      <div className="sm:col-span-3 lg:col-span-3 p-5 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-center rounded-xl">
        <p className="text-lg font-bold tracking-tighter">
          &quot; I am a passionate, versatile student, always eager to learn and
          innovate. I enjoy working on coding projects, software development,
          and problem-solving, constantly exploring new technologies. My
          dedication to both studies and hands-on projects drives me to excel
          and push my limits in the tech field. 🚀 &quot;
        </p>
        <div className="mt-5 flex flex-col  items-end">
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
          src="/tpfp.jpg"
          alt="jerry"
          width={200}
          height={200}
          priority
          loading="eager"
          className="rounded-xl h-72 md:h-full w-full object-cover pointer-events-none select-none"
        />
        <div className="flex w-full items-center justify-center mt-6 mb-2 pr-4">
          <AnimatedTooltip items={tsc} />
        </div>
      </div>
    </div>
  );
}
