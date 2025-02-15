"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import BreadCrumbForUpload from "@/components/BreadCrumbForUpload";
import { FileUploadDemo } from "@/components/FileUploadDemo";

const fetchUserSession = async () => {
  const res = await fetch("/api/session");
  if (!res.ok) throw new Error("Not authenticated");
  return res.json();
};

const fetchSubjectDetails = async (subject: string) => {
  const res = await fetch("/api/subject", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ courseId: subject }),
  });

  if (!res.ok) throw new Error("Error fetching subject details");
  return res.json();
};

const Upload = ({ subject }: { subject: string }) => {
  const {
    data: user,
    error: userError,
    isLoading: userLoading,
  } = useQuery({
    queryKey: ["userSession"],
    queryFn: fetchUserSession,
  });

  const {
    data: subjectData,
    error: subjectError,
    isLoading: subjectLoading,
  } = useQuery({
    queryKey: ["subject", subject],
    queryFn: () => fetchSubjectDetails(subject),
    enabled: !!user, // Only fetch subject data if user is authenticated
  });

  if (userLoading || subjectLoading) return <p>Loading...</p>;
  if (userError || !user) return <p>Authentication required</p>;
  if (subjectError || !subjectData) return <p>Subject not found</p>;
  // Only teachers can see the upload section
  if (user.user.role !== "teacher")
    return <p>Only teachers can upload notes</p>;

  return (
    <div className="flex justify-center py-36 px-5 items-center min-h-screen">
      <div className="flex flex-col w-full gap-20 max-w-4xl">
        <BreadCrumbForUpload subject={subject} />
        <FileUploadDemo
          subjectId={subjectData?.subjectId || "Unknown"}
          sem={subjectData?.sem || "Unknown"}
          userId={user.user.userId}
        />
      </div>
    </div>
  );
};

export default Upload;
