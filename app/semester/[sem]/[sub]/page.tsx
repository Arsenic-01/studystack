import NotFound from "@/app/not-found";
import NotesFilter from "@/components/notes_page_components/NotesFilter";
import { fetchPaginatedFormLinks } from "@/lib/actions/Form.actions";
import { fetchPaginatedNotes } from "@/lib/actions/Notes.actions";
import { fetchSubject } from "@/lib/actions/Subjects.actions";
import { fetchPaginatedYoutubeLinks } from "@/lib/actions/Youtube.actions";
import { Metadata } from "next";

type Props = {
  params: { sem: string; sub: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sub, sem } = await params;

  const subject = await fetchSubject({ abbreviation: sub, semester: sem });

  // If no subject is found, return a fallback title
  if (!subject) {
    return {
      title: "Subject Not Found",
    };
  }

  return {
    title: `${subject.abbreviation.toUpperCase()} Notes`,
    description: `Access all resources for ${subject.name} (${subject.abbreviation.toUpperCase()}).`,
  };
}

const NOTES_PER_PAGE = 6;
const LINKS_PER_PAGE = 3;

const Page = async ({ params }: { params: { sem: string; sub: string } }) => {
  const { sub, sem } = await params;
  // 1. Fetch the main subject data first
  const subject = await fetchSubject({ abbreviation: sub, semester: sem });

  // If the subject doesn't exist, show an error and stop.
  if (!subject) {
    return <NotFound />;
  }

  // 2. FETCH ALL OTHER DATA ON THE SERVER IN PARALLEL
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
