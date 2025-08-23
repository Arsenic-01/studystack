// hooks/useAdminData.ts
"use client";

import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchPaginatedUsers,
  fetchPaginatedNotesForAdmin,
  fetchPaginatedLinksForAdmin,
  fetchPaginatedSubjects,
  getNotesFilterOptions,
  getLinksFilterOptions,
  getSemesterOptions,
} from "@/lib/actions/AdminFetching.actions";
import { updateUser, deleteUser } from "@/lib/actions/Admin.actions";
import { deleteNote, editNotes } from "@/lib/actions/Notes.actions";

// ============================================
// USERS HOOKS
// ============================================

export function useAdminUsers({
  search = "",
  role = "all",
  limit = 10,
}: {
  search?: string;
  role?: string;
  limit?: number;
}) {
  return useInfiniteQuery({
    queryKey: ["admin-users", { search, role, limit }],
    queryFn: ({ pageParam = 0 }) =>
      fetchPaginatedUsers({
        limit,
        offset: pageParam * limit,
        search,
        role,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.length * limit;
      return totalFetched < lastPage.total ? allPages.length : undefined;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
}

// ============================================
// NOTES HOOKS
// ============================================

export function useAdminNotes({
  search = "",
  typeFilter = "all",
  teacherFilter = "all",
  limit = 10,
}: {
  search?: string;
  typeFilter?: string;
  teacherFilter?: string;
  limit?: number;
}) {
  return useInfiniteQuery({
    queryKey: ["admin-notes", { search, typeFilter, teacherFilter, limit }],
    queryFn: ({ pageParam = 0 }) =>
      fetchPaginatedNotesForAdmin({
        limit,
        offset: pageParam * limit,
        search,
        typeFilter,
        teacherFilter,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.length * limit;
      return totalFetched < lastPage.total ? allPages.length : undefined;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useNotesFilterOptions() {
  return useQuery({
    queryKey: ["notes-filter-options"],
    queryFn: getNotesFilterOptions,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editNotes,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-notes"] });
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-notes"] });
    },
  });
}

// ============================================
// LINKS HOOKS
// ============================================

export function useAdminLinks({
  search = "",
  typeFilter = "all",
  teacherFilter = "all",
  limit = 10,
}: {
  search?: string;
  typeFilter?: string;
  teacherFilter?: string;
  limit?: number;
}) {
  return useInfiniteQuery({
    queryKey: ["admin-links", { search, typeFilter, teacherFilter, limit }],
    queryFn: ({ pageParam = 0 }) =>
      fetchPaginatedLinksForAdmin({
        limit,
        offset: pageParam * limit,
        search,
        typeFilter,
        teacherFilter,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.length * limit;
      return totalFetched < lastPage.total ? allPages.length : undefined;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useLinksFilterOptions() {
  return useQuery({
    queryKey: ["links-filter-options"],
    queryFn: getLinksFilterOptions,
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

// ============================================
// SUBJECTS HOOKS
// ============================================

export function useAdminSubjects({
  search = "",
  semesterFilter = "all",
  limit = 10,
}: {
  search?: string;
  semesterFilter?: string;
  limit?: number;
}) {
  return useInfiniteQuery({
    queryKey: ["admin-subjects", { search, semesterFilter, limit }],
    queryFn: ({ pageParam = 0 }) =>
      fetchPaginatedSubjects({
        limit,
        offset: pageParam * limit,
        search,
        semesterFilter,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.length * limit;
      return totalFetched < lastPage.total ? allPages.length : undefined;
    },
    initialPageParam: 0,
    staleTime: 10 * 60 * 1000, // Subjects change less frequently
    gcTime: 20 * 60 * 1000,
  });
}

export function useSemesterOptions() {
  return useQuery({
    queryKey: ["semester-options"],
    queryFn: getSemesterOptions,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
}

// ============================================
// UTILITY HOOKS
// ============================================

// Hook for prefetching next page data
export function usePrefetchNextPage(
  queryKey: string[],
  hasNextPage: boolean,
  fetchNextPage: () => void
) {
  const queryClient = useQueryClient();

  const prefetchNext = () => {
    if (hasNextPage) {
      queryClient.prefetchInfiniteQuery({
        queryKey,
        queryFn: fetchNextPage as any,
        initialPageParam: 1,
        staleTime: 5 * 60 * 1000,
      });
    }
  };

  return prefetchNext;
}

// Hook for real-time cache invalidation
export function useInvalidateAdminQueries() {
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    queryClient.invalidateQueries({ queryKey: ["admin-notes"] });
    queryClient.invalidateQueries({ queryKey: ["admin-links"] });
    queryClient.invalidateQueries({ queryKey: ["admin-subjects"] });
  };

  const invalidateUsers = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-users"] });
  };

  const invalidateNotes = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-notes"] });
  };

  const invalidateLinks = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-links"] });
  };

  const invalidateSubjects = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-subjects"] });
  };

  return {
    invalidateAll,
    invalidateUsers,
    invalidateNotes,
    invalidateLinks,
    invalidateSubjects,
  };
}
