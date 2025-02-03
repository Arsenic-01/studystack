"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useContext, useState } from "react";
import dynamic from "next/dynamic";
import LoginButton from "./misc/Button";
import { ThemeToggle } from "./ThemeSwitcher";
import { AnimatePresence, motion } from "framer-motion";
import { UserContext } from "@/context/UserContext";

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

  return (
    <nav className="fixed top-0 w-full px-5 z-50">
      <div className="backdrop-blur-xl max-w-6xl mx-auto dark:bg-neutral-950/70 border border-[#B4B4B4]/50 dark:border-white/20 rounded-xl py-2 mt-5 sm:mt-7 px-3 sm:pl-5 sm:pr-3">
        <div className="grid grid-cols-2 md:grid-cols-3 justify-end items-center">
          {/* Logo */}
          <div className="flex items-center gap-7">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt="Logo"
                width={140}
                height={38}
                priority
                className="select-none pointer-events-none dark:invert"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="justify-center items-center gap-7 hidden md:flex">
            {navLink.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-lg text-neutral-900/80 hover:text-neutral-900 dark:text-neutral-50 dark:hover:text-neutral-50 transition-all duration-200"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-3 justify-end">
            <div className="sm:hidden flex items-center gap-2">
              <ThemeToggle />
              {isLoggedIn && user ? (
                <ProfileCard user={user} handleLogout={handleLogout} />
              ) : (
                <LoginButton text="Login" />
              )}
              <button
                aria-label="Toggle Menu"
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-white focus:ring-black"
              >
                <motion.div
                  initial={false}
                  animate={isOpen ? { rotate: 90 } : { rotate: 0 }}
                  transition={{ duration: 0.2 }}
                >
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
                  >
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </svg>
                </motion.div>
              </button>
            </div>

            {/* Desktop User Controls */}
            <div className="hidden sm:flex items-center gap-2">
              <ThemeToggle />
              {isLoggedIn && user ? (
                <ProfileCard user={user} handleLogout={handleLogout} />
              ) : (
                <LoginButton text="Login" />
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col items-center justify-center gap-4 sm:hidden pb-5 pt-7">
                {navLink.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-lg text-neutral-900/80 hover:text-neutral-900 dark:text-neutral-50 dark:hover:text-neutral-50 w-full text-center rounded-xl py-2 dark:active:bg-neutral-800 dark:hover:bg-neutral-800 active:bg-neutral-200 hover:bg-neutral-200 transition-all ease-in-out duration-200"
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
