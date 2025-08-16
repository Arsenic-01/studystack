import SubjectSearch from "@/components/semester_page_components/SubjectFilter";
import { fetchSubjectsBySemester } from "@/lib/actions/Student.actions";
import { ErrorUI } from "./[sub]/page";

const Page = async ({ params }: { params: { sem: string } }) => {
  const { sem } = await params;

  // ✅ FETCH SUBJECTS ON THE SERVER
  const subjects = await fetchSubjectsBySemester(Number(sem));

  // If no subjects are found for the semester, show an error.
  if (!subjects) {
    return (
      <ErrorUI
        title="Invalid Semester URL"
        message="No subjects found for this semester. Please check the URL or go back home."
        actionLabel="Go Home"
        actionHref="/home"
      />
    );
  }

  return (
    <div className="flex flex-col gap-8 sm:gap-16 items-center justify-center w-full py-16 md:py-24 px-1">
      <div className="flex flex-col gap-4 items-start justify-center w-full max-w-5xl pt-10 lg:pt-5 px-5 md:px-8">
        {/* ✅ Pass the server-fetched subjects to the client component */}
        <SubjectSearch sem={sem} initialSubjects={subjects} />
      </div>
    </div>
  );
};

export default Page;
