"use client";
import { useUser } from "@/hooks/useUser";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export const FuzzyOverlay = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setTheme(
        document.documentElement.classList.contains("dark") ? "dark" : "light"
      );
    }
  }, []);

  return (
    <motion.div
      initial={{ transform: "translateX(-10%) translateY(-10%)" }}
      animate={{
        transform: "translateX(10%) translateY(10%)",
      }}
      transition={{
        repeat: Infinity,
        duration: 0.2,
        ease: "linear",
        repeatType: "mirror",
      }}
      style={{
        backgroundImage:
          theme === "dark"
            ? 'url("https://cdn.jsdelivr.net/gh/Arsenic-01/studystack/assets/not_found_bg/black-noise.png")'
            : 'url("https://cdn.jsdelivr.net/gh/Arsenic-01/studystack/assets/not_found_bg/noise.png")',
      }}
      className="pointer-events-none absolute -inset-[100%] opacity-[15%]"
    />
  );
};

export const NotFoundErrorMessage = () => {
  const { user } = useUser();

  return (
    <div className="relative grid h-screen place-content-center space-y-6 bg-white text-black p-8 dark:bg-black dark:text-neutral-50">
      <p className="text-center text-6xl md:text-7xl  font-bold">
        404-Not Found
      </p>
      <p className="text-center text-neutral-600 dark:text-neutral-400">
        Uh this is awkward. This page doesn&apos;t exist
      </p>
      <div className="flex items-center justify-center gap-3">
        <Link
          target="_blank"
          href="/contact"
          className="w-fit px-4 py-2 font-semibold text-neutral-700 bg-neutral-200 transition-colors hover:bg-neutral-300 dark:text-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700"
        >
          Contact
        </Link>
        <Link
          href={user ? "/home" : "/"}
          className="w-fit bg-black text-white px-4 py-2 font-semibold transition-colors hover:bg-gray-800 dark:bg-neutral-200 dark:text-neutral-700 dark:hover:bg-neutral-50"
        >
          Home
        </Link>
      </div>
    </div>
  );
};
