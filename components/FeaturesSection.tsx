import { cn } from "@/lib/utils";
import {
  BookOpen,
  Database,
  GraduationCap,
  Laptop,
  LayoutDashboard,
  Upload,
} from "lucide-react";
import type React from "react";

export default function FeaturesSection() {
  const features = [
    {
      title: "Centralized Learning Hub",
      description:
        "Access all study materials, notes, and resources in one centralized platform designed specifically for K.K. Wagh Polytechnic students.",
      icon: <BookOpen className="w-6 h-6" />,
    },
    {
      title: "Teacher Uploads",
      description:
        "Teachers can easily upload and manage study materials, ensuring students have access to the most up-to-date course content.",
      icon: <Upload className="w-6 h-6" />,
    },
    {
      title: "Comprehensive Admin Panel",
      description:
        "Powerful administrative tools for user management, content moderation, and detailed analytics of platform usage.",
      icon: <LayoutDashboard className="w-6 h-6" />,
    },
    // {
    //   title: "User Management",
    //   description:
    //     "Efficient user administration with capabilities to add, edit, and manage student and teacher accounts.",
    //   icon: <Users className="w-6 h-6" />,
    // },
    {
      title: "Cloud Storage Integration",
      description:
        "Secure and reliable storage system powered by Appwrite, ensuring fast access to educational resources.",
      icon: <Database className="w-6 h-6" />,
    },
    {
      title: "Modern Tech Stack",
      description:
        "Built with Next.js, Turbopack, and React for optimal performance and a seamless user experience.",
      icon: <Laptop className="w-6 h-6" />,
    },
    {
      title: "Exam Preparation",
      description:
        "Structured content organization helping students excel in coursework and achieve top examination scores.",
      icon: <GraduationCap className="w-6 h-6" />,
    },
    // {
    //   title: "Computer Technology Focus",
    //   description:
    //     "Specialized platform tailored for Computer Technology (CM) department students at K.K. Wagh Polytechnic, Nashik.",
    //   icon: <School className="w-6 h-6" />,
    // },
  ];
  return (
    <div className="flex flex-col justify-center items-center pt-28 pb-10">
      <div className="flex flex-col gap-5  text-center">
        <h1 className="text-5xl 2xl:text-6xl px-5 tracking-tighter font-bold bg-gradient-to-r dark:text-transparent  dark:from-white dark:to-neutral-400 light:from-black light:to-gray-700 bg-clip-text white:text-transparent">
          Features
        </h1>
        <span className="text-lg text-neutral-600 dark:text-neutral-400">
          What makes us different
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative z-10 pt-10 max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <Feature key={feature.title} {...feature} index={index} />
        ))}
      </div>
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col py-10 relative group/feature",
        "border border-neutral-200 dark:border-neutral-900 "
      )}
    >
      {index < 3 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 3 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
