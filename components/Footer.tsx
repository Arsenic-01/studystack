"use client";

import { footerLinks } from "@/data";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { footerIcons } from "../data/index";
import { useAuthStore } from "@/store/authStore";

const Footer = () => {
  const { user } = useAuthStore();
  return (
    <div>
      <div className="flex flex-col justify-center items-center gap-16  pt-16 pb-10 border-t-1 light:border-[#B4B4B4]/50 dark:border-neutral-800">
        <div className="flex flex-col md:flex-row justify-center items-center gap-10 md:gap-20 lg:gap-32  w-full mx-auto px-5">
          <div className="flex items-center">
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
              <span className="text-lg font-medium text-neutral-900 dark:text-neutral-50">
                StudyStack
              </span>
            </Link>
          </div>
          <div className="flex items-center justify-center flex-wrap lg:grid lg:grid-cols-4 gap-5 text-center">
            {footerLinks.map((item, _) => (
              <Link
                key={_}
                href={item.href}
                className="text-base text-neutral-900/80 transition-all ease-in-out duration-300 hover:text-neutral-900 dark:text-neutral-50 dark:hover:text-neutral-200"
              >
                {item.title}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            {footerIcons.map((item, _) => (
              <Link
                href={item.href}
                className="text-base text-neutral-900/80 hover:text-neutral-900 dark:text-neutral-50 dark:hover:text-neutral-200"
                key={_}
              >
                <Image
                  src={item.icon}
                  alt={item.name}
                  width={25}
                  height={25}
                  className="opacity-80 dark:invert hover:opacity-100 transition-all ease-in-out duration-300"
                />
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="font-normal text-sm text-black/60 dark:text-white/60 text-center">
            {" "}
            &copy; {new Date().getFullYear()} Study Stack. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
