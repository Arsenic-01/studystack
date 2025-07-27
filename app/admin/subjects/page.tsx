"use client";

import SubjectsTable from "@/components/admin_components/visual/SubjectsTable";
import { fetchAllSubjects } from "@/lib/actions/Subjects.actions";
import { useQuery } from "@tanstack/react-query";

const SubjectPage = () => {
  const { data: subjects } = useQuery({
    queryKey: ["subjects"],
    queryFn: fetchAllSubjects,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
  });
  return (
    <div className="flex flex-col gap-8 items-center justify-center w-full py-28 lg:py-32 2xl:py-36 max-w-5xl mx-auto">
      <SubjectsTable subjects={subjects || []} />
    </div>
  );
};

export default SubjectPage;
