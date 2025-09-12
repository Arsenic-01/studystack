"use client";

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
import { useUser } from "@/hooks/useUser";
import { fetchPaginatedFormLinks } from "@/lib/actions/Form.actions";
import {
  fetchPaginatedNotes,
  getUploadersForSubject,
} from "@/lib/actions/Notes.actions";
import { fetchPaginatedYoutubeLinks } from "@/lib/actions/Youtube.actions";
import {
  Form,
  Note,
  SessionUser,
  Subject,
  Youtube,
} from "@/lib/appwrite_types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  FileQuestion,
  Home,
  Link2Off,
  ListFilter,
  ListFilterPlus,
  VideoOff,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/search-dialog";
import { GoogleFormCard } from "./_cards/LinkCard";
import NoteCard from "./_cards/NoteCard";
import PaginationControl from "./PaginationControl";
import { YouTubeCard } from "./_cards/YouTubeCard";
import NoteCardSkeleton from "./_skeleton/NoteCardSkeleton";

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
  initialFilters: {
    unit: string;
    fileType: string[];
    user: string[];
    formType: string;
  };
  serverUser?: SessionUser | null;
}

export default function NotesFilter({
  subject,
  initialNotes,
  initialYoutubeLinks,
  initialGoogleFormLinks,
  initialPageNumbers,
  initialFilters,
  serverUser,
}: NotesFilterProps) {
  const { user: clientUser } = useUser();
  const user = serverUser ?? clientUser;

  const searchParams = useSearchParams();

  const [notesPage, setNotesPage] = useState(initialPageNumbers.notes);
  const [youtubePage, setYoutubePage] = useState(initialPageNumbers.youtube);
  const [formsPage, setFormsPage] = useState(initialPageNumbers.forms);
  const [selectedUnit, setSelectedUnit] = useState(initialFilters.unit);
  const [selectedFileTypes, setSelectedFileTypes] = useState(
    initialFilters.fileType
  );
  const [selectedUsers, setSelectedUsers] = useState(initialFilters.user);
  const [selectedFormType, setSelectedFormType] = useState(
    initialFilters.formType
  );
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  // This effect is still useful to sync state if the user navigates
  // back/forward in their browser history to a page with different initial props.
  useEffect(() => {
    setNotesPage(initialPageNumbers.notes);
    setYoutubePage(initialPageNumbers.youtube);
    setFormsPage(initialPageNumbers.forms);
    setSelectedUnit(initialFilters.unit);
    setSelectedFileTypes(initialFilters.fileType);
    setSelectedUsers(initialFilters.user);
    setSelectedFormType(initialFilters.formType);
  }, [initialPageNumbers, initialFilters]);

  // Helper function to compare arrays of strings (for fileTypes and users)
  const areArraysEqual = (a: string[], b: string[]) => {
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    return sortedA.every((value, index) => value === sortedB[index]);
  };

  // Check if the current state matches the initial server-rendered state for notes
  const isInitialNotesState =
    notesPage === initialPageNumbers.notes &&
    selectedUnit === initialFilters.unit &&
    areArraysEqual(selectedFileTypes, initialFilters.fileType) &&
    areArraysEqual(selectedUsers, initialFilters.user);

  const isInitialYoutubeState = youtubePage === initialPageNumbers.youtube;

  const isInitialFormsState =
    formsPage === initialPageNumbers.forms &&
    selectedFormType === initialFilters.formType;

  const { data: allTeachers } = useQuery({
    queryKey: ["all-teachers", subject.abbreviation],
    queryFn: () => getUploadersForSubject(subject.abbreviation),
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: notesData,
    isFetching: isNotesFetching,
    isPlaceholderData: isNotesPlaceholderData,
  } = useQuery({
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
    initialData: isInitialNotesState ? initialNotes : undefined,
    staleTime: 60 * 1000,
  });

  const {
    data: youtubeData,
    isFetching: isYoutubeFetching,
    isPlaceholderData: isYoutubePlaceholderData,
  } = useQuery({
    queryKey: ["youtube", subject.abbreviation, youtubePage],
    queryFn: () =>
      fetchPaginatedYoutubeLinks({
        abbreviation: subject.abbreviation,
        limit: LINKS_PER_PAGE,
        offset: (youtubePage - 1) * LINKS_PER_PAGE,
      }),
    placeholderData: keepPreviousData,
    initialData: isInitialYoutubeState ? initialYoutubeLinks : undefined,
    staleTime: 60 * 1000,
  });

  const {
    data: formData,
    isFetching: isFormsFetching,
    isPlaceholderData: isFormsPlaceholderData,
  } = useQuery({
    queryKey: ["forms", subject.abbreviation, formsPage, selectedFormType],
    queryFn: () =>
      fetchPaginatedFormLinks({
        abbreviation: subject.abbreviation,
        limit: LINKS_PER_PAGE,
        offset: (formsPage - 1) * LINKS_PER_PAGE,
        filters: { formType: selectedFormType },
      }),
    placeholderData: keepPreviousData,
    initialData: isInitialFormsState ? initialGoogleFormLinks : undefined,
    staleTime: 60 * 1000,
  });

  const handleFilterChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: string,
    pageSetter: React.Dispatch<React.SetStateAction<number>>
  ) => {
    pageSetter(1);
    setter(value);
  };

  const handleMultiFilterChange = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    value: string
  ) => {
    setNotesPage(1);
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const resetNoteFilters = () => {
    setNotesPage(1);
    setSelectedUnit("All");
    setSelectedFileTypes([]);
    setSelectedUsers([]);
  };

  const resetFormFilters = () => {
    setFormsPage(1);
    setSelectedFormType("all");
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
        <h1 className="block md:hidden text-2xl font-bold tracking-tight truncate">
          Notes for {subject.abbreviation}
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
                      onClick={() =>
                        handleMultiFilterChange(setSelectedFileTypes, type)
                      }
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
                      onClick={() =>
                        handleMultiFilterChange(setSelectedUsers, name)
                      }
                    >
                      <Checkbox checked={selectedUsers.includes(name)} />
                      <span className="text-sm capitalize">{name}</span>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <Select
            value={selectedUnit}
            onValueChange={(v) =>
              handleFilterChange(setSelectedUnit, v, setNotesPage)
            }
          >
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
        <div
          style={{
            opacity: isNotesPlaceholderData ? 0.5 : 1,
            transition: "opacity 300ms",
          }}
        >
          {isNotesFetching && !notesData?.documents.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(NOTES_PER_PAGE)
                .fill(0)
                .map((_, i) => (
                  <NoteCardSkeleton key={i} />
                ))}
            </div>
          ) : notes.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map((note) => (
                  <div key={note.noteId} id={`note-${note.noteId}`}>
                    <NoteCard note={note} serverUser={user} />
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
            <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-lg p-10 text-center my-8">
              <div className="flex flex-col items-center justify-center gap-4">
                <FileQuestion className="h-8 w-8 text-neutral-500 dark:text-neutral-400" />
                <h3 className="text-lg font-medium">No Notes Found</h3>
                <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
                  No notes match your current filter settings. Try adjusting or
                  resetting them.
                </p>
                <Button variant="outline" onClick={resetNoteFilters}>
                  Reset All Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6">
          Related Videos
        </h2>
        <div
          style={{
            opacity: isYoutubePlaceholderData ? 0.5 : 1,
            transition: "opacity 300ms",
          }}
        >
          {youtubeLinks.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {youtubeLinks.map((link) => {
                  if (!link || !link.youtubeLink) {
                    return null;
                  }

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
                        user={user}
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
            <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-lg p-10 text-center my-8">
              <div className="flex flex-col items-center justify-center gap-4">
                <VideoOff className="h-8 w-8 text-neutral-500 dark:text-neutral-400" />
                <h3 className="text-lg font-medium">No Videos Found</h3>
                <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
                  There are no related videos available for this subject at the
                  moment.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>{" "}
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
          <Select
            value={selectedFormType}
            onValueChange={(v) =>
              handleFilterChange(setSelectedFormType, v, setFormsPage)
            }
          >
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
        <div
          style={{
            opacity: isFormsPlaceholderData ? 0.5 : 1,
            transition: "opacity 300ms",
          }}
        >
          {forms.length > 0 ? (
            <>
              <div className="flex flex-col gap-4">
                {forms.map((form) => (
                  <div key={form.id} id={`form-${form.id}`}>
                    <GoogleFormCard
                      form={form}
                      user={user}
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
            <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-lg p-10 text-center my-8">
              <div className="flex flex-col items-center justify-center gap-4">
                <Link2Off className="h-8 w-8 text-neutral-500 dark:text-neutral-400" />
                <h3 className="text-lg font-medium">No Links Found</h3>
                <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
                  No quizzes or links were found for the currently selected
                  filter.
                </p>
                <Button variant="outline" onClick={resetFormFilters}>
                  Reset Filter
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
