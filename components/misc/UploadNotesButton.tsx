"use client";

import { Button } from "../ui/button";
import { ArrowUpRight } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const UploadNotesButton = () => {
  const { user, isLoggedIn } = useAuthStore();

  return (
    <>
      {isLoggedIn && user?.role === "teacher" && (
        <Button
          className="rounded-full px-5 py-2 items-self-end w-full sm:w-auto sm:mr-3"
          variant={"outline"}
        >
          Upload Notes <ArrowUpRight />
        </Button>
      )}
    </>
  );
};

export default UploadNotesButton;
