// components/admin_components/visual/YoutubeLinksTable.tsx
"use client";

import EditYoutubeLink from "@/components/notes_page_components/youtube_components/EditYoutubeLink";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteYoutubeLink } from "@/lib/actions/Youtube.actions";
import { YoutubeLink } from "@/lib/appwrite_types";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { Edit2, ListFilter, Search, Trash, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export function YoutubeLinksTable({
  initialLinks,
}: {
  initialLinks: YoutubeLink[];
}) {
  const [links, setLinks] = useState(initialLinks);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLink, setSelectedLink] = useState<YoutubeLink | null>(null);
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
      const matchesTeacher =
        selectedTeachers.length === 0 ||
        selectedTeachers.includes(link.createdBy);

      const matchesSearch =
        searchQuery === "" ||
        link.title.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTeacher && matchesSearch;
    });
  }, [links, searchQuery, selectedTeachers]);

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
    const result = await deleteYoutubeLink({
      id: selectedLink.id,
      semester: selectedLink.semester,
      abbreviation: selectedLink.abbreviation,
    });

    if (result.success) {
      toast.success("YouTube link deleted successfully");
      setLinks((prev) => prev.filter((link) => link.id !== selectedLink.id));
    } else {
      toast.error("Error deleting link");
    }
    setDeleteAlertOpen(false);
    setSelectedLink(null);
  };

  const columns: ColumnDef<YoutubeLink>[] = [
    { accessorKey: "title", header: "Title" },
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
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Youtube links by title..."
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
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full sm:w-fit">
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
                  No YouTube links found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            Showing {table.getRowModel().rows.length} of {links.length} links.
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

      {selectedLink && (
        <EditYoutubeLink
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          id={selectedLink.id}
          url={selectedLink.youtubeLink}
          title={selectedLink.title}
          semester={selectedLink.semester}
          abbreviation={selectedLink.abbreviation}
        />
      )}

      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            YouTube link.
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
