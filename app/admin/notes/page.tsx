// app/admin/notes/page.tsx
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useAdminNotes,
  useDeleteNote,
  useNotesFilterOptions,
} from "@/hooks/useAdminData";
import { useDebounce } from "@/hooks/useDebounce";
import { format } from "date-fns";
import {
  Edit,
  ExternalLink,
  Filter,
  MoreVertical,
  Search,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";
import EditNotesModal from "@/components/notes_page_components/crud_notes/EditNotesModal";

const typeColors = {
  Notes: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  PPTS: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Assignments:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  SLA: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  Lab_Manuals:
    "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
  Other: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
};

export default function AdminNotesPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [teacherFilter, setTeacherFilter] = useState("all");
  const [deleteNoteData, setDeleteNoteData] = useState<{
    noteId: string;
    fileId: string;
  } | null>(null);
  const [editNote, setEditNote] = useState<any | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  const {
    data: notesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useAdminNotes({
    search: debouncedSearch,
    typeFilter,
    teacherFilter,
    limit: 15,
  });

  const { data: filterOptions } = useNotesFilterOptions();
  const deleteNoteMutation = useDeleteNote();

  const allNotes = React.useMemo(() => {
    return notesData?.pages.flatMap((page) => page.documents) ?? [];
  }, [notesData]);

  const totalCount = notesData?.pages[0]?.total ?? 0;

  // Proper state control for delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDeleteNote = async () => {
    if (!deleteNoteData) return;

    try {
      await deleteNoteMutation.mutateAsync({
        noteId: deleteNoteData.noteId,
        fileId: deleteNoteData.fileId,
      });
      toast.success("Note deleted successfully");
      setDeleteNoteData(null);
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Failed to delete note");
      console.log("Delete note error:", error);
    }
  };

  const handleEditNote = (note: any) => {
    setEditNote(note);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditNote(null);
  };

  const openDeleteDialog = (noteData: { noteId: string; fileId: string }) => {
    setDeleteNoteData(noteData);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeleteNoteData(null);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-destructive">
            Error loading notes
          </h2>
          <p className="text-muted-foreground">
            Please try refreshing the page
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Notes Management
          </h1>
          <p className="text-muted-foreground">
            Manage and monitor all uploaded notes and documents
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
          <CardDescription>Search and filter notes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notes by title..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {filterOptions?.typeOptions.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={teacherFilter} onValueChange={setTeacherFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by teacher" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teachers</SelectItem>
                {filterOptions?.teacherOptions.map((teacher) => (
                  <SelectItem key={teacher} value={teacher}>
                    {teacher}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Notes ({totalCount.toLocaleString()})</CardTitle>
          <CardDescription>
            All uploaded notes and documents in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Uploaded By</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-4 w-48" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-8 rounded" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : allNotes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <div className="text-muted-foreground">
                        {debouncedSearch ||
                        typeFilter !== "all" ||
                        teacherFilter !== "all"
                          ? "No notes found matching your filters"
                          : "No notes found"}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  allNotes.map((note) => (
                    <TableRow key={note.noteId}>
                      <TableCell className="font-medium max-w-xs">
                        <div className="truncate" title={note.title}>
                          {note.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            typeColors[
                              note.type_of_file as keyof typeof typeColors
                            ] || typeColors.Other
                          }
                        >
                          {note.type_of_file}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {note.users.name}
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">
                          {note.abbreviation}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(note.createdAt), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link
                                href={note.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View File
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEditNote(note)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Note
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() =>
                                openDeleteDialog({
                                  noteId: note.noteId,
                                  fileId: note.fileId,
                                })
                              }
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Note
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Load More Button */}
          {hasNextPage && (
            <div className="flex justify-center mt-6">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Note Modal - Using existing component */}
      {editNote && (
        <EditNotesModal
          open={editModalOpen}
          closeModal={closeEditModal}
          noteId={editNote.noteId}
          title={editNote.title}
          description={editNote.description}
          type_of_file={editNote.type_of_file}
          semester={editNote.semester}
          abbreviation={editNote.abbreviation}
        />
      )}

      {/* Delete Confirmation Dialog - Clean state control */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              note and remove the file from Google Drive.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDeleteDialog}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteNote}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Note
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
