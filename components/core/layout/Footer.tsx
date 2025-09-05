"use client";

import {
  aboutPopoverLinks,
  footerIcons,
  legalPopoverLinks,
  mainFooterLinks,
} from "@/data/index";
import { useUser } from "@/hooks/useUser";
import Image from "next/image";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

const FooterPopover = ({
  triggerText,
  links,
  className,
}: {
  triggerText: string;
  links: { title: string; href: string }[];
  className?: string;
}) => (
  <Popover>
    <PopoverTrigger asChild>
      <div
        className={clsx(
          "inline-flex items-center gap-1 hover:cursor-pointer",
          className
        )}
      >
        {triggerText}
        <ChevronDown
          className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180"
          aria-hidden="true"
        />
      </div>
    </PopoverTrigger>
    <PopoverContent className="w-48 p-2" align="center">
      <div className="grid gap-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-md p-2 text-sm hover:bg-muted"
          >
            {link.title}
          </Link>
        ))}
      </div>
    </PopoverContent>
  </Popover>
);

const Footer = () => {
  const { user } = useUser();

  const linkClass =
    "text-base text-neutral-900/80 transition-colors ease-in-out duration-300 hover:text-neutral-900 dark:text-neutral-50 dark:hover:text-neutral-300";
  const iconClass =
    "text-neutral-900/80 transition-colors ease-in-out duration-300 hover:text-neutral-900 dark:text-neutral-50 dark:hover:text-neutral-200";

  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-16 border-t border-neutral-300 dark:border-neutral-800 pt-16 pb-10">
        <div className="mx-auto flex w-full flex-col items-center justify-center gap-10 px-5 md:flex-row md:gap-20 lg:gap-32">
          {/* Section 1: Logo */}
          <div className="flex items-center">
            <Link
              href={user ? "/home" : "/"}
              className="inline-flex items-center justify-center gap-1"
            >
              <Image
                src="/title_logo.png"
                alt="Study Stack Logo"
                width={35}
                height={29}
                className="select-none pointer-events-none invert dark:invert-0"
              />
              <span className="select-none text-lg font-medium text-neutral-900 dark:text-neutral-50">
                StudyStack
              </span>
            </Link>
          </div>

          {/* Section 2: Links */}
          <div className="flex flex-wrap items-center justify-center gap-5 text-center">
            {mainFooterLinks.map((item) => (
              <Link
                key={item.title}
                target="_blank"
                href={item.href}
                className={linkClass}
              >
                {item.title}
              </Link>
            ))}
            <FooterPopover
              triggerText="About"
              links={aboutPopoverLinks}
              className={linkClass}
            />
            <FooterPopover
              triggerText="Legal"
              links={legalPopoverLinks}
              className={linkClass}
            />
          </div>

          {/* Section 3: Social Icons */}
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
                  <Icon className="size-6 select-none" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright notice (from original layout) */}
        <div>
          <div className="text-center font-normal text-sm text-black/60 dark:text-white/60">
            &copy; {new Date().getFullYear()} StudyStack by{" "}
            <Link
              className="text-black/80 transition-all duration-300 ease-in-out hover:underline hover:underline-offset-4 dark:text-white/80"
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
