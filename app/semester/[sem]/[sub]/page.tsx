import NotesClient from "@/components/notes_page_components/NotesClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { fetchSubject } from "@/lib/actions/Subjects.actions";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

const Page = async ({ params }: { params: { sub: string } }) => {
  const { sub } = await params;

  // Fetch subject on the server to check if it exists
  const res = await fetchSubject({ subjectId: sub });

  if (!res) {
    return <ErrorUI />;
  }

  return (
    <NotesClient
      // abbr={res.abbr}
      subjectId={res.subjectId}
      subjectName={res.name}
      subjectUnits={res.unit || []}
      semester={res.semester}
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
