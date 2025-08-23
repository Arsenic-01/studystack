"use client";

import { useUser } from "@/hooks/useUser";
import { Upload } from "lucide-react";
import { useState } from "react";
import { Button } from "../../ui/button";
import UploadNotesModal from "./UploadNotesModal";

const UploadNotesButton = ({
  semester,
  subjectUnit,
  abbreviation,
}: {
  semester: string;
  subjectUnit: string[];
  abbreviation: string;
}) => {
  const { user } = useUser();

  const [open, setOpen] = useState(false);

  return (
    <>
      {(user?.role === "teacher" || user?.role === "admin") && (
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
          subjectUnit={subjectUnit}
          open={open}
          closeModal={() => setOpen(false)}
          semester={semester!}
          userId={user?.id || ""}
          userName={user?.name || ""}
          abbreviation={abbreviation}
        />
      )}
    </>
  );
};

export default UploadNotesButton;
