"use client";

import SearchBar from "@/components/SearchBar";
import Heartbeat from "@/functions/Heartbeat";
import useSessionQuery from "@/hooks/useSessionQuery";
import { useAuthStore } from "@/store/authStore";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Import usePathname
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { ThemeToggle } from "./navbar_helper_components/ThemeSwitcher";
import { useSession } from "next-auth/react";

const ProfileCard = dynamic(
  () => import("./navbar_helper_components/ProfileCard"),
  { ssr: false }
);

// Updated navLinks to include "Project"
const navLinks = [
  { name: "About", href: "/about" },
  { name: "Project", href: "/about/project" },
  { name: "Contact", href: "/contact" },
  { name: "FAQs", href: "/home#faq" },
];

const Header = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, user } = useAuthStore();
  const pathname = usePathname(); // Get the current path

  useSessionQuery();

  return (
    <nav className="fixed top-0 w-full px-5 z-50">
      <div
        suppressHydrationWarning
        className="backdrop-blur-lg max-w-5xl mx-auto bg-white/80 dark:bg-neutral-950/50 border-[0.1px] border-neutral-300 sm:border-neutral-300 dark:border-neutral-800 rounded-xl py-2 mt-5 sm:mt-7 px-3 sm:pl-5 sm:pr-3"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 justify-end items-center">
          {/* LEFT: Logo */}
          <div className="flex items-center gap-7">
            <Link
              href={user ? "/home" : "/"}
              className="inline-flex gap-1 items-center justify-center"
            >
              <Image
                src="/title_logo.png"
                alt="Study Stack Logo"
                width={35}
                height={35}
                className="select-none pointer-events-none invert dark:invert-0"
              />
              <span className="select-none pointer-events-none text-lg font-medium text-neutral-900 dark:text-neutral-50">
                StudyStack
              </span>
            </Link>
          </div>

          {/* ✅ CENTER: Navigation links (desktop only) */}
          <div className="hidden md:flex justify-center items-center gap-7">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={twMerge(
                  // Vercel-like styling for nav links
                  "text-sm transition-colors text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white",
                  pathname === item.href && "text-black dark:text-white", // Active link style
                  !isLoggedIn && item.name === "FAQs" && "hidden" // Keep existing conditional logic
                )}
              >
                {item.name}
              </Link>
            ))}
            {isLoggedIn && user && user.role === "admin" && (
              <Link
                href={`/admin/${user.userId}`}
                className={twMerge(
                  // Vercel-like styling for admin link
                  "text-sm transition-colors text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white",
                  pathname.startsWith("/admin") && "text-black dark:text-white" // Active link style
                )}
              >
                Admin
              </Link>
            )}
          </div>

          {/* ✅ RIGHT: Search + Theme toggle + Profile */}
          <div className="flex items-center gap-2 sm:gap-3 justify-end">
            {/* 🔹 SearchBar now here, visible in both mobile & desktop */}
            {isLoggedIn && user && <SearchBar />}

            {/* Theme toggle */}
            <ThemeToggle />

            {/* Profile / Login */}
            <div>
              {session?.user ? (
                <ProfileCard />
              ) : (
                <Link
                  href="/"
                  className="px-3 py-1 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile menu toggle */}
            <div className="md:hidden flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-menu hover:cursor-pointer ml-1"
                onClick={() => setIsOpen(!isOpen)}
              >
                <line
                  x1="3"
                  y1="6"
                  x2="21"
                  y2="6"
                  className={twMerge(
                    "origin-left transition duration-75",
                    isOpen && "rotate-45 -translate-y-1"
                  )}
                ></line>
                <line
                  x1="3"
                  y1="12"
                  x2="21"
                  y2="12"
                  className={twMerge(
                    "transition duration-75",
                    isOpen && "opacity-0"
                  )}
                ></line>
                <line
                  x1="3"
                  y1="18"
                  x2="21"
                  y2="18"
                  className={twMerge(
                    "origin-left transition duration-75",
                    isOpen && "-rotate-45 translate-y-1"
                  )}
                ></line>
              </svg>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              transition={{ duration: 0.01, ease: "easeInOut" }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col items-center gap-4 md:hidden pb-5 pt-7">
                {isLoggedIn && user?.role === "admin" && (
                  <Link
                    href={`/admin/${user.userId}`}
                    className="text-neutral-900/80 hover:text-neutral-900 dark:text-neutral-50 dark:hover:text-neutral-50 w-full text-center rounded-xl py-1 dark:active:bg-neutral-800 dark:hover:bg-neutral-800 active:bg-neutral-200 hover:bg-neutral-200 transition-all ease-in-out"
                  >
                    Admin
                  </Link>
                )}
                {navLinks.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={twMerge(
                      !isLoggedIn && item.name === "FAQs" && "hidden",
                      "text-neutral-900/80 hover:text-neutral-900 dark:text-neutral-50 dark:hover:text-neutral-50 w-full text-center rounded-xl py-1 dark:active:bg-neutral-800 dark:hover:bg-neutral-800 active:bg-neutral-200 hover:bg-neutral-200 transition-all ease-in-out"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {isLoggedIn && user && <Heartbeat userId={user.userId} />}
    </nav>
  );
};

export default Header;
