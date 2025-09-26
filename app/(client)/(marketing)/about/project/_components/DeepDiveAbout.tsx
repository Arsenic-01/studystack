// components/project_components/DeepDiveAbout.tsx

import { Lightbulb, Rocket, UsersRound } from "lucide-react";

export default function DeepDiveAbout() {
  return (
    <section id="deep-dive" className="w-full max-w-6xl py-12">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          The Journey Behind StudyStack
        </h2>
        <p className="mt-4 text-lg text-neutral-700 dark:text-neutral-400 max-w-3xl mx-auto">
          From a shared challenge to a robust solution, discover the core
          principles and vision that drive our project.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5 lg:gap-7">
        {/* Problem */}
        <div className="flex flex-col items-center text-center p-6 border border-neutral-300 dark:border-neutral-800 rounded-xl bg-card/50 shadow-sm hover:shadow-md">
          <div className="p-3 mb-6 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
            <Lightbulb className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-foreground">
            The Challenge We Faced
          </h3>
          <p className="text-neutral-700 dark:text-neutral-400">
            In many educational settings, valuable learning materials are often
            fragmented across various platforms, cloud drives, and personal
            archives. This scattered approach leads to wasted time, missed
            resources, and an inefficient learning process for students and
            teachers alike.
          </p>
        </div>

        {/* Solution */}
        <div className="flex flex-col items-center text-center p-6 border border-neutral-300 dark:border-neutral-800 rounded-xl bg-card/50 shadow-sm hover:shadow-md">
          <div className="p-3 mb-6 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400">
            <Rocket className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-foreground">
            Our Innovative Solution
          </h3>
          <p className="text-neutral-700 dark:text-neutral-400">
            StudyStack addresses this by providing a singular, intuitive
            platform where all educational resources—notes, videos, external
            links, and quizzes—can be effortlessly uploaded, organized by
            subject and semester, and securely accessed through a robust
            role-based system.
          </p>
        </div>

        {/* Impact/Vision */}
        <div className="flex flex-col items-center text-center p-6 border border-neutral-300 dark:border-neutral-800 rounded-xl bg-card/50 shadow-sm hover:shadow-md">
          <div className="p-3 mb-6 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400">
            <UsersRound className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-foreground">
            Fostering a Smarter Community
          </h3>
          <p className="text-neutral-700 dark:text-neutral-400">
            Our vision is to empower educational communities with a tool that
            not only centralizes content but also streamlines collaboration,
            enhances accessibility, and ultimately fosters a more engaged and
            efficient learning environment for everyone involved.
          </p>
        </div>
      </div>
    </section>
  );
}
