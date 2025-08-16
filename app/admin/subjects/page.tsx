import SubjectsTable from "@/components/admin_components/visual/SubjectsTable";
import { fetchAllSubjects } from "@/lib/actions/Subjects.actions";

export default async function ManageSubjectsPage() {
  const subjects = await fetchAllSubjects();

  return (
    <div className="flex flex-col gap-8 items-center justify-center w-full py-28 lg:py-32 2xl:py-36 2xl:pb-44">
      <SubjectsTable initialSubjects={subjects || []} />
    </div>
  );
}
