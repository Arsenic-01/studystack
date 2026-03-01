import NotFound from "@/app/not-found";
import { Metadata } from "next";
import { DATABASE_ID, db, Query, SUBJECT_COLLECTION_ID } from "@/lib/appwrite";
import { SessionUser, Subject } from "@/lib/appwrite_types";
import { Models } from "node-appwrite";
import { getCurrentUser } from "@/lib/auth";
import { unstable_cache as cache } from "next/cache";
import SubjectList from "./_components/SubjectFilter";

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

const getSubjectsBySemester = cache(
  async (sem: string): Promise<Subject[]> => {
    const response: Models.DocumentList<Models.Document> =
      await db.listDocuments(DATABASE_ID!, SUBJECT_COLLECTION_ID!, [
        Query.equal("semester", sem),
      ]);

    if (response.total > 0) {
      return response.documents.map((doc) => ({
        subjectId: doc.$id,
        name: doc.name,
        abbreviation: doc.abbreviation,
        code: doc.code,
        semester: doc.semester,
        unit: doc.unit,
      }));
    }

    return []; // Return empty array if no subjects found
  },
  ["subjects-by-semester"],
  {
    tags: ["subjects"],
    revalidate: 3600, // 1 hour
  },
);

const Page = async ({ params }: { params: { sem: string } }) => {
  const { sem } = await params;

  const [subjects, user] = await Promise.all([
    getSubjectsBySemester(sem),
    getCurrentUser() as Promise<SessionUser | null>,
  ]);

  if (!subjects) {
    return <NotFound />;
  }
  return (
    <div className="flex flex-col gap-8 sm:gap-16 items-center justify-center w-full py-16 md:py-24">
      <div className="flex flex-col gap-4 items-start justify-center w-full max-w-5xl pt-10 lg:pt-5 px-5 xl:px-0">
        <SubjectList sem={sem} initialSubjects={subjects} user={user} />
      </div>
    </div>
  );
};

export default Page;
