import NotFound from "@/app/not-found";
import NotesFilter from "@/components/notes_page_components/NotesFilter";
import {
  fetchPaginatedFormLinks,
  findFormPage,
} from "@/lib/actions/Form.actions";
import { fetchPaginatedNotes, findNotePage } from "@/lib/actions/Notes.actions";
import { fetchSubject } from "@/lib/actions/Subjects.actions";
import {
  fetchPaginatedYoutubeLinks,
  findYoutubePage,
} from "@/lib/actions/Youtube.actions";
import { Metadata } from "next";

const NOTES_PER_PAGE = 6;
const LINKS_PER_PAGE = 3;

type Props = {
  params: { sem: string; sub: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const { sub, sem } = resolvedParams;

  const subject = await fetchSubject({ abbreviation: sub, semester: sem });
  if (!subject) return { title: "Subject Not Found" };

  return {
    title: `${subject.abbreviation.toUpperCase()} Notes`,
    description: `Access all resources for ${subject.name} (${subject.abbreviation.toUpperCase()}).`,
  };
}

export default async function Page({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const { sub, sem } = resolvedParams;

  const subject = await fetchSubject({ abbreviation: sub, semester: sem });
  if (!subject) return <NotFound />;

  const noteId = resolvedSearchParams["noteId"];
  const youtubeId = resolvedSearchParams["youtubeId"];
  const formId = resolvedSearchParams["formId"];

  let notesPage = parseInt(resolvedSearchParams["notesPage"] as string) || 1;
  let youtubePage =
    parseInt(resolvedSearchParams["youtubePage"] as string) || 1;
  let formsPage = parseInt(resolvedSearchParams["formsPage"] as string) || 1;

  const fileTypeFilter =
    (resolvedSearchParams["fileType"] as string)?.split(",").filter(Boolean) ||
    [];
  const unitFilter = (resolvedSearchParams["unit"] as string) || "All";
  const userFilter =
    (resolvedSearchParams["user"] as string)?.split(",").filter(Boolean) || [];
  const formTypeFilter = (resolvedSearchParams["formType"] as string) || "all";

  // --- Handle direct links from search ---
  if (typeof noteId === "string") {
    notesPage = await findNotePage(sub, noteId, NOTES_PER_PAGE, {
      unit: unitFilter,
      userName: userFilter,
      type_of_file: fileTypeFilter,
    });
  }
  if (typeof youtubeId === "string") {
    youtubePage = await findYoutubePage(sub, youtubeId, LINKS_PER_PAGE);
  }
  if (typeof formId === "string") {
    formsPage = await findFormPage(sub, formId, LINKS_PER_PAGE, {
      formType: formTypeFilter,
    });
  }

  // --- Fetch data ---
  const [notesData, youtubeData, formsData] = await Promise.all([
    fetchPaginatedNotes({
      abbreviation: subject.abbreviation,
      limit: NOTES_PER_PAGE,
      offset: (notesPage - 1) * NOTES_PER_PAGE,
      filters: {
        type_of_file: fileTypeFilter,
        unit: unitFilter,
        userName: userFilter,
      },
    }),
    fetchPaginatedYoutubeLinks({
      abbreviation: subject.abbreviation,
      limit: LINKS_PER_PAGE,
      offset: (youtubePage - 1) * LINKS_PER_PAGE,
    }),
    fetchPaginatedFormLinks({
      abbreviation: subject.abbreviation,
      limit: LINKS_PER_PAGE,
      offset: (formsPage - 1) * LINKS_PER_PAGE,
      filters: { formType: formTypeFilter },
    }),
  ]);

  return (
    <NotesFilter
      subject={subject}
      initialNotes={notesData}
      initialYoutubeLinks={youtubeData}
      initialGoogleFormLinks={formsData}
      initialFilters={{
        unit: unitFilter,
        fileType: fileTypeFilter,
        user: userFilter,
        formType: formTypeFilter,
      }}
      initialPageNumbers={{
        notes: notesPage,
        youtube: youtubePage,
        forms: formsPage,
      }}
    />
  );
}
