import { MetadataRoute } from "next";
import { fetchAllSubjectsForSitemap } from "@/lib/actions/Subjects.actions";
import { hostedAt } from "@/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Static Pages (manually listed)
  const staticPages = [
    "/",
    "/home",
    "/about",
    "/about/project",
    "/contact",
    "/privacy-policy",
    "/cookie-policy",
    "/copyright-policy",
    "/terms-and-conditions",
    "/forgot-password",
    "/reset-password",
  ];

  const staticUrls = staticPages.map((page) => ({
    url: `${hostedAt}${page}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: page === "/" || page === "/home" ? 1.0 : 0.8,
  }));

  // 2. Dynamic Pages (fetched from Appwrite)
  const allSubjects = await fetchAllSubjectsForSitemap();

  // Create a unique set of semesters from the subjects data
  const uniqueSemesters = [...new Set(allSubjects.map((s) => s.sem))];

  // Generate semester page URLs
  const semesterUrls = uniqueSemesters.map((sem) => ({
    url: `${hostedAt}/semester/${sem}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Generate subject page URLs
  const subjectUrls = allSubjects.map(({ sem, sub }) => ({
    url: `${hostedAt}/semester/${sem}/${sub}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Combine all static and dynamic URLs
  return [...staticUrls, ...semesterUrls, ...subjectUrls];
}
