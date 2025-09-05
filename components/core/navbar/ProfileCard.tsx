"use client";

import { LogOut, KeyRound } from "lucide-react"; // Import KeyRound icon
import { signOut } from "next-auth/react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/hooks/useUser";
import { SessionUser } from "@/lib/appwrite_types";
import { ChangePasswordDialog } from "../auth/ChangePasswordDialog";

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
};

const capitalize = (s: string) => {
  if (typeof s !== "string" || !s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export default function UserProfilePopover({
  serverUser,
}: {
  serverUser?: SessionUser | null;
}) {
  const { user: clientUser } = useUser();
  const user = serverUser ?? clientUser;
  if (!user) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="relative size-7 lg:size-9 rounded-full"
        >
          <Avatar className="size-7 lg:size-9">
            <AvatarFallback className="text-sm lg:text-base">
              {user.name ? getInitials(user.name) : "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-64 p-0 text-sm" align="end">
        <div className="px-3 pt-4 pb-3">
          <p className="font-semibold leading-none">{user.name}</p>
          <p className="leading-none text-neutral-700 dark:text-neutral-400 mt-2">
            {user.email}
          </p>
        </div>

        {("prnNo" in user || "role" in user) && (
          <>
            <Separator />
            <div className="p-3 text-neutral-700 dark:text-neutral-400">
              {"prnNo" in user && <p className="mb-1">Prn no: {user.prnNo}</p>}
              {"role" in user && <p>Role: {capitalize(String(user.role))}</p>}
            </div>
          </>
        )}

        <Separator />

        <div className="p-1">
          <ChangePasswordDialog>
            <Button
              className="w-full justify-between h-9 rounded-[4px]"
              variant="ghost"
            >
              <span>Change Password</span>
              <KeyRound className="size-3" />
            </Button>
          </ChangePasswordDialog>

          <Button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full justify-between h-9 rounded-[4px]"
            variant="ghost"
          >
            <span>Logout</span>
            <LogOut className="size-3" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
