// MemberCard.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import type { TeamMember } from "@/data/team";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface MemberCardProps {
  member: TeamMember;
}

export function MemberCard({ member }: MemberCardProps) {
  return (
    <Dialog>
      <Card className="flex flex-col overflow-hidden hover:shadow-xl dark:hover:shadow-primary/10">
        {/* Profile Image Section */}
        <div className="relative h-56 w-full">
          {member.socials[3].name === "Portfolio" ? (
            <Link
              href={member.socials[3].url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0"
            >
              <Image
                src={member.pfp}
                alt={`Profile picture of ${member.name}`}
                fill
                className="object-cover select-none pointer-events-none"
                loading="eager"
              />
            </Link>
          ) : (
            <Image
              src={member.pfp}
              alt={`Profile picture of ${member.name}`}
              fill
              className="object-cover pointer-events-none select-none"
              loading="eager"
            />
          )}
        </div>

        <div className="flex flex-col flex-grow px-5 py-6">
          <CardHeader className="p-0 space-y-0">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-xl">{member.name}</CardTitle>
              {member.role && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary text-primary-foreground">
                  {member.role}
                </span>
              )}
            </div>
            <CardDescription>{member.classInfo}</CardDescription>
          </CardHeader>

          {/* Quote and Socials */}
          <CardContent className="p-0 pt-3 flex-grow">
            <p className="text-muted-foreground mb-4">{member.quote}</p>
            <div className="flex items-center gap-1">
              <TooltipProvider delayDuration={0}>
                {member.socials.map((social) => (
                  <Tooltip key={social.name}>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" asChild>
                        <Link
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <social.Icon className="h-4 w-4" />
                          <span className="sr-only">{social.name}</span>
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{social.name}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          </CardContent>

          {/* Action Button */}
          <CardFooter className="p-0 pt-6">
            <DialogTrigger asChild>
              <Button className="w-full">
                View Contributions <ArrowUpRight className="h-4 w-4 ml-2" />
              </Button>
            </DialogTrigger>
          </CardFooter>
        </div>
      </Card>

      {/* Dialog Content */}
      <DialogContent className="lg:max-w-lg">
        <DialogHeader className="space-y-0">
          <div className="flex items-center gap-2">
            <DialogTitle className="text-xl font-bold">
              {member.name}
            </DialogTitle>
            {/* Also adding the badge in the dialog for consistency */}
            {member.role && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary text-primary-foreground">
                {member.role}
              </span>
            )}
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 text-start pb-3">
            {member.classInfo}
          </p>
        </DialogHeader>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-4">
          <h3 className="font-semibold text-base">Key Contributions</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {member.contributions.map((task, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 mt-1 text-green-500 flex-shrink-0" />
                <span>{task}</span>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
