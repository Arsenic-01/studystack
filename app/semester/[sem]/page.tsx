import NotFound from "@/app/not-found";
import SubjectSearch from "@/components/semester_page_components/SubjectFilter";
import { fetchSubjectsBySemester } from "@/lib/actions/Student.actions";
import { Metadata } from "next";

type Props = {
  params: { sem: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sem: semesterNumber } = await params;

  return {
    title: `Semester ${semesterNumber}`,
    description: `Browse all subjects, notes, and resources for Semester ${semesterNumber} at K.K. Wagh Polytechnic.`,
  };
}

const Page = async ({ params }: { params: { sem: string } }) => {
  const { sem } = await params;

  const subjects = await fetchSubjectsBySemester(Number(sem));

  if (!subjects || subjects.length === 0) {
    return <NotFound />;
  }

  return (
    <div className="flex flex-col gap-8 sm:gap-16 items-center justify-center w-full py-16 md:py-24 px-1">
      <div className="flex flex-col gap-4 items-start justify-center w-full max-w-5xl pt-10 lg:pt-5 px-5 md:px-8">
        <SubjectSearch sem={sem} initialSubjects={subjects} />
      </div>
    </div>
  );
};

export default Page;
