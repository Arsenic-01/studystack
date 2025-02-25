import BreadcrumbWithDropdown from "@/components/BreadCrumb";
import SubjectCard from "@/components/SubjectCard";
import { fetchSubjectsBySemester } from "@/lib/actions/Student.actions";
import { Subject } from "@/lib/appwrite_types";
import React from "react";

const page = async ({ params }: { params: { sem: string } }) => {
  const { sem } = await params;

  const res = await fetchSubjectsBySemester(Number(sem));

  return (
    <div>
      <div className="flex flex-col gap-8 sm:gap-16 items-center justify-center w-full py-16 md:py-24 px-1">
        <div className="flex flex-col gap-4 items-start justify-center w-full  max-w-5xl  pt-12 px-5 md:px-8">
          <BreadcrumbWithDropdown sem={sem} />

          {res.map((subject: Subject) => (
            <SubjectCard key={subject.subjectId} subject={subject} />
          ))}
          {res.length === 0 && <p>No subjects found</p>}
        </div>
      </div>
    </div>
  );
};

export default page;
