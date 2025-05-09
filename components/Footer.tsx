"use client";

import { footerLinks } from "@/data";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";
import Link from "next/link";
import { footerIcons } from "../data/index";

const Footer = () => {
  const { user } = useAuthStore();
  const iconClass =
    "text-neutral-900/80 transition-all ease-in-out duration-300 hover:text-neutral-900 dark:text-neutral-50 dark:hover:text-neutral-200";

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
              <span className="select-none pointer-events-none text-lg font-medium text-neutral-900 dark:text-neutral-50">
                StudyStack
              </span>
            </Link>
          </div>
          <div className="flex items-center justify-center flex-wrap lg:grid lg:grid-cols-4 gap-5 text-center">
            {footerLinks.map((item, _) => (
              <Link
                key={_}
                target="_blank"
                href={item.href}
                className="text-base text-neutral-900/80 transition-all ease-in-out duration-300 hover:text-neutral-900 dark:text-neutral-50 dark:hover:text-neutral-200"
              >
                {item.title}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            {footerIcons.map(({ href, icon: Icon, label }) => (
              <div key={label}>
                <a
                  href={href}
                  rel="noreferrer"
                  target="_blank"
                  className={iconClass}
                >
                  <span className="sr-only">{label}</span>
                  <Icon className="size-6 select-none pointer-events-none" />
                </a>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="font-normal text-sm text-black/60 dark:text-white/60 text-center">
            &copy; {new Date().getFullYear()} StudyStack by{" "}
            <Link
              className="hover:underline hover:underline-offset-4 text-black/80 dark:text-white/80 transition-all ease-in-out duration-300"
              href="https://poly.kkwagh.edu.in/"
              target="_blank"
            >
              K.K.Wagh Polytechnic.
            </Link>
            <br /> All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
