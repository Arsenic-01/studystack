"use client";

import { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  type ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { deleteUser, fetchUsers } from "@/lib/actions/Admin.actions";
import { UpdateUserDialog } from "../update-user-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "../ui/dialog";
import { UserContext } from "@/context/UserContext";
type Role = "admin" | "teacher" | "student";

type User = {
  id: string;
  prnNo: string;
  role: Role;
  email: string;
  name: string;
};

interface UsersTableProps {
  initialData: User[];
}

export function UsersTable({ initialData }: UsersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [updateUserData, setUpdateUserData] = useState<User | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const router = useRouter();
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("UsersTable must be used within a UserContextProvider");
  }

  const { isLoggedIn } = userContext;

  const { data: users = initialData } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
    initialData,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully");
    },
  });

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "prnNo",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          PRN No
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-medium ml-4">{row.getValue("prnNo")}</span>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as string;

        return (
          <span
            className={`capitalize px-4 py-1 rounded-full font-medium
            ${
              role === "admin"
                ? "bg-red-900/20 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                : ""
            }
            ${
              role === "teacher"
                ? "bg-green-900/20 text-green-700 dark:bg-green-900/60 dark:text-green-500"
                : ""
            }
            ${
              role === "student"
                ? "bg-blue-900/20 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400"
                : ""
            }`}
          >
            {role}
          </span>
        );
      },
    },
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <span className="font-medium whitespace-nowrap md:whitespace-normal">
          {row.getValue("name")}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setUpdateUserData(row.original)}>
              Update user
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDeleteUserId(row.original.id)}>
              Delete user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, columnFilters },
  });

  return (
    <div>
      {isLoggedIn ? (
        <>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between py-4">
            <Input
              placeholder="Search user by name"
              value={
                (table.getColumn("name")?.getFilterValue() as string) ?? ""
              }
              onChange={(e) =>
                table.getColumn("name")?.setFilterValue(e.target.value)
              }
              className="w-full sm:max-w-sm"
            />
            <Button
              onClick={() => router.push("/admin/register")}
              className="w-full sm:w-auto"
            >
              Register new user
            </Button>
          </div>

          <div className="rounded-md border border-neutral-200 dark:border-neutral-800">
            <Table>
              <TableHeader className="bg-neutral-50 dark:bg-neutral-900">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
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
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
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

          {updateUserData && (
            <UpdateUserDialog
              user={updateUserData}
              onClose={() => setUpdateUserData(null)}
              onUpdate={() => {
                queryClient.invalidateQueries({ queryKey: ["users"] });
                setUpdateUserData(null);
                toast.success("User updated successfully");
              }}
            />
          )}

          <Dialog
            open={!!deleteUserId}
            onOpenChange={() => setDeleteUserId(null)}
          >
            <DialogContent>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <p>Are you sure you want to delete this user?</p>
              <div className="flex justify-end gap-2 mt-4">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (deleteUserId) deleteMutation.mutate(deleteUserId);
                    setDeleteUserId(null);
                  }}
                >
                  Confirm Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <div className="flex flex-col gap-4 items-center justify-center w-full py-20 md:py-36 px-3">
          <h1 className="text-3xl font-bold">
            You need to be logged in to see this page
          </h1>
          <Button onClick={() => router.push("/login")}>Login</Button>
        </div>
      )}
    </div>
  );
}
