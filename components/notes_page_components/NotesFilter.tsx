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
import { fetchPaginatedFormLinks } from "@/lib/actions/Form.actions";
import { fetchPaginatedNotes } from "@/lib/actions/Notes.actions";
import { fetchPaginatedYoutubeLinks } from "@/lib/actions/Youtube.actions";
import { Form, Note, Subject, Youtube } from "@/lib/appwrite_types";
import { useAuthStore } from "@/store/authStore";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  FileQuestion,
  Home,
  ListFilter,
  ListFilterPlus,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "../ui/search-dialog";
import { GoogleFormCard } from "./google_form_components/GoogleFormCard";
import NoteCard from "./notes_helper_components/NoteCard";
import PaginationControl from "./PaginationControl";
import NoteCardSkeleton from "./skeleton/NoteCardSkeleton";
import { YouTubeCard } from "./youtube_components/YouTubeCard";

interface PaginatedData<T> {
  documents: T[];
  total: number;
}

interface NotesFilterProps {
  subject: Subject;
  initialNotes: PaginatedData<Note>;
  initialYoutubeLinks: PaginatedData<Youtube>;
  initialGoogleFormLinks: PaginatedData<Form>;
}

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

const defaultQueryOptions = {
  placeholderData: keepPreviousData,
  refetchOnWindowFocus: false,
  staleTime: 1000 * 60 * 5, // 5 minutes
};

const NotesFilter = ({
  subject,
  initialNotes,
  initialYoutubeLinks,
  initialGoogleFormLinks,
}: NotesFilterProps) => {
  const { user } = useAuthStore();

  // Pagination
  const [notesPage, setNotesPage] = useState(1);
  const [youtubePage, setYoutubePage] = useState(1);
  const [formPage, setFormPage] = useState(1);

  // Filter State
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<string>("All");
  const [selectedUser, setSelectedUser] = useState<string[]>([]);
  const [selectedFormType, setSelectedFormType] = useState("all");

  // UI State
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  const isNotesFilterPristine =
    selectedFilters.length === 0 &&
    selectedUnit === "All" &&
    selectedUser.length === 0;
  const isFormsFilterPristine = selectedFormType === "all";
  const hasNotesForSubject = (initialNotes?.total ?? 0) > 0;

  const {
    data: notesData,
    isLoading: isNotesLoading,
    isFetching: isNotesFetching,
  } = useQuery({
    ...defaultQueryOptions,

    queryKey: [
      "notes",
      subject.abbreviation,
      notesPage,
      selectedFilters,
      selectedUnit,
      selectedUser,
    ],
    queryFn: () =>
      fetchPaginatedNotes({
        abbreviation: subject.abbreviation,
        limit: NOTES_PER_PAGE,
        offset: (notesPage - 1) * NOTES_PER_PAGE,
        filters: {
          type_of_file: selectedFilters,
          unit: selectedUnit,
          userName: selectedUser,
        },
      }),
    initialData:
      notesPage === 1 && isNotesFilterPristine ? initialNotes : undefined,
  });

  const {
    data: youtubeData,
    isLoading: isYoutubeLoading,
    isFetching: isYoutubeFetching,
  } = useQuery({
    ...defaultQueryOptions,

    queryKey: ["youtube", subject.abbreviation, youtubePage],
    queryFn: () =>
      fetchPaginatedYoutubeLinks({
        abbreviation: subject.abbreviation,
        limit: LINKS_PER_PAGE,
        offset: (youtubePage - 1) * LINKS_PER_PAGE,
      }),
    initialData: youtubePage === 1 ? initialYoutubeLinks : undefined,
  });

  const {
    data: formData,
    isLoading: isFormLoading,
    isFetching: isFormsFetching,
  } = useQuery({
    ...defaultQueryOptions,

    queryKey: ["forms", subject.abbreviation, formPage, selectedFormType],
    queryFn: () =>
      fetchPaginatedFormLinks({
        abbreviation: subject.abbreviation,
        limit: LINKS_PER_PAGE,
        offset: (formPage - 1) * LINKS_PER_PAGE,
        filters: {
          formType: selectedFormType,
        },
      }),
    initialData:
      formPage === 1 && isFormsFilterPristine
        ? initialGoogleFormLinks
        : undefined,
  });

  useEffect(() => {
    setNotesPage(1);
  }, [selectedFilters, selectedUnit, selectedUser]);

  useEffect(() => {
    setFormPage(1);
  }, [selectedFormType]);

  // Scroll to hash on initial mount (no changes needed here)
  useEffect(() => {
    const timer = setTimeout(() => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.getElementById(hash.substring(1));
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const notes = notesData?.documents ?? [];
  const totalNotes = notesData?.total ?? 0;
  const totalNotePages = Math.ceil(totalNotes / NOTES_PER_PAGE);
  const uniqueUsers = Array.from(new Set(notes.map((note) => note.users.name)));

  const youtubeLinks = youtubeData?.documents ?? [];
  const totalYoutubeLinks = youtubeData?.total ?? 0;
  const totalYoutubePages = Math.ceil(totalYoutubeLinks / LINKS_PER_PAGE);

  const forms = formData?.documents ?? [];
  const totalForms = formData?.total ?? 0;
  const totalFormPages = Math.ceil(totalForms / LINKS_PER_PAGE);

  const toggleFilter = (type: string) => {
    setSelectedFilters((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };
  const toggleUserFilter = (userName: string) => {
    setSelectedUser((prev) =>
      prev.includes(userName)
        ? prev.filter((u) => u !== userName)
        : [...prev, userName]
    );
  };

  return (
    <div className="container mx-auto py-28 sm:py-32 2xl:py-36 max-w-5xl px-5">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 mb-8">
        <Button
          variant="outline"
          className={`${!subject.semester && "hidden"} w-fit`}
          asChild
        >
          <Link href={`/semester/${subject.semester}`}>
            <ArrowLeft /> Back
          </Link>
        </Button>
        <Button
          variant="outline"
          className={`${subject.semester && "hidden"} w-fit`}
          asChild
        >
          <Link href="/home">
            <Home /> Home
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">
          {subject.name ? `Notes for ${subject.name}` : "Invalid Subject URL"}
        </h1>
      </div>
      {!hasNotesForSubject ? (
        <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-10 py-20 text-center my-8">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="bg-neutral-100 dark:bg-neutral-800 rounded-full p-3">
              <FileQuestion className="h-8 w-8 text-neutral-500" />
            </div>
            <h3 className="text-lg font-medium">No notes found</h3>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
              No notes are available for this subject at the moment. They might
              be uploaded soon—stay tuned!
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {/* Filters */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3 w-full md:w-auto">
            <div className="flex sm:flex-row items-center gap-2 md:gap-3 w-full">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full md:w-fit">
                    <ListFilter />
                    <span className="hidden sm:block">
                      Filter by File type ({selectedFilters.length || "All"})
                    </span>
                    <span className="block sm:hidden">
                      File Type ({selectedFilters.length || "All"})
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56">
                  <div className="flex flex-col gap-2">
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => setSelectedFilters([])}
                    >
                      <Checkbox checked={selectedFilters.length === 0} />
                      <span className="text-sm">All</span>
                    </div>
                    {fileTypes.map((type) => (
                      <div
                        key={type}
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => toggleFilter(type)}
                      >
                        <Checkbox checked={selectedFilters.includes(type)} />
                        <span className="text-sm capitalize">{type}</span>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              {/* User Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full md:w-fit">
                    <ListFilterPlus />
                    <span className="hidden sm:block">
                      Filter by Faculty ({selectedUser.length || "All"})
                    </span>
                    <span className="block sm:hidden">
                      Faculty ({selectedUser.length || "All"})
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56">
                  <div className="flex flex-col gap-2">
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => setSelectedUser([])}
                    >
                      <Checkbox checked={selectedUser.length === 0} />
                      <span className="text-sm">All</span>
                    </div>
                    {uniqueUsers.map((userName) => (
                      <div
                        key={userName}
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => toggleUserFilter(userName)}
                      >
                        <Checkbox checked={selectedUser.includes(userName)} />
                        <span className="text-sm capitalize">{userName}</span>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            {/* Unit Filter */}
            <Select value={selectedUnit} onValueChange={setSelectedUnit}>
              <SelectTrigger className="w-full md:w-[280px]">
                <SelectValue placeholder="Select a unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Units</SelectItem>
                {subject.unit.map((unit, index) => (
                  <SelectItem key={index} value={unit}>
                    <span className="flex justify-start items-start w-[290px] sm:w-auto truncate">
                      {unit}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Notes Grid with Fallback UI */}
          {isNotesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <NoteCardSkeleton key={index} />
                ))}
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
              <PaginationControl
                currentPage={notesPage}
                totalPages={totalNotePages}
                onPageChange={setNotesPage}
                isDisabled={isNotesFetching}
              />
              <p className="text-sm text-center text-neutral-500 dark:text-neutral-400 mt-2">
                Showing page {notesPage} of {totalNotePages} ({totalNotes} total
                notes)
              </p>
            </>
          ) : (
            <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-10 text-center mb-8 md:my-8">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="bg-neutral-100 dark:bg-neutral-800 rounded-full p-3">
                  <FileQuestion className="h-8 w-8 text-neutral-500" />
                </div>
                <h3 className="text-lg font-medium">No notes found</h3>
                <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
                  No notes match your current filter settings. Try adjusting
                  your filters or select All to see all available notes.
                </p>
                <div className="flex gap-3 mt-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedFilters([]);
                      setSelectedUnit("All");
                      setSelectedUser([]);
                    }}
                  >
                    Reset all filters
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-10">
        <h2 className="text-2xl font-bold tracking-tight mb-6">
          Related Videos
        </h2>
        {isYoutubeLoading ? (
          <div className="text-center p-10">Loading videos...</div>
        ) : youtubeLinks.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {youtubeLinks.map((link) => {
                const videoIdMatch = link.youtubeLink.match(
                  /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
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
            <PaginationControl
              currentPage={youtubePage}
              totalPages={totalYoutubePages}
              onPageChange={setYoutubePage}
              isDisabled={isYoutubeFetching}
            />
          </>
        ) : (
          <p className="text-neutral-500">
            No related videos found for this subject.
          </p>
        )}
      </div>

      <Dialog
        open={!!playingVideoId}
        onOpenChange={() => setPlayingVideoId(null)}
      >
        <DialogContent className="max-w-3xl p-0 border-0">
          <DialogTitle></DialogTitle>
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

      {initialGoogleFormLinks &&
        initialGoogleFormLinks.documents.length > 0 && (
          <div className="mt-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold tracking-tight">
                Quizzes & Links
              </h2>

              <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
                <Select
                  value={selectedFormType}
                  onValueChange={setSelectedFormType}
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
            </div>

            {isFormLoading ? (
              <div className="text-center p-10">Loading links...</div>
            ) : forms.length > 0 ? (
              <>
                <div className="flex flex-col gap-4">
                  {forms.map((form) => (
                    <GoogleFormCard
                      key={form.id}
                      form={form}
                      user={user}
                      semester={subject.semester}
                      abbreviation={subject.abbreviation}
                    />
                  ))}
                </div>
                <PaginationControl
                  currentPage={formPage}
                  totalPages={totalFormPages}
                  onPageChange={setFormPage}
                  isDisabled={isFormsFetching}
                />
              </>
            ) : (
              <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-10 text-center mb-8 md:my-8">
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="bg-neutral-100 dark:bg-neutral-800 rounded-full p-3">
                    <FileQuestion className="h-8 w-8 text-neutral-500" />
                  </div>
                  <h3 className="text-lg font-medium">No Links found</h3>
                  <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
                    No links match your current filter settings. Try adjusting
                    your filters or select All to see all available links.
                  </p>
                  <div className="flex gap-3 mt-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedFormType("all");
                      }}
                    >
                      Reset all filters
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
    </div>
  );
};
export default NotesFilter;
