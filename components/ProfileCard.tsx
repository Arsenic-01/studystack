// ProfileCard.tsx
import { Profile } from "@/lib/appwrite_types";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import React, { useContext } from "react";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const ProfileCard = ({ user }: { user: Profile }) => {
  const { setIsLoggedIn } = useContext(UserContext)!;
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      setIsLoggedIn(false);
      toast.success("Logout Successful 🎉");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div>
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Avatar
            isBordered
            as="button"
            className="transition-transform"
            color="secondary"
            name={user.name}
            size="sm"
            src="/tom.jpg"
          />
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Profile Actions"
          className="flex flex-col gap-10 max-w-sm w-full"
          variant="bordered"
        >
          <DropdownItem key="profile" className="flex flex-col gap-4">
            <p className="font-semibold">Signed in as {user.name}</p>
            <p className="font-semibold">Email: {user.email}</p>
            <p className="font-semibold">Prn No: {user.prnNo}</p>
          </DropdownItem>
          <DropdownItem
            key="logout"
            as="button"
            className="bg-red-500 text-white "
            onPress={handleLogout}
          >
            Logout
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default ProfileCard;
