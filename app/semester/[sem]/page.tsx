import SubjectSearch from "@/components/SubjectFilter";
import { fetchSubjectsBySemester } from "@/lib/actions/Student.actions";

const page = async ({ params }: { params: { sem: string } }) => {
  const { sem } = await params;

  const subjects = await fetchSubjectsBySemester(Number(sem));

  return (
    <div>
      <div className="flex flex-col gap-8 sm:gap-16 items-center justify-center w-full py-16 md:py-24 px-1">
        <div className="flex flex-col gap-4 items-start justify-center w-full  max-w-5xl  pt-12 px-5 md:px-8">
          <SubjectSearch sem={sem} subjects={subjects} />
        </div>
      </div>
    </div>
  );
};

export default page;
