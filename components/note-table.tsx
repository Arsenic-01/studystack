"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Button } from "./ui/button";
import Link from "next/link";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  type ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Edit2, ListFilter, Search, Trash, X } from "lucide-react"; // Import cross icon
import EditNotesModal from "./EditNotesModal";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { deleteNote } from "@/lib/actions/Notes.actions";
import { useQueryClient } from "@tanstack/react-query";

interface Note {
  noteId: string;
  createdAt: string;
  fileId: string;
  title: string;
  description: string;
  type_of_file:
    | "Notes"
    | "PPTS"
    | "Modal_Solutions"
    | "MSBTE_QP"
    | "Videos"
    | "Animations"
    | "Programs"
    | "Other";
  uploadedBy?: string;
  subjectName?: string;
}

export function NotesTable({ notes }: { notes: Note[] }) {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [open, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const queryClient = useQueryClient();

  // Get unique teacher names
  const uniqueTeachers = useMemo(
    () =>
      Array.from(new Set(notes.map((note) => note.uploadedBy).filter(Boolean))),
    [notes]
  );

  // Filter notes based on selected teachers and search query
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesTeacher =
        selectedTeachers.length === 0 ||
        selectedTeachers.includes(note.uploadedBy || "Unknown");

      const matchesSearch =
        searchQuery === "" ||
        note.title.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTeacher && matchesSearch;
    });
  }, [notes, selectedTeachers, searchQuery]);

  // Reverse sorting based on createdAt (latest first)
  const sortedNotes = useMemo(
    () =>
      [...filteredNotes].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [filteredNotes]
  );

  const closeModal = () => {
    setOpen(false);
    setSelectedNote(null); // Reset selected note when modal closes
  };

  const handleEdit = (note: Note) => {
    setSelectedNote(note);
    setOpen(true);
  };

  const handleDelete = () => {
    if (!selectedNote) return;
    deleteNote({ noteId: selectedNote.noteId, fileId: selectedNote.fileId })
      .then(() => {
        toast.success("Note deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["notes"] });
      })
      .catch(() => toast.error("Error deleting note"))
      .finally(() => {
        setAlertOpen(false);
        setSelectedNote(null); // Clear the selected note after delete
      });
  };

  const columns: ColumnDef<Note>[] = [
    { accessorKey: "title", header: "Title" },
    {
      accessorKey: "uploadedBy",
      header: "Uploaded By",
      cell: ({ row }) => row.getValue("uploadedBy") || "Unknown",
    },
    {
      accessorKey: "createdAt",
      header: "Uploaded At",
      cell: ({ row }) =>
        format(new Date(row.getValue("createdAt")), "dd MMM yyyy, hh:mm a"),
    },
    {
      accessorKey: "fileId",
      header: "File",
      cell: ({ row }) => (
        <Button variant="outline" asChild>
          <Link
            href={`https://cloud.appwrite.io/v1/storage/buckets/67a6452c003b5b6b6502/files/${row.getValue(
              "fileId"
            )}/view?project=679a700c0013ee3706ba`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View
          </Link>
        </Button>
      ),
    },
    {
      accessorKey: "Action",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2 items-center justify-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              handleEdit(row.original);
            }}
          >
            <Edit2 className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setSelectedNote(row.original);
              setAlertOpen(true);
            }}
          >
            <Trash className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: sortedNotes,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Toggle teacher selection
  const toggleTeacher = (teacher: string) => {
    setSelectedTeachers((prev) =>
      prev.includes(teacher)
        ? prev.filter((t) => t !== teacher)
        : [...prev, teacher]
    );
  };

  return (
    <div>
      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
        {/* Search Input with Clear Button */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />

          <Input
            placeholder="Search by Notes by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Teacher Filter Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full md:w-fit">
              <ListFilter className="mr-1 h-4 w-4" />
              Filter by Teacher{" "}
              {selectedTeachers.length > 0 && `(${selectedTeachers.length})`}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-52 xl:w-40 py-3 px-2">
            <div className="flex flex-col gap-2">
              {uniqueTeachers.length === 0 && (
                <p className="text-sm text-center text-muted-foreground">
                  No teachers found.
                </p>
              )}
              {uniqueTeachers.map((teacher) => (
                <label
                  key={teacher}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <Checkbox
                    checked={selectedTeachers.includes(teacher!)}
                    onCheckedChange={() => toggleTeacher(teacher!)}
                  />
                  {teacher}
                </label>
              ))}

              {selectedTeachers.length > 0 && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-1"
                  onClick={() => setSelectedTeachers([])}
                >
                  <X className="h-4 w-4" />
                  Clear Filters
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {open && selectedNote && (
        <EditNotesModal
          open={open}
          closeModal={closeModal}
          noteId={selectedNote.noteId}
          title={selectedNote.title}
          description={selectedNote.description}
          type_of_file={selectedNote.type_of_file!}
          fromAdmin
        />
      )}

      {/* Table */}
      <div className="rounded-md border border-neutral-300  dark:border-neutral-800">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="shad-table-row-header">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="whitespace-nowrap md:whitespace-normal"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="shad-table-row whitespace-nowrap md:whitespace-normal"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No notes found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            Showing {table.getRowModel().rows.length} of {notes.length} notes.
          </div>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the note.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setAlertOpen(false);
                setTimeout(() => {
                  document.body.style.removeProperty("pointer-events");
                }, 300);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedNote) {
                  handleDelete();
                  setAlertOpen(false);
                }
                setAlertOpen(false);
                setSelectedNote(null); // Clear selection on cancel
                setTimeout(() => {
                  document.body.style.removeProperty("pointer-events");
                }, 300);
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
