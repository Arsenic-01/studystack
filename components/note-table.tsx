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

interface Note {
  createdAt: string;
  fileId: string;
  title: string;
  uploadedBy?: string;
  subjectName?: string;
}

export function NotesTable({ notes }: { notes: Note[] }) {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });

  // Reverse sorting the notes based on createdAt (latest first)
  const sortedNotes = useMemo(
    () =>
      [...notes].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [notes]
  );

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
  ];

  const table = useReactTable({
    data: sortedNotes,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      {notes.length === 0 ? (
        <div>No notes available.</div>
      ) : (
        <div className="rounded-md border border-neutral-200 dark:border-neutral-800">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="shad-table-row-header"
                >
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
      )}

      {/* Pagination Controls */}
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
  );
}
