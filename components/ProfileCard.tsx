// ProfileCard.tsx
import { UserProps } from "@/lib/appwrite_types";
import { useAuthStore } from "@/store/authStore";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { Avatar, AvatarImage } from "./ui/avatar";

const ProfileCard = ({ user }: { user: UserProps }) => {
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });

      logout(); // Zustand store logout
      localStorage.setItem("logout", "true");
      setTimeout(() => localStorage.removeItem("logout"), 500);

      toast.success("Logout successful 🎉");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "logout" && event.newValue === "true") {
        logout(); // Update Zustand store
        router.replace("/");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [router, logout]);

  return (
    <div>
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Avatar className="hover:cursor-pointer border border-neutral-300 dark:border-none size-8">
            <AvatarImage
              className="pointer-events-none select-none"
              src="/user_img.png"
              alt={user.name}
            />
          </Avatar>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Profile Actions"
          className="max-w-sm w-full"
          variant="bordered"
        >
          <DropdownItem key="profile" className="flex flex-col gap-2">
            <p className="font-semibold">Signed in as {user.name}</p>
            <p className="text-sm ">Email: {user.email}</p>
            <p className="text-sm ">PRN No: {user.prnNo}</p>
          </DropdownItem>
          <DropdownItem
            key="logout"
            as="button"
            className="bg-red-500 text-white hover:bg-red-600 transition-all font-medium"
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
