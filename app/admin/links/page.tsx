// app/admin/links/page.tsx
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
import { useAdminLinks, useLinksFilterOptions } from "@/hooks/useAdminData";
import { useDebounce } from "@/hooks/useDebounce";
import { deleteFormLink } from "@/lib/actions/Form.actions";
import { deleteYoutubeLink } from "@/lib/actions/Youtube.actions";
import { format } from "date-fns";
import {
  Edit,
  ExternalLink,
  FileText,
  Filter,
  MoreVertical,
  Search,
  Trash2,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

const typeColors = {
  youtube: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  form: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
};

const formTypeColors = {
  googleForm:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  assignment:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  other: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
};

export default function AdminLinksPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [teacherFilter, setTeacherFilter] = useState("all");
  const [deleteLinkData, setDeleteLinkData] = useState<{
    id: string;
    type: "youtube" | "form";
    title: string;
  } | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  const {
    data: linksData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useAdminLinks({
    search: debouncedSearch,
    typeFilter,
    teacherFilter,
    limit: 15,
  });

  const { data: filterOptions } = useLinksFilterOptions();

  const allLinks = React.useMemo(() => {
    return linksData?.pages.flatMap((page) => page.documents) ?? [];
  }, [linksData]);

  const totalCount = linksData?.pages[0]?.total ?? 0;

  const handleDeleteLink = async () => {
    if (!deleteLinkData) return;

    try {
      if (deleteLinkData.type === "youtube") {
        await deleteYoutubeLink({ id: deleteLinkData.id });
      } else {
        await deleteFormLink({ id: deleteLinkData.id });
      }
      toast.success("Link deleted successfully");
      setDeleteLinkData(null);
    } catch (error) {
      toast.error("Failed to delete link");
      console.error("Delete link error:", error);
    }
  };

  const getTypeIcon = (type: "youtube" | "form") => {
    return type === "youtube" ? Youtube : FileText;
  };

  const getTypeLabel = (type: "youtube" | "form") => {
    return type === "youtube" ? "YouTube" : "Form";
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-destructive">
            Error loading links
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
            Links Management
          </h1>
          <p className="text-muted-foreground">
            Manage YouTube links, forms, and other external resources
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
          <CardDescription>Search and filter links</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search links by title..."
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
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="form">Forms</SelectItem>
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

      {/* Links Table */}
      <Card>
        <CardHeader>
          <CardTitle>Links ({totalCount.toLocaleString()})</CardTitle>
          <CardDescription>
            All YouTube links and forms in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Created</TableHead>
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
                ) : allLinks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <div className="text-muted-foreground">
                        {debouncedSearch ||
                        typeFilter !== "all" ||
                        teacherFilter !== "all"
                          ? "No links found matching your filters"
                          : "No links found"}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  allLinks.map((link) => {
                    const TypeIcon = getTypeIcon(link.type);
                    return (
                      <TableRow key={link.id}>
                        <TableCell className="font-medium max-w-xs">
                          <div className="flex items-center gap-2">
                            <TypeIcon className="h-4 w-4 text-muted-foreground" />
                            <div className="truncate" title={link.title}>
                              {link.title}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Badge
                              variant="secondary"
                              className={typeColors[link.type]}
                            >
                              {getTypeLabel(link.type)}
                            </Badge>
                            {link.formType && (
                              <Badge
                                variant="outline"
                                className={formTypeColors[link.formType]}
                              >
                                {link.formType === "googleForm"
                                  ? "Google Form"
                                  : link.formType === "assignment"
                                    ? "Assignment"
                                    : "Other"}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {link.createdBy}
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-sm">
                            {link.abbreviation}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(link.createdAt), "MMM dd, yyyy")}
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
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  Open Link
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Link
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() =>
                                  setDeleteLinkData({
                                    id: link.id,
                                    type: link.type,
                                    title: link.title,
                                  })
                                }
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Link
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteLinkData}
        onOpenChange={() => setDeleteLinkData(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              link &quot;{deleteLinkData?.title}&quot; from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteLink}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Link
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
