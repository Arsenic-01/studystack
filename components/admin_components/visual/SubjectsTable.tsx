import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  type ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Edit2, ListFilter, Plus, Search, Trash, X } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { Subject } from "@/lib/appwrite_types";
import { deleteSubject } from "@/lib/actions/Subjects.actions";
import EditSubjectModal from "../admin_helper_components/subject_crud/EditSubjectModal";
import CreateSubjectModal from "../admin_helper_components/subject_crud/CreateSubjectModal";

export function SubjectsTable({ subjects }: { subjects: Subject[] }) {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [selectedSemesters, setSelectedSemesters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const queryClient = useQueryClient();

  // Get unique semesters
  const uniqueSemesters = useMemo(
    () => Array.from(new Set(subjects.map((subject) => subject.semester))),
    [subjects]
  );

  // Filter subjects based on selected semesters and search query
  const filteredSubjects = useMemo(() => {
    return subjects.filter((subject) => {
      const matchesSemester =
        selectedSemesters.length === 0 ||
        selectedSemesters.includes(subject.semester);

      const matchesSearch =
        searchQuery === "" ||
        subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subject.code.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSemester && matchesSearch;
    });
  }, [subjects, selectedSemesters, searchQuery]);

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedSubject(null);
  };

  const closeCreateModal = () => {
    setCreateModalOpen(false);
  };

  const handleEdit = (subject: Subject) => {
    setSelectedSubject(subject);
    setEditModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedSubject) return;

    try {
      await deleteSubject({ subjectId: selectedSubject.subjectId });
      toast.success("Subject deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    } catch (error) {
      toast.error("Error deleting subject");
      console.error(error);
    } finally {
      setAlertOpen(false);
      setSelectedSubject(null);
    }
  };

  const columns: ColumnDef<Subject>[] = [
    {
      accessorKey: "name",
      header: "Subject Name",
      cell: ({ row }) => (
        <div className="font-medium truncate">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "abbreviation",
      header: "Subject Abbr.",
    },
    {
      accessorKey: "code",
      header: "Subject Code",
    },
    {
      accessorKey: "semester",
      header: "Semester",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("semester")}</div>
      ),
    },
    {
      accessorKey: "unit",
      header: "Units",
      cell: ({ row }) => {
        const units = row.getValue("unit") as string[];
        return (
          <div className="flex flex-wrap gap-1 max-w-[200px]">
            {units.length > 0 ? (
              <>
                <Badge variant="secondary" className="truncate">
                  {units[0]}
                </Badge>
                {units.length > 1 && (
                  <Badge variant="outline">+{units.length - 1} more</Badge>
                )}
              </>
            ) : (
              <span className="text-muted-foreground">No units</span>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleEdit(row.original)}
            className="h-8 w-8 p-0 hover:bg-muted/80 transition-colors duration-200"
          >
            <Edit2 className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setSelectedSubject(row.original);
              setAlertOpen(true);
            }}
            className="h-8 w-8 p-0 transition-colors duration-200"
          >
            <Trash className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: filteredSubjects,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Toggle semester selection
  const toggleSemester = (semester: string) => {
    setSelectedSemesters((prev) =>
      prev.includes(semester)
        ? prev.filter((s) => s !== semester)
        : [...prev, semester]
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-5 space-y-2 md:space-y-6">
      {/* Header with title and add button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Manage Subjects
          </h2>
          <p className="text-neutral-700 dark:text-neutral-400 mt-1">
            Add, edit, and delete subjects
          </p>
        </div>

        <Button
          className="w-full sm:w-auto"
          onClick={() => setCreateModalOpen(true)}
        >
          <Plus className="size-5 mr-1" />
          Add Subject
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
        {/* Search Input with Clear Button */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />

          <Input
            placeholder="Search subjects by name or code"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10"
          />

          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors duration-200"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Semester Filter Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full md:w-fit transition-all duration-200"
            >
              <ListFilter className="mr-1 h-4 w-4" />
              Filter by Semester{" "}
              {selectedSemesters.length > 0 && `(${selectedSemesters.length})`}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-52 py-3 px-2 animate-scale-in">
            <div className="flex flex-col gap-2">
              {uniqueSemesters.length === 0 && (
                <p className="text-sm text-center text-muted-foreground">
                  No semesters found.
                </p>
              )}

              {uniqueSemesters.map((semester) => (
                <label
                  key={semester}
                  className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted/50 px-2 py-1 rounded-md transition-colors duration-200"
                >
                  <Checkbox
                    checked={selectedSemesters.includes(semester)}
                    onCheckedChange={() => toggleSemester(semester)}
                    className="transition-all duration-200"
                  />
                  {semester}
                </label>
              ))}

              {selectedSemesters.length > 0 && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-1 transition-all duration-200"
                  onClick={() => setSelectedSemesters([])}
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear Filters
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="shad-table-row-header">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="whitespace-nowrap md:whitespace-normal font-medium"
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
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <p>No subjects found.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Showing {table.getFilteredRowModel().rows.length} of {subjects.length}{" "}
          subjects
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="transition-all duration-200"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="transition-all duration-200"
          >
            Next
          </Button>
        </div>
      </div>

      {/* Edit Modal */}
      {selectedSubject && (
        <EditSubjectModal
          open={editModalOpen}
          closeModal={closeEditModal}
          subject={selectedSubject}
        />
      )}

      {/* Create Modal */}
      <CreateSubjectModal
        open={createModalOpen}
        closeModal={closeCreateModal}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent className="animate-scale-in">
          <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            subject
            <span className="font-medium">
              {selectedSubject?.name ? ` "${selectedSubject.name}"` : ""}
            </span>
            .
          </AlertDialogDescription>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel
              onClick={() => {
                setAlertOpen(false);
                setTimeout(() => {
                  setSelectedSubject(null);
                }, 300);
              }}
              className="transition-all duration-200"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 transition-all duration-200"
            >
              Delete Subject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default SubjectsTable;
