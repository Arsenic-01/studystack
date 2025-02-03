// ProfileCard.tsx
import { UserProps } from "@/lib/appwrite_types";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";

const ProfileCard = ({
  user,
  handleLogout,
}: {
  user: UserProps;
  handleLogout: () => void;
}) => {
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
