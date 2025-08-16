// components/admin_components/visual/FormLinksTable.tsx
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
import { Button } from "@/components/ui/button";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  type ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Edit2, ListFilter, Search, Trash, X } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormLink } from "@/lib/appwrite_types";
import { deleteFormLink } from "@/lib/actions/Form.actions";
import EditFormLink from "@/components/notes_page_components/google_form_components/EditFormLink";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

export function FormLinksTable({ initialLinks }: { initialLinks: FormLink[] }) {
  const [links, setLinks] = useState(initialLinks);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedLink, setSelectedLink] = useState<FormLink | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);

  useEffect(() => {
    setLinks(initialLinks);
  }, [initialLinks]);

  const uniqueTeachers = useMemo(
    () =>
      Array.from(new Set(links.map((link) => link.createdBy).filter(Boolean))),
    [links]
  );

  const filteredLinks = useMemo(() => {
    return links.filter((link) => {
      const matchesType = typeFilter === "all" || link.formType === typeFilter;
      const matchesTeacher =
        selectedTeachers.length === 0 ||
        selectedTeachers.includes(link.createdBy);
      const matchesSearch =
        searchQuery === "" ||
        link.quizName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesTeacher && matchesSearch;
    });
  }, [links, searchQuery, typeFilter, selectedTeachers]);

  const sortedLinks = useMemo(
    () =>
      [...filteredLinks].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [filteredLinks]
  );
  const toggleTeacher = (teacher: string) => {
    setSelectedTeachers((prev) =>
      prev.includes(teacher)
        ? prev.filter((t) => t !== teacher)
        : [...prev, teacher]
    );
  };

  const handleDelete = async () => {
    if (!selectedLink) return;
    const result = await deleteFormLink({
      id: selectedLink.id,
      semester: selectedLink.semester,
      abbreviation: selectedLink.abbreviation,
    });
    if (result.success) {
      toast.success("Link deleted successfully");
      setLinks((prev) => prev.filter((link) => link.id !== selectedLink.id));
    } else {
      toast.error("Error deleting link");
    }
    setDeleteAlertOpen(false);
    setSelectedLink(null);
  };

  const columns: ColumnDef<FormLink>[] = [
    { accessorKey: "quizName", header: "Name" },
    {
      accessorKey: "formType",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("formType") as string;
        const variant =
          type === "googleForm"
            ? "default"
            : type === "assignment"
              ? "secondary"
              : "outline";
        return (
          <Badge variant={variant} className="capitalize">
            {type.replace("googleForm", "Google Form")}
          </Badge>
        );
      },
    },
    { accessorKey: "createdBy", header: "Uploaded By" },
    { accessorKey: "abbreviation", header: "Subject" },
    {
      accessorKey: "createdAt",
      header: "Uploaded At",
      cell: ({ row }) =>
        format(new Date(row.getValue("createdAt")), "dd MMM yyyy"),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setSelectedLink(row.original);
              setEditModalOpen(true);
            }}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setSelectedLink(row.original);
              setDeleteAlertOpen(true);
            }}
          >
            <Trash className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: sortedLinks,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Forms by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => setSearchQuery("")}
            >
              <X size={16} />
            </Button>
          )}
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="googleForm">Google Form</SelectItem>
            <SelectItem value="assignment">Assignment</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full md:w-fit">
              <ListFilter className="mr-2 h-4 w-4" />
              Filter by Teacher{" "}
              {selectedTeachers.length > 0 && `(${selectedTeachers.length})`}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2">
            <div className="flex flex-col gap-1">
              {uniqueTeachers.map((teacher) => (
                <label
                  key={teacher}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer"
                >
                  <Checkbox
                    checked={selectedTeachers.includes(teacher)}
                    onCheckedChange={() => toggleTeacher(teacher)}
                  />
                  <span className="text-sm font-medium">{teacher}</span>
                </label>
              ))}
              {selectedTeachers.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-1 w-full"
                  onClick={() => setSelectedTeachers([])}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

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
                  No links found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            Showing {table.getRowModel().rows.length} of {links.length} forms.
          </div>
        </div>

        <div className="flex items-center space-x-2">
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

      {selectedLink && (
        <EditFormLink
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          id={selectedLink.id}
          url={selectedLink.url}
          quizName={selectedLink.quizName}
          formType={selectedLink.formType}
          semester={selectedLink.semester}
          abbreviation={selectedLink.abbreviation}
        />
      )}

      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            link.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
