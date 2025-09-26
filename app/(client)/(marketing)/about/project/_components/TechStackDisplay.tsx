// components/project_components/TechStackDisplay.tsx

"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type TechItem = {
  name: string;
  logo: string;
  /**
   * Controls the color inversion for visibility in different themes.
   * - 'dark': Inverts the color only in dark mode (for dark logos on light bg).
   * - 'light': Inverts the color only in light mode (for light logos on light bg).
   * - 'none': Never inverts the color (for full-color logos).
   */
  inversion?: "dark" | "light" | "none";
};

const techCategories: { [key: string]: TechItem[] } = {
  "Frontend & UI/UX": [
    {
      name: "Next.js",
      logo: "https://cdn.jsdelivr.net/gh/Arsenic-01/studystack/assets/skill/Next.js.svg",
      inversion: "light",
    },
    {
      name: "React",
      logo: "https://cdn.jsdelivr.net/gh/Arsenic-01/studystack/assets/skill/React.svg",
      inversion: "none",
    },
    {
      name: "TypeScript",
      logo: "https://cdn.jsdelivr.net/gh/Arsenic-01/studystack/assets/skill/TypeScript.svg",
      inversion: "none",
    },
    {
      name: "Tailwind CSS",
      logo: "https://cdn.jsdelivr.net/gh/Arsenic-01/studystack/assets/skill/TailwindCSS.svg",
      inversion: "none",
    },
    {
      name: "shadcn/ui",
      logo: "https://cdn.jsdelivr.net/gh/Arsenic-01/studystack/assets/skill/ShadcnUI.svg",
      inversion: "dark",
    },
    {
      name: "Figma",
      logo: "https://cdn.jsdelivr.net/gh/Arsenic-01/studystack/assets/skill/Figma.svg",
      inversion: "none",
    },
    {
      name: "Motion",
      logo: "https://cdn.jsdelivr.net/gh/Arsenic-01/studystack/assets/skill/Motion.svg",
      inversion: "dark",
    },
    {
      name: "Aceternity",
      logo: "https://cdn.jsdelivr.net/gh/Arsenic-01/studystack/assets/skill/Aceternity.png",
      inversion: "dark",
    },
    {
      name: "MagicUI",
      logo: "https://cdn.jsdelivr.net/gh/Arsenic-01/studystack/assets/skill/MagicUI.svg",
      inversion: "none",
    },
  ],
  "State Management & Validation": [
    {
      name: "TanStack Query",
      logo: "https://cdn.jsdelivr.net/gh/Arsenic-01/studystack/assets/skill/ReactQuery.svg",
      inversion: "none",
    },
    {
      name: "React Hook Form",
      logo: "https://cdn.jsdelivr.net/gh/Arsenic-01/studystack/assets/skill/ReactHookForm.svg",
      inversion: "none",
    },
    {
      name: "NextAuth",
      logo: "https://cdn.jsdelivr.net/gh/Arsenic-01/studystack/assets/skill/NextAuth.png",
      inversion: "none",
    },
    {
      name: "JWT",
      logo: "https://cdn.jsdelivr.net/gh/Arsenic-01/studystack/assets/skill/JWT.svg",
      inversion: "none",
    },
    {
      name: "Zod",
      logo: "https://cdn.jsdelivr.net/gh/Arsenic-01/studystack/assets/skill/Zod.svg",
      inversion: "none",
    },
  ],
  "Backend & Database": [
    {
      name: "Appwrite",
      logo: "https://cdn.jsdelivr.net/gh/Arsenic-01/studystack/assets/skill/Appwriter.svg",
      inversion: "none",
    },
    {
      name: "Node.js",
      logo: "https://cdn.jsdelivr.net/gh/Arsenic-01/studystack/assets/skill/Node.js.svg",
      inversion: "none",
    },
    {
      name: "Drive API",
      logo: "https://cdn.jsdelivr.net/gh/Arsenic-01/studystack/assets/skill/Drive.svg",
      inversion: "none",
    },
    {
      name: "Serverless Functions",
      logo: "https://cdn.jsdelivr.net/gh/Arsenic-01/studystack/assets/skill/Lambda.svg",
      inversion: "none",
    },
  ],
  "Deployment & Tooling": [
    {
      name: "Vercel",
      logo: "https://cdn.jsdelivr.net/gh/Arsenic-01/studystack/assets/skill/Vercel.svg",
      inversion: "light",
    },
    {
      name: "Turbopack",
      logo: "https://cdn.jsdelivr.net/gh/Arsenic-01/studystack/assets/skill/TurboRepo.svg",
      inversion: "dark",
    },
    {
      name: "Postman",
      logo: "https://cdn.jsdelivr.net/gh/Arsenic-01/studystack/assets/skill/Postman.svg",
      inversion: "none",
    },
    {
      name: "GitHub",
      logo: "https://cdn.jsdelivr.net/gh/Arsenic-01/studystack/assets/skill/GitHub.svg",
      inversion: "dark",
    },
    {
      name: "Docker",
      logo: "https://cdn.jsdelivr.net/gh/Arsenic-01/studystack/assets/skill/Docker.svg",
      inversion: "none",
    },
  ],
  "Other tools": [
    {
      name: "Algolia",
      logo: "https://cdn.jsdelivr.net/gh/Arsenic-01/studystack/assets/skill/Algolia.svg",
      inversion: "none",
    },
    {
      name: "HeroUI",
      logo: "https://cdn.jsdelivr.net/gh/Arsenic-01/studystack/assets/skill/HeroUI.svg",
      inversion: "dark",
    },
    {
      name: "PostHog",
      logo: "https://cdn.jsdelivr.net/gh/Arsenic-01/studystack/assets/skill/Posthog.svg",
      inversion: "none",
    },
    {
      name: "Sentry",
      logo: "https://cdn.jsdelivr.net/gh/Arsenic-01/studystack/assets/skill/Sentry.svg",
      inversion: "none",
    },
    {
      name: "Resend",
      logo: "https://cdn.jsdelivr.net/gh/Arsenic-01/studystack/assets/skill/Resend.svg",
      inversion: "dark",
    },
  ],
};

export default function TechStackDisplay() {
  return (
    <section id="tech-stack" className="w-full max-w-6xl py-12">
      <div className="text-center mb-16 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Our Advanced Technology Stack
        </h2>
        <p className="mt-4 text-lg text-neutral-700 dark:text-neutral-400 max-w-3xl mx-auto">
          We leverage cutting-edge tools and frameworks to ensure StudyStack is
          performant, scalable, and a joy to develop on.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-y-5 lg:gap-y-7 gap-x-7">
        {Object.entries(techCategories).map(([category, techs]) => (
          <div
            key={category}
            className="p-4 border border-neutral-300 dark:border-neutral-800 rounded-xl bg-card/50 shadow-sm"
          >
            <h3 className="text-xl font-bold mt-2 mb-3 text-center text-blue-600 dark:text-blue-400">
              {category}
            </h3>
            <div className="grid grid-cols-3 gap-4 justify-items-center">
              {techs.map((tech) => {
                let inversionClass = "";
                switch (tech.inversion) {
                  case "light":
                    inversionClass =
                      "invert dark:invert-0 pointer-events-none select-none";
                    break;
                  case "dark":
                    inversionClass =
                      "dark:invert pointer-events-none select-none";
                    break;
                  case "none":
                  default:
                    inversionClass = "pointer-events-none select-none";
                    break;
                }

                return (
                  <motion.div
                    key={tech.name}
                    className="flex flex-col items-center gap-2 p-3 w-full h-28 justify-center rounded-lg "
                  >
                    <Image
                      src={tech.logo}
                      alt={`${tech.name} logo`}
                      width={40}
                      height={40}
                      className={inversionClass}
                      loading="lazy"
                    />
                    <span className="text-xs font-medium text-center text-foreground mt-1">
                      {tech.name}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
