"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  deleteUser,
  fetchUsers,
  getLoginHistory,
} from "@/lib/actions/Admin.actions";
import { fetchAllNotes } from "@/lib/actions/Notes.actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  MoreHorizontal,
  PlusCircle,
  Search,
  Settings2,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "../../../store/authStore";
import { ActiveUsersChart } from "./ActiveUsers";
import AdminSkeleton from "../skeleton/AdminSkeleton";
import { ActivityChart } from "./AdminBarChart";
import RefreshButton from "../admin_helper_components/RefreshButton";
import { NotesTable } from "./AdminNotesTable";
import { TeacherNotesChart } from "./TeacherNotesChart";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "../../ui/alert-dialog";
import { UpdateUserDialog } from "../admin_helper_components/UpdateUserModal";
import { UserLogDialog } from "../admin_helper_components/UserLogDialog";
import StatCard from "./StatCard";

type Role = "admin" | "teacher" | "student";

export type User = {
  id: string;
  prnNo: string;
  role: Role;
  email: string;
  name: string;
  password: string;
  // loginHistory: string[];
};

interface UsersTableProps {
  initialData: User[];
}

export function AdminDataTable({ initialData }: UsersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [updateUserData, setUpdateUserData] = useState<User | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [userLogData, setUserLogData] = useState<User | null>(null);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();

  const { data: users = initialData } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
    initialData,
    staleTime: 1000 * 60 * 10,
    refetchInterval: 1000 * 60 * 10,
  });

  const { data: loginHistory = [] } = useQuery({
    queryKey: ["loginHistory"],
    queryFn: getLoginHistory,
    staleTime: 1000 * 60 * 10,
    refetchInterval: 1000 * 60 * 10,
  });

  const { data: notes = [] } = useQuery({
    queryKey: ["notes"],
    queryFn: fetchAllNotes,
    initialData: [],
    refetchOnWindowFocus: false,
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
            <DropdownMenuItem onClick={() => setUserLogData(row.original)}>
              View user log
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

  const searchValue =
    (table.getColumn("name")?.getFilterValue() as string) ?? "";

  const studentCount = users.filter((user) => user.role === "student").length;
  const teacherCount = users.filter((user) => user.role === "teacher").length;
  const now = new Date();
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

  const activeUsers = new Set(
    loginHistory
      .filter((entry) =>
        entry.loginTime.some((time: string) => new Date(time) > last24Hours)
      )
      .map((entry) => entry.userId)
  ).size;

  return (
    <div>
      {isLoggedIn ? (
        <>
          <div className="container mx-auto">
            <div className="flex items-start justify-between mb-5 sm:mb-8">
              <h1 className="text-3xl tracking-tighter font-bold">
                Admin Dashboard
              </h1>
              <RefreshButton />
            </div>
            <StatCard
              studentCount={studentCount}
              teacherCount={teacherCount}
              noteCount={notes.length}
              activeUsers={activeUsers}
            />

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between pt-0 pb-4 sm:py-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by Name"
                  value={searchValue}
                  onChange={(e) =>
                    table.getColumn("name")?.setFilterValue(e.target.value)
                  }
                  className="w-full pl-10 pr-10"
                />
                {searchValue && (
                  <X
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer"
                    onClick={() => table.getColumn("name")?.setFilterValue("")}
                  />
                )}
              </div>
              <div className="flex flex-col md:flex-row gap-3 md:gap-2 w-full md:w-fit justify-end">
                <Button
                  onClick={() => router.push("/admin/subjects")}
                  variant="secondary"
                  className="w-full md:w-auto inline-flex justify-center items-center gap-2"
                >
                  Manage Subjects
                  <Settings2 className="h-6 w-6 text-green-600" />
                </Button>
                <Button
                  onClick={() => router.push("/admin/register")}
                  className="w-full md:w-auto inline-flex justify-center items-center gap-2"
                >
                  Register new user
                  <PlusCircle className="h-6 w-6 text-green-600" />
                </Button>
              </div>
            </div>

            <div className="rounded-md border border-neutral-200 dark:border-neutral-800">
              <Table className="shad-table">
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow
                      key={headerGroup.id}
                      className="shad-table-row-header"
                    >
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
                        className="shad-table-row"
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
              <div className="table-actions">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="shad-gray-btn"
                >
                  <Image src="/arrow.svg" width={24} height={24} alt="arrow" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="shad-gray-btn"
                >
                  <Image
                    src="/arrow.svg"
                    width={24}
                    height={24}
                    alt="arrow "
                    className="rotate-180"
                  />
                </Button>
              </div>
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

            {userLogData && (
              <UserLogDialog
                user={userLogData}
                open={!!userLogData}
                onClose={() => setUserLogData(null)}
              />
            )}

            <AlertDialog
              open={!!deleteUserId}
              onOpenChange={() => setDeleteUserId(null)}
            >
              <AlertDialogContent>
                <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  user.
                </AlertDialogDescription>

                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      if (deleteUserId) deleteMutation.mutate(deleteUserId);
                      setDeleteUserId(null);
                    }}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <div className="py-5">
              <ActivityChart notes={notes} loginHistory={loginHistory} />
            </div>
            <div>
              <NotesTable notes={notes} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <ActiveUsersChart users={users} loginHistory={loginHistory} />
              <TeacherNotesChart notes={notes} users={users} />
            </div>
          </div>
        </>
      ) : (
        <AdminSkeleton />
      )}
    </div>
  );
}
