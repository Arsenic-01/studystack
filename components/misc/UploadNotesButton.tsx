"use client";

import { useAuthStore } from "@/store/authStore";
import { Upload } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import UploadNotesModal from "../UploadNotesModal";

const UploadNotesButton = ({
  subjectId,
  sem,
}: {
  subjectId: string | null;
  sem: string | null;
}) => {
  const { user, isLoggedIn } = useAuthStore();
  const [open, setOpen] = useState(false);

  return (
    <>
      {isLoggedIn && (user?.role === "teacher" || user?.role === "admin") && (
        <Button
          className="rounded-full px-5 py-2 w-full sm:w-auto sm:mr-3"
          variant={"outline"}
          onClick={() => setOpen(true)}
        >
          Upload Notes <Upload />
        </Button>
      )}
      {open && (
        <UploadNotesModal
          open={open}
          closeModal={() => setOpen(false)}
          subjectId={subjectId}
          sem={sem}
          userId={user?.userId ?? null} // ✅ Pass `userId`
        />
      )}
    </>
  );
};

export default UploadNotesButton;
