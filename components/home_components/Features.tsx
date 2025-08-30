import { cn } from "@/lib/utils";
import {
  BookOpen,
  CloudCog,
  GaugeCircle,
  LayoutDashboard,
  Shield,
  Zap,
} from "lucide-react";
import type React from "react";

export default function Features() {
  const features = [
    {
      title: "Role-Based Access Control",
      description:
        "Distinct roles for students, teachers, and admins provide secure, tailored access to platform features.",
      icon: <Shield className="w-6 h-6" />,
    },
    {
      title: "Centralized Resource Hub",
      description:
        "All your notes, videos, and resources, perfectly organized by subject in one central location.",
      icon: <BookOpen className="w-6 h-6" />,
    },
    {
      title: "Instant Search",
      description:
        "Instantly find any resource with our powerful, typo-tolerant search powered by Algolia.",
      icon: <Zap className="w-6 h-6" />,
    },
    {
      title: "Powerful Admin Dashboard",
      description:
        "Admins can easily manage all users, oversee content, and monitor detailed platform analytics.",
      icon: <LayoutDashboard className="w-6 h-6" />,
    },
    {
      title: "High Performance & Reliability",
      description:
        "A fast, responsive interface with Sentry error monitoring ensures a smooth and reliable experience.",
      icon: <GaugeCircle className="w-6 h-6" />,
    },
    {
      title: "Secure Cloud Storage",
      description:
        "Secure and scalable cloud storage for all your course materials, powered by Appwrite.",
      icon: <CloudCog className="w-6 h-6" />,
    },
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
        "flex flex-col py-10 relative group/feature border border-neutral-200 dark:border-neutral-900 xl:dark:border-neutral-800",
        "md:border-l-0 md:border-t-0", // Remove left border for first col, top border for first row (only on desktop)
        index % 3 === 0 ? "md:border-l" : "", // Apply left border only for non-first columns (on desktop)
        index < 3 ? "md:border-t" : "" // Apply top border only for non-first row (on desktop)
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
