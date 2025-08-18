import NotesFilter from "@/components/notes_page_components/NotesFilter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { fetchPaginatedFormLinks } from "@/lib/actions/Form.actions";
import { fetchPaginatedNotes } from "@/lib/actions/Notes.actions";
import { fetchSubject } from "@/lib/actions/Subjects.actions";
import { fetchPaginatedYoutubeLinks } from "@/lib/actions/Youtube.actions";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

const NOTES_PER_PAGE = 6;
const LINKS_PER_PAGE = 3;

const Page = async ({ params }: { params: { sub: string } }) => {
  const { sub } = await params;

  // 1. Fetch the main subject data first
  const subject = await fetchSubject({ abbreviation: sub });

  // If the subject doesn't exist, show an error and stop.
  if (!subject) {
    return <ErrorUI />;
  }

  // 2. ✅ FETCH ALL OTHER DATA ON THE SERVER IN PARALLEL
  // We use Promise.all to fetch notes, youtube links, and quizzes at the same time for max speed.
  const [notes, youtubeLinks, googleFormLinks] = await Promise.all([
    fetchPaginatedNotes({
      abbreviation: subject.abbreviation,
      limit: NOTES_PER_PAGE,
      offset: 0,
    }),
    fetchPaginatedYoutubeLinks({
      abbreviation: subject.abbreviation,
      limit: LINKS_PER_PAGE,
      offset: 0,
    }),
    fetchPaginatedFormLinks({
      abbreviation: subject.abbreviation,
      limit: LINKS_PER_PAGE,
      offset: 0,
    }),
  ]);

  // 3. Pass all the server-fetched data down to the client component
  return (
    <NotesFilter
      subject={subject}
      initialNotes={notes || []}
      initialYoutubeLinks={youtubeLinks || []}
      initialGoogleFormLinks={googleFormLinks || []}
    />
  );
};

export default Page;

interface ErrorUIProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  actionHref?: string;
}

export const ErrorUI = ({
  title = "Invalid Subject URL",
  message = "The subject you are looking for does not exist.",
  actionLabel = "Go Back",
  actionHref = "/home",
}: ErrorUIProps) => {
  return (
    <div className="container  mx-auto py-28 xl:py-40 px-4 flex items-center justify-center">
      <Card className="max-w-md w-full p-8 bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-neutral-200 dark:border-neutral-800 shadow-lg">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
            <AlertCircle className="h-8 w-8 text-red-500 dark:text-red-300" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-red-500 dark:text-red-400">
              {title}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">{message}</p>
          </div>

          <Button
            variant="destructive"
            asChild
            className="mt-4 w-full sm:w-auto px-8 py-2 rounded-md transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
};
