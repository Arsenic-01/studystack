import { GoogleFormCard } from "@/components/notes_page_components/google_form_components/GoogleFormCard";
import NoteCard from "@/components/notes_page_components/notes_helper_components/NoteCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserForms } from "@/lib/actions/Form.actions";
import { getUserNotes } from "@/lib/actions/Notes.actions";
import { getUserYoutubeLinks } from "@/lib/actions/Youtube.actions";
import { Form, Note, SessionUser } from "@/lib/appwrite_types";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { AddContentModal } from "./_components/AddContentModal";
import YoutubeLinksClient from "./_components/YoutubeLinksClient";
import { EmptyState } from "./_components/EmptyState";
import { FileText, Link, Video } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Manage all your uploaded notes, videos, and forms in one place.",
};

export default async function TeacherDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user || !["teacher", "admin"].includes(session.user.role)) {
    return redirect("/");
  }

  const user = session.user as SessionUser;

  const [userNotes, userYoutubeLinks, userForms] = await Promise.all([
    getUserNotes(user.name!),
    getUserYoutubeLinks(user.name!),
    getUserForms(user.name!),
  ]);

  return (
    <div className="container mx-auto min-h-screen py-24 sm:py-32 max-w-5xl px-5 xl:px-0">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-8 gap-0 md:gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome, {user.name}
          </h1>
          <p className="text-muted-foreground">
            Manage all your uploaded content in one place.
          </p>
        </div>
        <AddContentModal />
      </div>

      <Tabs defaultValue="notes" className="w-full">
        {/* Updated TabsList for responsiveness */}
        <TabsList className="h-auto w-full md:w-fit md:h-10 md:flex-row">
          <TabsTrigger value="notes" className="w-full md:w-auto">
            My Notes ({userNotes.total})
          </TabsTrigger>
          <TabsTrigger value="youtube" className="w-full md:w-auto">
            My Videos ({userYoutubeLinks.total})
          </TabsTrigger>
          <TabsTrigger value="forms" className="w-full md:w-auto">
            My Links ({userForms.total})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="mt-6">
          {userNotes.total > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userNotes.documents.map((note: Note) => (
                <NoteCard key={note.noteId} note={note} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={FileText}
              title="No Notes Found"
              description="You haven't uploaded any notes yet. Click 'Add Content' to get started."
            />
          )}
        </TabsContent>

        <TabsContent value="youtube" className="mt-6">
          {userYoutubeLinks.total > 0 ? (
            <YoutubeLinksClient
              links={userYoutubeLinks.documents}
              user={user}
            />
          ) : (
            <EmptyState
              icon={Video}
              title="No Videos Found"
              description="You haven't added any YouTube videos yet. Click 'Add Content' to share a video."
            />
          )}
        </TabsContent>

        <TabsContent value="forms" className="mt-6">
          {userForms.total > 0 ? (
            <div className="flex flex-col gap-4">
              {userForms.documents.map((form: Form) => (
                <GoogleFormCard
                  key={form.id}
                  form={form}
                  user={user}
                  semester={form.semester}
                  abbreviation={form.abbreviation}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Link}
              title="No Links Found"
              description="You haven't added any links yet. Click 'Add Content' to share a resource."
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
