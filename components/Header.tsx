"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import LoginButton from "./misc/Button";
import { ThemeToggle } from "./ThemeSwitcher";
import { AnimatePresence, motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { twMerge } from "tailwind-merge";

const ProfileCard = dynamic(() => import("./ProfileCard"), { ssr: false });

const navLinks = [
  { name: "About", href: "/about" },
  {
    name: "Contact",
    href: "https://docs.google.com/forms/d/e/1FAIpQLSeCgACy0cfy08L_CGsxputmIIqvh-aD4uUE7B-sX1oIzqwZ9g/viewform?usp=sharing",
  },
  { name: "FAQs", href: "/home#faq" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, user, setUser } = useAuthStore();

  useEffect(() => {
    if (!user) {
      fetch("/api/session", {
        method: "POST", // Change to POST
        credentials: "include",
      })
        .then((res) => (res.ok ? res.json() : Promise.reject()))
        .then((data) => setUser(data.user))
        .catch(() => setUser(null));
    }
  }, [user, setUser]);
  return (
    <nav className="fixed top-0 w-full px-5 z-50">
      <div
        suppressHydrationWarning
        className="backdrop-blur-lg max-w-5xl mx-auto bg-white/80 dark:bg-neutral-950/50 border-[0.1px] border-neutral-300 sm:border-neutral-300 dark:border-neutral-800 rounded-xl py-2 mt-5 sm:mt-7 px-3 sm:pl-5 sm:pr-3"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 justify-end items-center">
          {/* Logo */}
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex justify-center items-center gap-7">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={twMerge(
                  !isLoggedIn && item.name === "FAQs" && "hidden",
                  `text-lg text-neutral-900/80 hover:text-neutral-900 dark:text-neutral-50 dark:hover:text-neutral-50`
                )}
              >
                {item.name}
              </Link>
            ))}
            {isLoggedIn && user && user.role === "admin" && (
              <Link
                href={`/admin/${user.userId}`}
                className="text-lg text-neutral-900/80 hover:text-neutral-900 dark:text-neutral-50 dark:hover:text-neutral-50"
              >
                Admin
              </Link>
            )}
          </div>

          {/* Auth & Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 justify-end">
            {/* Mobile Menu Toggle */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle />
              {isLoggedIn && user && <ProfileCard user={user} />}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-menu hover:cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
              >
                <line
                  x1="3"
                  y1="6"
                  x2="21"
                  y2="6"
                  className={twMerge(
                    "origin-left transition duration-150",
                    isOpen && "rotate-45 -translate-y-1"
                  )}
                ></line>
                <line
                  x1="3"
                  y1="12"
                  x2="21"
                  y2="12"
                  className={twMerge(
                    "transition duration-150",
                    isOpen && "opacity-0"
                  )}
                ></line>
                <line
                  x1="3"
                  y1="18"
                  x2="21"
                  y2="18"
                  className={twMerge(
                    "origin-left transition duration-150",
                    isOpen && "-rotate-45 translate-y-1"
                  )}
                ></line>
              </svg>
            </div>

            {/* Desktop Profile/Login */}
            <div className="hidden md:flex items-center gap-2 md:gap-3">
              <ThemeToggle />
              {!isLoggedIn ? (
                <LoginButton text="Login" />
              ) : (
                <ProfileCard user={user!} />
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col items-center gap-4 md:hidden pb-5 pt-7">
                {isLoggedIn && user && user.role === "admin" && (
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

                {!isLoggedIn && <LoginButton text="Login" className="w-full" />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Header;
