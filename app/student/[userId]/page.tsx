import SubjectCard from "@/components/SubjectCard";
import { getCurrentUser } from "@/lib/actions/Admin.actions";
import { fetchSubjects } from "@/lib/actions/Student.actions";
import { Subject } from "@/lib/appwrite_types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

type PageProps = {
  params: { userId: string }; // Typing params correctly as a plain object, not a promise
  searchParams: { page?: string };
};

export default async function Page({ params, searchParams }: PageProps) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1; // Get current page from query params
  const limit = 5; // Number of items per page
  const offset = (currentPage - 1) * limit; // Calculate offset

  // Fetch subjects with pagination
  const res = await fetchSubjects(limit, offset);

  // Extract userId from params and fetch current user
  const { userId } = await params;
  const user = await getCurrentUser({ userId });

  if (!res) {
    return <div>Error loading subjects. Please try again later.</div>;
  }

  return (
    <>
      {user && (
        <div className="flex flex-col gap-16 items-center justify-center w-full py-20 md:py-36 px-3">
          <div className="flex flex-col gap-4 items-start justify-center w-full max-w-5xl  py-12 px-3 md:px-8">
            <div className="flex flex-col md:flex-row gap-6 justify-between w-full items-start mb-10 md:mb-16">
              <h1 className="text-3xl font-bold">Hello, {user?.name}</h1>
              <Input placeholder="Search for subject" className="max-w-sm" />
            </div>
            {res.map((subject: Subject) => (
              <SubjectCard key={subject.subjectId} subject={subject} />
            ))}
            <div className="flex justify-between w-full mt-8">
              {currentPage === 1 ? (
                <Button variant="outline" disabled>
                  <ArrowLeftIcon className="h-4 w-4" />
                </Button>
              ) : (
                <Button variant="outline" asChild>
                  <Link href={`?page=${currentPage - 1}`}>
                    <ArrowLeftIcon className="h-4 w-4" />
                  </Link>
                </Button>
              )}

              {res.length < limit ? (
                <Button variant="outline" disabled>
                  <ArrowRightIcon className="h-4 w-4" />
                </Button>
              ) : (
                <Button variant="outline" asChild>
                  <Link href={`?page=${currentPage + 1}`}>
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
      {!user && (
        <div className="flex flex-col gap-4 items-start justify-center w-full max-w-5xl  py-12 px-3 md:px-8">
          <h1 className="text-3xl font-bold">You are not logged in</h1>
          <p className="text-lg">Please login to view your subjects.</p>
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
        </div>
      )}
    </>
  );
}
