"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useContext, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import LoginButton from "./misc/Button";
import { ThemeToggle } from "./ThemeSwitcher";
import { AnimatePresence, motion } from "framer-motion";
import { UserContext } from "@/context/UserContext";
import { twMerge } from "tailwind-merge";

const ProfileCard = dynamic(() => import("./ProfileCard"), { ssr: false });

const navLink = [
  { name: "About", href: "/" },
  { name: "Contact", href: "/" },
  { name: "FAQs", href: "/#faq" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("Header must be used within a UserContextProvider");
  }

  const { isLoggedIn, user, handleLogout } = userContext;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/session");
        if (!res.ok) {
          console.log("Not authenticated");
          return userContext.setUser(null);
        }
        const data = await res.json();
        userContext.setUser(data.user);
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };

    if (!user) {
      fetchUserData();
    }
  }, [userContext, user]);

  return (
    <nav className="fixed top-0 w-full px-5 z-50">
      <div className="backdrop-blur-xl  max-w-6xl mx-auto dark:bg-neutral-950/70 border border-[#B4B4B4]/50 dark:border-white/20 rounded-xl py-2 mt-5 sm:mt-7 px-3 sm:pl-5 sm:pr-3">
        <div className=" grid grid-cols-2 md:grid-cols-3 justify-end items-center">
          <div className="flex items-center gap-7">
            <Link href={user ? "/home" : "/"} className="inline-block">
              <Image
                src="/logo.png"
                alt="Study Stack Logo"
                width={140}
                height={38}
                className="select-none pointer-events-none dark:invert"
              />
            </Link>
          </div>
          <div className="justify-center items-center gap-7 hidden md:flex">
            {navLink.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className=" text-lg text-neutral-900/80 hover:text-neutral-900 dark:text-neutral-50 dark:hover:text-neutral-50"
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2 sm:gap-3 justify-end">
            <div className="sm:hidden flex items-center gap-2 sm:gap-3 justify-end">
              <ThemeToggle />
              {isLoggedIn && user && (
                <ProfileCard user={user} handleLogout={handleLogout} />
              )}
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
                className="feather feather-menu"
                onClick={() => setIsOpen(!isOpen)}
              >
                <line
                  x1="3"
                  y1="6"
                  x2="21"
                  y2="6"
                  className={twMerge(
                    "origin-left transition",
                    isOpen && "rotate-45 -translate-y-1"
                  )}
                ></line>
                <line
                  x1="3"
                  y1="12"
                  x2="21"
                  y2="12"
                  className={twMerge("transition", isOpen && "opacity-0")}
                ></line>
                <line
                  x1="3"
                  y1="18"
                  x2="21"
                  y2="18"
                  className={twMerge(
                    "origin-left transition",
                    isOpen && "-rotate-45 translate-y-1"
                  )}
                ></line>
              </svg>
            </div>
            <div className="hidden sm:flex items-center gap-2 sm:gap-3 justify-end">
              <ThemeToggle />
              {!isLoggedIn && <LoginButton text="Login" />}
              {isLoggedIn && user && (
                <ProfileCard user={user} handleLogout={handleLogout} />
              )}
            </div>
          </div>
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col items-center justify-center gap-4 sm:hidden pb-5 pt-7">
                {navLink.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-lg text-neutral-900/80 hover:text-neutral-900 dark:text-neutral-50 dark:hover:text-neutral-50 w-full text-center rounded-xl py-1 dark:active:bg-neutral-800 dark:hover:bg-neutral-800 active:bg-neutral-200 hover:bg-neutral-200 transition-all ease-in-out"
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
