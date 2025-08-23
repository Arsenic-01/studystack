"use client";

import { LogOut } from "lucide-react";
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

export default function UserProfilePopover() {
  const { user } = useUser();
  if (!user) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarFallback>
              {user.name ? getInitials(user.name) : "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-64 p-0 text-sm" align="end">
        <div className="px-3 pt-4 pb-3">
          <p className="font-semibold leading-none">{user.name}</p>
          <p className="leading-none text-muted-foreground mt-2">
            {user.email}
          </p>
        </div>

        {("prnNo" in user || "role" in user) && (
          <>
            <Separator />
            <div className="p-3 text-muted-foreground">
              {"prnNo" in user && <p className="mb-1">Prn no: {user.prnNo}</p>}
              {"role" in user && <p>Role: {capitalize(String(user.role))}</p>}
            </div>
          </>
        )}

        <Separator />

        <div className="p-1">
          <Button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full justify-between h-9 rounded-sm "
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
