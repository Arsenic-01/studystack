"use client";

import { UserContext } from "@/context/UserContext";
import React, { useContext } from "react";
import { Button } from "../ui/button";
import { ArrowUpRight } from "lucide-react";

const UploadNotesButton = () => {
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("Header must be used within a UserContextProvider");
  }

  const { isLoggedIn, user } = userContext;

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
