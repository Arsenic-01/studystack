// lib/actions/AdminFetching.actions.ts - ULTRA LIGHTWEIGHT VERSION
"use server";

import {
  db,
  DATABASE_ID,
  USER_COLLECTION_ID,
  Query,
  NOTE_COLLECTION_ID,
  YOUTUBE_COLLECTION_ID,
  FORM_COLLECTION_ID,
  SUBJECT_COLLECTION_ID,
} from "@/lib/appwrite";

// ============================================
// DASHBOARD STATS (Only counts - 5 documents total)
// ============================================

export async function fetchAdminDashboardStats() {
  try {
    // Only fetch 1 document from each collection to get total count efficiently
    const [users, notes, youtubeLinks, formLinks, subjects] = await Promise.all(
      [
        db.listDocuments(DATABASE_ID!, USER_COLLECTION_ID!, [Query.limit(1)]),
        db.listDocuments(DATABASE_ID!, NOTE_COLLECTION_ID!, [Query.limit(1)]),
        db.listDocuments(DATABASE_ID!, YOUTUBE_COLLECTION_ID!, [
          Query.limit(1),
        ]),
        db.listDocuments(DATABASE_ID!, FORM_COLLECTION_ID!, [Query.limit(1)]),
        db.listDocuments(DATABASE_ID!, SUBJECT_COLLECTION_ID!, [
          Query.limit(1),
        ]),
      ]
    );

    return {
      totalUsers: users.total,
      totalNotes: notes.total,
      totalYoutubeLinks: youtubeLinks.total,
      totalFormLinks: formLinks.total,
      totalSubjects: subjects.total,
      totalLinks: youtubeLinks.total + formLinks.total,
    };
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return {
      totalUsers: 0,
      totalNotes: 0,
      totalYoutubeLinks: 0,
      totalFormLinks: 0,
      totalSubjects: 0,
      totalLinks: 0,
    };
  }
}

// ============================================
// TINY RECENT ACTIVITY (10 documents max)
// ============================================

export async function fetchRecentActivity() {
  try {
    // Only fetch 3 most recent items from each type
    const [recentNotes, recentUsers, recentYoutube, recentForms] =
      await Promise.all([
        db.listDocuments(DATABASE_ID!, NOTE_COLLECTION_ID!, [
          Query.orderDesc("$createdAt"),
          Query.limit(3),
        ]),
        db.listDocuments(DATABASE_ID!, USER_COLLECTION_ID!, [
          Query.orderDesc("$createdAt"),
          Query.limit(2),
        ]),
        db.listDocuments(DATABASE_ID!, YOUTUBE_COLLECTION_ID!, [
          Query.orderDesc("$createdAt"),
          Query.limit(2),
        ]),
        db.listDocuments(DATABASE_ID!, FORM_COLLECTION_ID!, [
          Query.orderDesc("$createdAt"),
          Query.limit(3),
        ]),
      ]);

    const activities = [
      ...recentNotes.documents.map((doc) => ({
        type: "note" as const,
        title: doc.title,
        user: doc.userName || "Unknown",
        timestamp: doc.$createdAt,
      })),
      ...recentUsers.documents.map((doc) => ({
        type: "user" as const,
        title: `New ${doc.role} registered`,
        user: doc.name,
        timestamp: doc.$createdAt,
      })),
      ...recentYoutube.documents.map((doc) => ({
        type: "youtube" as const,
        title: doc.title,
        user: doc.createdBy,
        timestamp: doc.$createdAt,
      })),
      ...recentForms.documents.map((doc) => ({
        type: "form" as const,
        title: doc.title,
        user: doc.createdBy,
        timestamp: doc.$createdAt,
      })),
    ];

    // Sort by timestamp and take latest 8
    activities.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return activities.slice(0, 8);
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return [];
  }
}

// ============================================
// PAGINATION FUNCTIONS (CLIENT-SIDE ONLY)
// ============================================

export async function fetchPaginatedUsers({
  limit = 10,
  offset = 0,
  search = "",
  role = "all",
}: {
  limit?: number;
  offset?: number;
  search?: string;
  role?: string;
}) {
  try {
    const queries = [
      Query.orderDesc("$createdAt"),
      Query.limit(limit),
      Query.offset(offset),
    ];

    if (search && search.trim() !== "") {
      queries.push(Query.search("name", search));
    }

    if (role && role !== "all") {
      queries.push(Query.equal("role", role));
    }

    const response = await db.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      queries
    );

    return {
      documents: response.documents.map((doc) => ({
        id: doc.$id,
        prnNo: doc.prnNo,
        name: doc.name,
        role: doc.role as "admin" | "student" | "teacher",
        email: doc.email,
        createdAt: doc.$createdAt,
      })),
      total: response.total,
    };
  } catch (error) {
    console.error("Error fetching paginated users:", error);
    return { documents: [], total: 0 };
  }
}

export async function fetchPaginatedNotesForAdmin({
  limit = 10,
  offset = 0,
  search = "",
  typeFilter = "all",
  teacherFilter = "all",
}: {
  limit?: number;
  offset?: number;
  search?: string;
  typeFilter?: string;
  teacherFilter?: string;
}) {
  try {
    const queries = [
      Query.orderDesc("$createdAt"),
      Query.limit(limit),
      Query.offset(offset),
    ];

    if (search && search.trim() !== "") {
      queries.push(Query.search("title", search));
    }

    if (typeFilter && typeFilter !== "all") {
      queries.push(Query.equal("type_of_file", typeFilter));
    }

    if (teacherFilter && teacherFilter !== "all") {
      queries.push(Query.equal("userName", teacherFilter));
    }

    const response = await db.listDocuments(
      DATABASE_ID!,
      NOTE_COLLECTION_ID!,
      queries
    );

    const documents = response.documents.map((doc) => ({
      noteId: doc.$id,
      title: doc.title,
      description: doc.description,
      createdAt: doc.$createdAt,
      fileId: doc.fileId,
      semester: doc.semester || "",
      type_of_file: doc.type_of_file || "",
      unit: doc.unit || [],
      users: {
        name: doc.userName || "Unknown User",
        userId: doc.userId || "",
      },
      abbreviation: doc.abbreviation || "",
      fileUrl: doc.fileUrl || "",
      mimeType: doc.mimeType || "",
      fileSize: doc.fileSize || "",
      thumbNail: doc.thumbNail || "",
    }));

    return {
      documents,
      total: response.total,
    };
  } catch (error) {
    console.error("Error fetching paginated notes for admin:", error);
    return { documents: [], total: 0 };
  }
}

// Get filter options for notes
export async function getNotesFilterOptions() {
  try {
    const response = await db.listDocuments(DATABASE_ID!, NOTE_COLLECTION_ID!, [
      Query.limit(100),
    ]);

    const typeOptions = [
      ...new Set(
        response.documents.map((doc) => doc.type_of_file).filter(Boolean)
      ),
    ];
    const teacherOptions = [
      ...new Set(response.documents.map((doc) => doc.userName).filter(Boolean)),
    ];

    return {
      typeOptions,
      teacherOptions,
    };
  } catch (error) {
    console.error("Error fetching filter options:", error);
    return {
      typeOptions: [],
      teacherOptions: [],
    };
  }
}

// ============================================
// LINKS MANAGEMENT
// ============================================

export interface AdminLink {
  id: string;
  title: string;
  url: string;
  createdBy: string;
  abbreviation: string;
  semester: string;
  createdAt: string;
  type: "youtube" | "form";
  formType?: "googleForm" | "assignment" | "other";
}

export async function fetchPaginatedLinksForAdmin({
  limit = 10,
  offset = 0,
  search = "",
  typeFilter = "all",
  teacherFilter = "all",
}: {
  limit?: number;
  offset?: number;
  search?: string;
  typeFilter?: string;
  teacherFilter?: string;
}) {
  try {
    let allLinks: AdminLink[] = [];
    let totalCount = 0;

    const buildQueries = (baseLimit: number, baseOffset: number) => {
      const queries = [
        Query.orderDesc("$createdAt"),
        Query.limit(baseLimit),
        Query.offset(baseOffset),
      ];

      if (search && search.trim() !== "") {
        queries.push(Query.search("title", search));
      }

      if (teacherFilter && teacherFilter !== "all") {
        queries.push(Query.equal("createdBy", teacherFilter));
      }

      return queries;
    };

    if (typeFilter === "all" || typeFilter === "youtube") {
      const youtubeResponse = await db.listDocuments(
        DATABASE_ID!,
        YOUTUBE_COLLECTION_ID!,
        buildQueries(limit, offset)
      );

      const youtubeLinks = youtubeResponse.documents.map((doc) => ({
        id: doc.$id,
        title: doc.title,
        url: doc.url,
        createdBy: doc.createdBy,
        abbreviation: doc.abbreviation,
        semester: doc.semester,
        createdAt: doc.$createdAt,
        type: "youtube" as const,
      }));

      allLinks.push(...youtubeLinks);
      totalCount += youtubeResponse.total;
    }

    if (typeFilter === "all" || typeFilter === "form") {
      const formResponse = await db.listDocuments(
        DATABASE_ID!,
        FORM_COLLECTION_ID!,
        buildQueries(limit, offset)
      );

      const formLinks = formResponse.documents.map((doc) => ({
        id: doc.$id,
        title: doc.title,
        url: doc.url,
        createdBy: doc.createdBy,
        abbreviation: doc.abbreviation,
        semester: doc.semester,
        createdAt: doc.$createdAt,
        type: "form" as const,
        formType: doc.formType,
      }));

      allLinks.push(...formLinks);
      totalCount += formResponse.total;
    }

    allLinks.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    if (typeFilter === "all") {
      allLinks = allLinks.slice(offset, offset + limit);
    }

    return {
      documents: allLinks,
      total: totalCount,
    };
  } catch (error) {
    console.error("Error fetching paginated links for admin:", error);
    return { documents: [], total: 0 };
  }
}

export async function getLinksFilterOptions() {
  try {
    const [youtubeResponse, formResponse] = await Promise.all([
      db.listDocuments(DATABASE_ID!, YOUTUBE_COLLECTION_ID!, [Query.limit(50)]),
      db.listDocuments(DATABASE_ID!, FORM_COLLECTION_ID!, [Query.limit(50)]),
    ]);

    const allDocs = [...youtubeResponse.documents, ...formResponse.documents];
    const teacherOptions = [
      ...new Set(allDocs.map((doc) => doc.createdBy).filter(Boolean)),
    ];

    return {
      teacherOptions,
    };
  } catch (error) {
    console.error("Error fetching links filter options:", error);
    return {
      teacherOptions: [],
    };
  }
}

// ============================================
// SUBJECTS MANAGEMENT
// ============================================

export async function fetchPaginatedSubjects({
  limit = 10,
  offset = 0,
  search = "",
  semesterFilter = "all",
}: {
  limit?: number;
  offset?: number;
  search?: string;
  semesterFilter?: string;
}) {
  try {
    const queries = [
      Query.orderAsc("semester"),
      Query.orderAsc("name"),
      Query.limit(limit),
      Query.offset(offset),
    ];

    if (search && search.trim() !== "") {
      queries.push(Query.search("name", search));
    }

    if (semesterFilter && semesterFilter !== "all") {
      queries.push(Query.equal("semester", semesterFilter));
    }

    const response = await db.listDocuments(
      DATABASE_ID!,
      SUBJECT_COLLECTION_ID!,
      queries
    );

    return {
      documents: response.documents.map((doc) => ({
        subjectId: doc.$id,
        name: doc.name,
        abbreviation: doc.abbreviation,
        code: doc.code,
        semester: doc.semester,
        unit: doc.unit || [],
      })),
      total: response.total,
    };
  } catch (error) {
    console.error("Error fetching paginated subjects:", error);
    return { documents: [], total: 0 };
  }
}

export async function getSemesterOptions() {
  try {
    const response = await db.listDocuments(
      DATABASE_ID!,
      SUBJECT_COLLECTION_ID!,
      [Query.limit(50)]
    );

    const semesterOptions = [
      ...new Set(response.documents.map((doc) => doc.semester).filter(Boolean)),
    ];

    return semesterOptions.sort();
  } catch (error) {
    console.error("Error fetching semester options:", error);
    return [];
  }
}
