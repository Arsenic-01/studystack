import Image from "next/image";
import Link from "next/link";
import React from "react";
import LoginButton from "./misc/Button";
import { ThemeToggle } from "./ThemeSwitcher";

const navLink = [
  {
    name: "About",
    href: "#",
  },
  {
    name: "Contact",
    href: "#",
  },
  {
    name: "FAQs",
    href: "#faq",
  },
];

const Header = () => {
  return (
    <nav className="fixed top-0 w-full px-5 z-50">
      <div className="backdrop-blur-xl grid grid-cols-2 md:grid-cols-3 mt-5 sm:mt-7 max-w-6xl mx-auto justify-end items-center pl-3 pr-2 sm:pl-5 sm:pr-3 py-2 border light:border-[#B4B4B4]/50 dark:border-white/20 rounded-xl">
        <div className="flex items-center gap-7">
          <Link href="/" className="inline-block">
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
          <ThemeToggle />
          <LoginButton text="Login" />
        </div>
      </div>
    </nav>
  );
};

export default Header;
