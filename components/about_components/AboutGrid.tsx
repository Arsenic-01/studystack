"use client";

import Image from "next/image";
import { AnimatedTooltip } from "./about_helper_components/AnimatedToolTip";
import { tsc, vsc, asc, ysc } from "@/data";
import { Chip } from "@heroui/react";
import Link from "next/link";

export function AboutGrid() {
  return (

    

    <div className="grid grid-cols-1 sm:grid-cols-5 lg:grid-cols-4 gap-10 sm:gap-5 md:gap-10">

      {/* Vedant PFP */}

      <div className=" sm:col-span-2 lg:col-span-1 flex flex-col justify-center items-center border border-neutral-200 dark:border-neutral-800 p-5 rounded-xl ">
        <Image
          src="/vedantpfp.jpg"
          alt="pfp for vedant bhor"
          width={200}
          height={200}
          priority
          loading="eager"
          className="rounded-xl h-72 md:h-full w-full object-cover pointer-events-none select-none "
        />
        <div className="flex w-full items-center justify-center mt-6 mb-2 pr-4">
          <AnimatedTooltip items={vsc} />
        </div>
      </div>

      {/* About Vedant */}

      <div className="sm:col-span-3 lg:col-span-3 p-5 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-center rounded-xl ">
        <p className="text-lg font-bold tracking-tighter">
          &quot;As a curious and driven student, I thrive on learning and
          building innovative solutions. I have a deep passion for coding,
          software development, and tackling complex challenges. Constantly
          exploring new technologies, I strive to blend creativity with
          problem-solving to create meaningful projects. My enthusiasm for tech
          keeps me pushing boundaries and growing every day. 💡🚀 &quot;
        </p>
        <div className="mt-5 flex flex-col  items-end">
          <div className="font-semibold">Vedant B. Bhor</div>
          <div className="text-sm flex flex-col items-end text-neutral-700 dark:text-white/70">
            TYCM-Lin 2025
            <Link
              className="hover:underline hover:underline-offset-4 text-neutral-900 dark:text-white/80"
              href={"https://wa.me/919975278911"}
            >
              +91 9975278911
            </Link>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap flex-row gap-1">
          <Chip color="danger">Front End</Chip>
          <Chip color="warning">Back End</Chip>
          <Chip color="success">Database</Chip>
          <Chip color="default">Auth</Chip>
          <Chip color="primary">S3 Storage</Chip>
          <div className="bg-cyan-600/30 py-1 px-3 rounded-full font-semibold text-cyan-900 dark:text-cyan-200 text-sm">
            Handled 95% of the coding
          </div>
          <div className="bg-green-600/30 py-1 px-3 rounded-full hidden md:block font-semibold text-green-900 dark:text-green-200 text-sm">
            Serverless Functions for Auto Session Timeout
          </div>
          <div className="bg-green-600/30 py-1 px-3 rounded-full md:hidden font-semibold text-green-900 dark:text-green-200 text-sm">
            Auto Session Timeout
          </div>
        </div>
      </div>

      {/* About Tanay */}

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
          <div className="text-sm flex flex-col items-end text-neutral-700 dark:text-white/70">
            TYCM-Lin 2025
            <Link
              className="hover:underline hover:underline-offset-4 text-neutral-900 dark:text-white/80"
              href={"https://wa.me/918446663807"}
            >
              +91 8446663807
            </Link>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap flex-row gap-1">
          <Chip color="danger" className="w-fit">
            Front End Designing
          </Chip>
          <Chip color="success">Data Filling</Chip>
        </div>
      </div>

      {/* Tanay Image */}

      <div className="sm:col-span-2 lg:col-span-1 flex flex-col justify-center items-center border border-neutral-200 dark:border-neutral-800 p-5 rounded-xl">
        <Image
          src="/tanaypfp.jpg"
          alt="pfp for tanay hingane"
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
      
      {/* Adarsh PFP */}
      
      <div className=" sm:col-span-2 lg:col-span-1 flex flex-col justify-center items-center border border-neutral-200 dark:border-neutral-800 p-5 rounded-xl">
        <Image
          src="/adarshpfp.jpg"
          alt="pfp for adarsh tile"
          width={200}
          height={200}
          priority
          loading="eager"
          className="rounded-xl h-72 md:h-full w-full object-cover pointer-events-none select-none"
        />
        <div className="flex w-full items-center justify-center mt-6 mb-2 pr-4">
          <AnimatedTooltip items={asc} />
        </div>
      </div>

      {/* About Adarsh */}

      <div className="sm:col-span-3 lg:col-span-3 p-5 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-center rounded-xl">
        <p className="text-lg font-bold tracking-tighter">
          &quot;I am a curious and motivated learner with a strong passion for technology and innovation. I enjoy coding, software development, and solving real-world challenges through creative problem-solving. Always eager to explore new tools and frameworks, I focus on building impactful projects that combine technical skills with fresh ideas. My drive to keep learning and experimenting pushes me to grow every day as a developer. 💡🚀 &quot;
        </p>
        <div className="mt-5 flex flex-col  items-end">
          <div className="font-semibold">Adarsh S. Tile</div>
          <div className="text-sm flex flex-col items-end text-neutral-700 dark:text-white/70">
            TYCM-Mac 2025
            <Link
              className="hover:underline hover:underline-offset-4 text-neutral-900 dark:text-white/80"
              href={"https://wa.me/917588038469"}
            >
              +91 7588038469
            </Link>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap flex-row gap-1">
          <Chip color="danger">Basic Front End</Chip>
          <div className="bg-cyan-600/30 py-1 px-3 rounded-full font-semibold text-cyan-900 dark:text-cyan-200 text-sm">
            Video Editing
          </div>
          <Chip color="warning">Project Documentation</Chip>
          <Chip color="success">Helped Vedant and Tanay</Chip>
          
        </div>
      </div>

      {/* About Yadnesh */}

      <div className="sm:col-span-3 lg:col-span-3 p-5 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-center rounded-xl">
        <p className="text-lg font-bold tracking-tighter">
          &quot; I am a dedicated coder and aspiring software developer with a strong passion for technology, problem-solving, and innovation. Skilled in writing clean and efficient code, I enjoy building projects that not only demonstrate technical expertise but also provide practical, real-world solutions. I am continuously expanding my knowledge of modern tools, frameworks, and best practices, with a focus on delivering impactful and high-quality software. My goal is to combine technical skills with creativity to contribute meaningfully to the world of development 🚀 &quot;
        </p>
        <div className="mt-5 flex flex-col  items-end">
          <div className="font-semibold">Yadnesh Udar</div>
          <div className="text-sm flex flex-col items-end text-neutral-700 dark:text-white/70">
            TYCM-Mac 2025
            <Link
              className="hover:underline hover:underline-offset-4 text-neutral-900 dark:text-white/80"
              href={"https://wa.me/917030075996"}
            >
              +91 7030075996
            </Link>
          </div>
        </div>
      </div>

      {/* Yadnesh Image */}

      <div className="sm:col-span-2 lg:col-span-1 flex flex-col justify-center items-center border border-neutral-200 dark:border-neutral-800 p-5 rounded-xl">
        <Image
          src="/yadneshpfp.jpg"
          alt="pfp for yadnesh udar"
          width={200}
          height={200}
          priority
          loading="eager"
          className="rounded-xl h-72 md:h-full w-full object-cover pointer-events-none select-none"
        />
        <div className="flex w-full items-center justify-center mt-6 mb-2 pr-4">
          <AnimatedTooltip items={ysc} />
        </div>
      </div>

    </div>
  );
}
