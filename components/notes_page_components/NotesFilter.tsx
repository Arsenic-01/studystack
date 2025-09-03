"use client";

import { useUser } from "@/hooks/useUser";
import { Form, Note, Subject, Youtube } from "@/lib/appwrite_types";
import { fetchPaginatedFormLinks } from "@/lib/actions/Form.actions";
import {
  fetchPaginatedNotes,
  getUploadersForSubject,
} from "@/lib/actions/Notes.actions";
import { fetchPaginatedYoutubeLinks } from "@/lib/actions/Youtube.actions";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  FileQuestion,
  Home,
  ListFilter,
  ListFilterPlus,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle } from "../ui/search-dialog";
import { GoogleFormCard } from "./google_form_components/GoogleFormCard";
import NoteCard from "./notes_helper_components/NoteCard";
import NoteCardSkeleton from "./skeleton/NoteCardSkeleton";
import { YouTubeCard } from "./youtube_components/YouTubeCard";
import PaginationControl from "./PaginationControl";

const NOTES_PER_PAGE = 6;
const LINKS_PER_PAGE = 3;

const fileTypes = [
  "Notes",
  "PPTS",
  "Modal_Solutions",
  "MSBTE_QP",
  "Videos",
  "Assignments",
  "SLA",
  "Lab_Manuals",
  "Syllabus",
  "Animations",
  "Programs",
  "Other",
];

interface PaginatedData<T> {
  documents: T[];
  total: number;
}
interface NotesFilterProps {
  subject: Subject;
  initialNotes: PaginatedData<Note>;
  initialYoutubeLinks: PaginatedData<Youtube>;
  initialGoogleFormLinks: PaginatedData<Form>;
  initialPageNumbers: {
    notes: number;
    youtube: number;
    forms: number;
  };
}

export default function NotesFilter({
  subject,
  initialNotes,
  initialYoutubeLinks,
  initialGoogleFormLinks,
  initialPageNumbers,
}: NotesFilterProps) {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [notesPage, setNotesPage] = useState(initialPageNumbers.notes);
  const [youtubePage, setYoutubePage] = useState(initialPageNumbers.youtube);
  const [formsPage, setFormsPage] = useState(initialPageNumbers.forms);
  const [selectedUnit, setSelectedUnit] = useState(
    () => searchParams.get("unit") || "All"
  );
  const [selectedFileTypes, setSelectedFileTypes] = useState(
    () => searchParams.get("fileType")?.split(",").filter(Boolean) || []
  );
  const [selectedUsers, setSelectedUsers] = useState(
    () => searchParams.get("user")?.split(",").filter(Boolean) || []
  );
  const [selectedFormType, setSelectedFormType] = useState(
    () => searchParams.get("formType") || "all"
  );
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const isInitialMount = useRef(true);

  // This effect syncs the server-calculated page numbers to the client state when a search link is clicked
  useEffect(() => {
    setNotesPage(initialPageNumbers.notes);
    setYoutubePage(initialPageNumbers.youtube);
    setFormsPage(initialPageNumbers.forms);
  }, [initialPageNumbers]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const params = new URLSearchParams();
    if (notesPage > 1) params.set("notesPage", notesPage.toString());
    if (youtubePage > 1) params.set("youtubePage", youtubePage.toString());
    if (formsPage > 1) params.set("formsPage", formsPage.toString());
    if (selectedUnit && selectedUnit !== "All")
      params.set("unit", selectedUnit);
    if (selectedFileTypes.length > 0)
      params.set("fileType", selectedFileTypes.join(","));
    if (selectedUsers.length > 0) params.set("user", selectedUsers.join(","));
    if (selectedFormType && selectedFormType !== "all")
      params.set("formType", selectedFormType);

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [
    notesPage,
    youtubePage,
    formsPage,
    selectedUnit,
    selectedFileTypes,
    selectedUsers,
    selectedFormType,
    pathname,
    router,
  ]);

  const { data: allTeachers } = useQuery({
    queryKey: ["all-teachers", subject.abbreviation],
    queryFn: () => getUploadersForSubject(subject.abbreviation),
    staleTime: 5 * 60 * 1000,
  });

  const { data: notesData, isFetching: isNotesFetching } = useQuery({
    queryKey: [
      "notes",
      subject.abbreviation,
      notesPage,
      selectedFileTypes,
      selectedUnit,
      selectedUsers,
    ],
    queryFn: () =>
      fetchPaginatedNotes({
        abbreviation: subject.abbreviation,
        limit: NOTES_PER_PAGE,
        offset: (notesPage - 1) * NOTES_PER_PAGE,
        filters: {
          type_of_file: selectedFileTypes,
          unit: selectedUnit,
          userName: selectedUsers,
        },
      }),
    placeholderData: keepPreviousData,
    initialData:
      notesPage === initialPageNumbers.notes ? initialNotes : undefined,
    staleTime: 60 * 1000,
  });

  const { data: youtubeData, isFetching: isYoutubeFetching } = useQuery({
    queryKey: ["youtube", subject.abbreviation, youtubePage],
    queryFn: () =>
      fetchPaginatedYoutubeLinks({
        abbreviation: subject.abbreviation,
        limit: LINKS_PER_PAGE,
        offset: (youtubePage - 1) * LINKS_PER_PAGE,
      }),
    placeholderData: keepPreviousData,
    initialData:
      youtubePage === initialPageNumbers.youtube
        ? initialYoutubeLinks
        : undefined,
    staleTime: 60 * 1000,
  });

  const { data: formData, isFetching: isFormsFetching } = useQuery({
    queryKey: ["forms", subject.abbreviation, formsPage, selectedFormType],
    queryFn: () =>
      fetchPaginatedFormLinks({
        abbreviation: subject.abbreviation,
        limit: LINKS_PER_PAGE,
        offset: (formsPage - 1) * LINKS_PER_PAGE,
        filters: { formType: selectedFormType },
      }),
    placeholderData: keepPreviousData,
    initialData:
      formsPage === initialPageNumbers.forms
        ? initialGoogleFormLinks
        : undefined,
    staleTime: 60 * 1000,
  });

  const handleUnitChange = (value: string) => {
    setNotesPage(1);
    setSelectedUnit(value);
  };

  const handleFormTypeChange = (value: string) => {
    setFormsPage(1);
    setSelectedFormType(value);
  };

  const handleFileTypeToggle = (type: string) => {
    setNotesPage(1);
    setSelectedFileTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleUserToggle = (name: string) => {
    setNotesPage(1);
    setSelectedUsers((prev) =>
      prev.includes(name) ? prev.filter((u) => u !== name) : [...prev, name]
    );
  };

  const resetNoteFilters = () => {
    setNotesPage(1);
    setSelectedUnit("All");
    setSelectedFileTypes([]);
    setSelectedUsers([]);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.classList.add(
            "ring-2",
            "ring-offset-2",
            "ring-primary",
            "rounded-lg",
            "transition-all",
            "duration-500",
            "ring-offset-background"
          );
          setTimeout(
            () =>
              element.classList.remove(
                "ring-2",
                "ring-offset-2",
                "ring-primary",
                "rounded-lg",
                "ring-offset-background"
              ),
            2500
          );
        }
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchParams]);

  const notes = notesData?.documents ?? [];
  const totalNotes = notesData?.total ?? 0;
  const totalNotePages = Math.ceil(totalNotes / NOTES_PER_PAGE);
  const youtubeLinks = youtubeData?.documents ?? [];
  const totalYoutubeLinks = youtubeData?.total ?? 0;
  const totalYoutubePages = Math.ceil(totalYoutubeLinks / LINKS_PER_PAGE);
  const forms = formData?.documents ?? [];
  const totalForms = formData?.total ?? 0;
  const totalFormPages = Math.ceil(totalForms / LINKS_PER_PAGE);

  return (
    <div className="container mx-auto py-28 sm:py-32 max-w-5xl px-5 xl:px-0">
      <div className="flex gap-4 sm:gap-10 mb-4 items-center">
        <Button variant="outline" className="w-fit" asChild>
          <Link
            href={subject.semester ? `/semester/${subject.semester}` : "/home"}
          >
            {subject.semester ? <ArrowLeft /> : <Home />}
            {subject.semester ? " Back" : " Home"}
          </Link>
        </Button>
        <h1 className="hidden md:block text-2xl font-bold tracking-tight truncate">
          {subject.name}
        </h1>
        <h1 className="md:hidden text-2xl font-bold tracking-tight truncate">
          Notes for {subject.abbreviation.toUpperCase()}
        </h1>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-3 w-full md:w-auto">
          <div className="flex items-center w-full gap-2 md:gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full md:w-fit">
                  <ListFilter className="mr-2 h-4 w-4" />
                  File Type ({selectedFileTypes.length || "All"})
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56">
                <div className="flex flex-col gap-2">
                  {fileTypes.map((type) => (
                    <div
                      key={type}
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => handleFileTypeToggle(type)}
                    >
                      <Checkbox checked={selectedFileTypes.includes(type)} />
                      <span className="text-sm capitalize">{type}</span>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full md:w-fit">
                  <ListFilterPlus className="mr-2 h-4 w-4" />
                  Faculty ({selectedUsers.length || "All"})
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56">
                <div className="flex flex-col gap-2">
                  {allTeachers?.map((name) => (
                    <div
                      key={name}
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => handleUserToggle(name)}
                    >
                      <Checkbox checked={selectedUsers.includes(name)} />
                      <span className="text-sm capitalize">{name}</span>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <Select value={selectedUnit} onValueChange={handleUnitChange}>
            <SelectTrigger className="w-full md:w-[280px]">
              <SelectValue placeholder="Select a unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Units</SelectItem>
              {subject.unit.map((unit, i) => (
                <SelectItem key={i} value={unit}>
                  <span className="flex justify-start items-start w-[300px] sm:w-auto truncate">
                    {unit}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {isNotesFetching && !notesData?.documents.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <>
              {Array(NOTES_PER_PAGE)
                .fill(0)
                .map((_, i) => (
                  <NoteCardSkeleton key={i} />
                ))}
            </>
          </div>
        ) : notes.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note) => (
                <div key={note.noteId} id={`note-${note.noteId}`}>
                  <NoteCard note={note} />
                </div>
              ))}
            </div>
            {totalNotePages > 1 && (
              <PaginationControl
                currentPage={notesPage}
                totalPages={totalNotePages}
                onPageChange={setNotesPage}
                isDisabled={isNotesFetching}
              />
            )}
          </>
        ) : (
          <div className="text-center py-16 px-6 bg-muted rounded-lg">
            <FileQuestion className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No Notes Found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              No notes match your current filter settings.
            </p>
            <Button
              variant="outline"
              className="mt-6"
              onClick={resetNoteFilters}
            >
              Reset All Filters
            </Button>
          </div>
        )}
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6">
          Related Videos
        </h2>
        {isYoutubeFetching && !youtubeData?.documents.length ? (
          <p>Loading videos...</p>
        ) : youtubeLinks.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {youtubeLinks.map((link) => {
                const videoIdMatch = link.youtubeLink.match(
                  /(?:v=|\/)([a-zA-Z0-9_-]{11}).*/
                );
                const videoId = videoIdMatch ? videoIdMatch[1] : null;
                if (!videoId) return null;
                return (
                  <div key={link.id} id={`youtube-${link.id}`}>
                    <YouTubeCard
                      link={link}
                      videoId={videoId}
                      user={user!}
                      onPlay={setPlayingVideoId}
                      semester={subject.semester}
                      abbreviation={subject.abbreviation}
                    />
                  </div>
                );
              })}
            </div>
            {totalYoutubePages > 1 && (
              <PaginationControl
                currentPage={youtubePage}
                totalPages={totalYoutubePages}
                onPageChange={setYoutubePage}
                isDisabled={isYoutubeFetching}
              />
            )}
          </>
        ) : (
          <p className="text-muted-foreground">
            No related videos found for this subject.
          </p>
        )}
      </div>
      <Dialog
        open={!!playingVideoId}
        onOpenChange={() => setPlayingVideoId(null)}
      >
        <DialogContent className="max-w-3xl p-0 border-0">
          <DialogTitle className="sr-only">Video Player</DialogTitle>
          <div className="aspect-video">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${playingVideoId}?autoplay=1`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </DialogContent>
      </Dialog>
      <div className="mt-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Quizzes & Links</h2>
          <Select value={selectedFormType} onValueChange={handleFormTypeChange}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="googleForm">Google Forms</SelectItem>
              <SelectItem value="assignment">Assignments</SelectItem>
              <SelectItem value="other">Other Links</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {isFormsFetching && !formData?.documents.length ? (
          <p>Loading links...</p>
        ) : forms.length > 0 ? (
          <>
            <div className="flex flex-col gap-4">
              {forms.map((form) => (
                <div key={form.id} id={`form-${form.id}`}>
                  <GoogleFormCard
                    form={form}
                    user={user!}
                    semester={subject.semester}
                    abbreviation={subject.abbreviation}
                  />
                </div>
              ))}
            </div>
            {totalFormPages > 1 && (
              <PaginationControl
                currentPage={formsPage}
                totalPages={totalFormPages}
                onPageChange={setFormsPage}
                isDisabled={isFormsFetching}
              />
            )}
          </>
        ) : (
          <p className="text-muted-foreground">
            No links found for this category.
          </p>
        )}
      </div>
    </div>
  );
}
