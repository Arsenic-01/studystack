import NotesFilterSkeleton from "@/components/notes_page_components/skeleton/NotesFilterSkeleton";

// This component will be AUTOMATICALLY shown by Next.js
// while the data on your page is being fetched on the server.
export default function Loading() {
  return <NotesFilterSkeleton />;
}
