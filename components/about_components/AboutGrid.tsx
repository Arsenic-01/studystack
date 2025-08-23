"use client";

import {
  adarsh_ps,
  asc,
  tanay_ps,
  tsc,
  vedant_ps,
  vsc,
  yadnesh_ps,
  ysc,
} from "@/data";
import { Cpu, FileQuestionIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AnimatedTooltip } from "./about_helper_components/AnimatedToolTip";

const skills = [
  {
    name: "JavaScript",
    image: "/about_tooltip_logos/Python.png",
  },
  {
    name: "TypeScript",
    image: "/about_tooltip_logos/TypeScript.png",
  },
  {
    name: "React",
    image: "/about_tooltip_logos/React.png",
  },
  {
    name: "Next.js",
    image: "/about_tooltip_logos/Nextjs.png",
  },
  {
    name: "Tailwind CSS",
    image: "/about_tooltip_logos/Tailwind.png",
  },
  {
    name: "Git",
    image: "/about_tooltip_logos/Git.png",
  },
  {
    name: "GitHub",
    image: "/about_tooltip_logos/Git.png",
  },

  {
    name: "Appwrite",
    image: "/about_tooltip_logos/Appwrite.png",
  },

  {
    name: "Visual Studio Code",
    image: "/about_tooltip_logos/VSC.png",
  },
  {
    name: "Postman",
    image: "/about_tooltip_logos/Postman.png",
  },
];

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

      <div className="sm:col-span-3 lg:col-span-3 p-5 flex flex-col justify-center rounded-xl border border-neutral-200 dark:border-neutral-800">
        <div className="grid grid-cols-2 items-start gap-10 justify-between flex-col">
          <div className="relative ">
            <div className="relative w-full max-w-xs mx-auto">
              {/* <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/25 to-indigo-500/25 rounded-xl blur-xl -z-10"></div> */}
              <div className="glass-card rounded-xl py-3 relative overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-lg font-medium">Problem solved</div>
                  <FileQuestionIcon className="h-5 w-5 text-chart-1" />
                </div>

                <div className="flex flex-wrap gap-2">
                  {vedant_ps.map((i) => (
                    <div
                      className="rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-4 py-1"
                      key={i.id}
                    >
                      {i.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="relative ">
            <div className="relative w-full max-w-xs mx-auto">
              {/* <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/25 to-indigo-500/25 rounded-xl blur-xl -z-10"></div> */}
              <div className="glass-card rounded-xl py-3 relative overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-lg font-medium">Techstack Learnt</div>
                  <Cpu className="h-5 w-5 text-chart-1" />
                </div>

                <div className="flex flex-wrap gap-2">
                  {skills.map((i, _) => (
                    <div
                      className="rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-4 py-1"
                      key={_}
                    >
                      {i.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-5 justify-between mt-5">
          <div className=" flex">
            <p className="text-lg font-semibold tracking-tighter">
              &quot; I am a dedicated Late Comer! 🕔 &quot;
            </p>
          </div>
          <div className=" flex flex-col  items-end">
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
        </div>
      </div>

      {/* About Tanay */}

      <div className="sm:col-span-3 lg:col-span-3 p-5 flex flex-col justify-center rounded-xl border border-neutral-200 dark:border-neutral-800">
        <div className="grid grid-cols-2 items-start gap-10 justify-between flex-col">
          <div className="relative ">
            <div className="relative w-full max-w-xs mx-auto">
              {/* <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/25 to-indigo-500/25 rounded-xl blur-xl -z-10"></div> */}
              <div className="glass-card rounded-xl py-3 relative overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-lg font-medium">Problem solved</div>
                  <FileQuestionIcon className="h-5 w-5 text-chart-1" />
                </div>

                <div className="flex flex-wrap gap-2">
                  {tanay_ps.map((i) => (
                    <div
                      className="rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-4 py-1"
                      key={i.id}
                    >
                      {i.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="relative ">
            <div className="relative w-full max-w-xs mx-auto">
              {/* <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/25 to-indigo-500/25 rounded-xl blur-xl -z-10"></div> */}
              <div className="glass-card rounded-xl py-3 relative overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-lg font-medium">Techstack Learnt</div>
                  <Cpu className="h-5 w-5 text-chart-1" />
                </div>

                <div className="flex flex-wrap gap-2">
                  {skills.map((i, _) => (
                    <div
                      className="rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-4 py-1"
                      key={_}
                    >
                      {i.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-5 justify-between mt-5">
          <div className=" flex">
            <p className="text-lg font-semibold tracking-tighter">
              &quot; I am a dedicated Low-Battery Guy! 🪫 &quot;
            </p>
          </div>
          <div className=" flex flex-col  items-end">
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
        </div>
      </div>

      {/* Tanay Image */}

      <div className="sm:col-span-2 lg:col-span-1 flex flex-col justify-center items-center border border-neutral-200 dark:border-neutral-800 p-5 rounded-xl">
        <Image
          src="/team/user_pfp/tanay.jpeg"
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

      <div className="sm:col-span-3 lg:col-span-3 p-5 flex flex-col justify-center rounded-xl border border-neutral-200 dark:border-neutral-800">
        <div className="grid grid-cols-2 items-start gap-10 justify-between flex-col">
          <div className="relative ">
            <div className="relative w-full max-w-xs mx-auto">
              {/* <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/25 to-indigo-500/25 rounded-xl blur-xl -z-10"></div> */}
              <div className="glass-card rounded-xl py-3 relative overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-lg font-medium">Problem solved</div>
                  <FileQuestionIcon className="h-5 w-5 text-chart-1" />
                </div>

                <div className="flex flex-wrap gap-2">
                  {adarsh_ps.map((i) => (
                    <div
                      className="rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-4 py-1"
                      key={i.id}
                    >
                      {i.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="relative ">
            <div className="relative w-full max-w-xs mx-auto">
              {/* <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/25 to-indigo-500/25 rounded-xl blur-xl -z-10"></div> */}
              <div className="glass-card rounded-xl py-3 relative overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-lg font-medium">Techstack Learnt</div>
                  <Cpu className="h-5 w-5 text-chart-1" />
                </div>

                <div className="flex flex-wrap gap-2">
                  {skills.map((i, _) => (
                    <div
                      className="rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-4 py-1"
                      key={_}
                    >
                      {i.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-5 justify-between mt-5">
          <div className=" flex">
            <p className="text-lg font-semibold tracking-tighter">
              &quot; I am a dedicated Trip Skipper! ❌ &quot;
            </p>
          </div>
          <div className=" flex flex-col  items-end">
            <div className="font-semibold">Adarsh S. Tile</div>
            <div className="text-sm flex flex-col items-end text-neutral-700 dark:text-white/70">
              TYCM-MAC 2025
              <Link
                className="hover:underline hover:underline-offset-4 text-neutral-900 dark:text-white/80"
                href={"https://wa.me/7588038469"}
              >
                +91 7588038469
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* About Yadnesh */}

      <div className="sm:col-span-3 lg:col-span-3 p-5 flex flex-col justify-center rounded-xl border border-neutral-200 dark:border-neutral-800">
        <div className="grid grid-cols-2 items-start gap-10 justify-between flex-col">
          <div className="relative ">
            <div className="relative w-full max-w-xs mx-auto">
              {/* <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/25 to-indigo-500/25 rounded-xl blur-xl -z-10"></div> */}
              <div className="glass-card rounded-xl py-3 relative overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-lg font-medium">Problem solved</div>
                  <FileQuestionIcon className="h-5 w-5 text-chart-1" />
                </div>

                <div className="flex flex-wrap gap-2">
                  {yadnesh_ps.map((i) => (
                    <div
                      className="rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-4 py-1"
                      key={i.id}
                    >
                      {i.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="relative ">
            <div className="relative w-full max-w-xs mx-auto">
              {/* <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/25 to-indigo-500/25 rounded-xl blur-xl -z-10"></div> */}
              <div className="glass-card rounded-xl py-3 relative overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-lg font-medium">Techstack Learnt</div>
                  <Cpu className="h-5 w-5 text-chart-1" />
                </div>

                <div className="flex flex-wrap gap-2">
                  {skills.map((i, _) => (
                    <div
                      className="rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-4 py-1"
                      key={_}
                    >
                      {i.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-5 justify-between mt-5">
          <div className=" flex">
            <p className="text-lg font-semibold tracking-tighter">
              &quot; I am a dedicated CEO! 🫡 &quot;
            </p>
          </div>
          <div className=" flex flex-col  items-end">
            <div className="font-semibold">Yadnesh Udar</div>
            <div className="text-sm flex flex-col items-end text-neutral-700 dark:text-white/70">
              TYCM-MAC 2025
              <Link
                className="hover:underline hover:underline-offset-4 text-neutral-900 dark:text-white/80"
                href={"https://wa.me/7030075996"}
              >
                +91 7030075996
              </Link>
            </div>
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
