import NotFound from "@/app/not-found";
import NotesFilter from "@/components/notes_page_components/NotesFilter";
import { findFormPage } from "@/lib/actions/Form.actions";
import { findNotePage } from "@/lib/actions/Notes.actions";
import { fetchSubject } from "@/lib/actions/Subjects.actions";
import { findYoutubePage } from "@/lib/actions/Youtube.actions";
import {
  DATABASE_ID,
  db,
  FORM_COLLECTION_ID,
  NOTE_COLLECTION_ID,
  Query,
  YOUTUBE_COLLECTION_ID,
} from "@/lib/appwrite";
import { Form, Note, Youtube } from "@/lib/appwrite_types";
import { Metadata } from "next";

const NOTES_PER_PAGE = 6;
const LINKS_PER_PAGE = 3;

type Props = {
  params: { sem: string; sub: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sub, sem } = await params;

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

  // --- Extract filters ---
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

  // --- Handle direct links ---
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

  // --- Fetch in parallel ---
  const [notesData, youtubeData, formsData] = await Promise.all([
    (async () => {
      const queries = [
        Query.equal("abbreviation", sub),
        Query.orderDesc("$createdAt"),
        Query.limit(NOTES_PER_PAGE),
        Query.offset((notesPage - 1) * NOTES_PER_PAGE),
      ];
      if (fileTypeFilter.length > 0)
        queries.push(Query.equal("type_of_file", fileTypeFilter));
      if (unitFilter !== "All") queries.push(Query.equal("unit", unitFilter));
      if (userFilter.length > 0)
        queries.push(Query.equal("userName", userFilter));

      const response = await db.listDocuments(
        DATABASE_ID!,
        NOTE_COLLECTION_ID!,
        queries
      );

      const documents = response.documents.map((doc) => ({
        noteId: doc.$id,
        title: doc.title,
        description: doc.description,
        createdAt: doc.$createdAt,
        fileId: doc.fileId,
        semester: doc.semester || "",
        type_of_file: doc.type_of_file || "",
        unit: doc.unit || [],
        users: {
          name: doc.userName || "Unknown User",
          userId: doc.userId || "",
        },
        abbreviation: doc.abbreviation || "",
        fileUrl: doc.fileUrl || "",
        mimeType: doc.mimeType || "",
        fileSize: doc.fileSize || "",
        thumbNail: doc.thumbNail || "",
      }));

      return { documents: documents as Note[], total: response.total };
    })(),
    (async () => {
      const response = await db.listDocuments(
        DATABASE_ID!,
        YOUTUBE_COLLECTION_ID!,
        [
          Query.equal("abbreviation", sub),
          Query.orderDesc("$createdAt"),
          Query.limit(LINKS_PER_PAGE),
          Query.offset((youtubePage - 1) * LINKS_PER_PAGE),
        ]
      );
      const documents = response.documents.map((doc) => ({
        id: doc.$id,
        title: doc.title,
        youtubeLink: doc.url,
        createdBy: doc.createdBy,
        abbreviation: doc.abbreviation,
        semester: doc.semester,
      }));
      return { documents: documents as Youtube[], total: response.total };
    })(),
    (async () => {
      const queries = [
        Query.equal("abbreviation", sub),
        Query.orderDesc("$createdAt"),
        Query.limit(LINKS_PER_PAGE),
        Query.offset((formsPage - 1) * LINKS_PER_PAGE),
      ];
      if (formTypeFilter !== "all")
        queries.push(Query.equal("formType", formTypeFilter));

      const response = await db.listDocuments(
        DATABASE_ID!,
        FORM_COLLECTION_ID!,
        queries
      );
      const documents = response.documents.map((doc) => ({
        id: doc.$id,
        url: doc.url,
        createdBy: doc.createdBy,
        quizName: doc.title,
        abbreviation: doc.abbreviation,
        semester: doc.semester,
        formType: doc.formType,
      }));
      return { documents: documents as Form[], total: response.total };
    })(),
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
