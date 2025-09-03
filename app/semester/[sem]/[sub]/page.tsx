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
  const { sub, sem } = await params;
  const sp = await searchParams;

  const subject = await fetchSubject({ abbreviation: sub, semester: sem });
  if (!subject) return <NotFound />;

  const noteId = sp["noteId"];
  const youtubeId = sp["youtubeId"];
  const formId = sp["formId"];

  let notesPage = parseInt(sp["notesPage"] as string) || 1;
  let youtubePage = parseInt(sp["youtubePage"] as string) || 1;
  let formsPage = parseInt(sp["formsPage"] as string) || 1;

  const fileTypeFilter =
    (sp["fileType"] as string)?.split(",").filter(Boolean) || [];
  const unitFilter = (sp["unit"] as string) || "All";
  const userFilter = (sp["user"] as string)?.split(",").filter(Boolean) || [];
  const formTypeFilter = (sp["formType"] as string) || "all";

  if (typeof noteId === "string") {
    notesPage = await findNotePage(sub, noteId, NOTES_PER_PAGE);
  }
  if (typeof youtubeId === "string") {
    youtubePage = await findYoutubePage(sub, youtubeId, LINKS_PER_PAGE);
  }
  if (typeof formId === "string") {
    formsPage = await findFormPage(sub, formId, LINKS_PER_PAGE);
  }

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
      initialPageNumbers={{
        notes: notesPage,
        youtube: youtubePage,
        forms: formsPage,
      }}
    />
  );
}
