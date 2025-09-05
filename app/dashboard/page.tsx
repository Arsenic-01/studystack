// app/dashboard/page.tsx

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SessionUser } from "@/lib/appwrite_types";
import { FileText, Link, Video } from "lucide-react";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { AddContentModal } from "./_components/AddContentModal";
import { EmptyState } from "./_components/EmptyState";
import FormsTabClient from "./_components/FormsTabClient";
import NotesTabClient from "./_components/NotesTabClient";
import YoutubeTabClient from "./_components/YoutubeTabClient";
import {
  getUserForms,
  getUserNotes,
  getUserYoutubeLinks,
} from "./getAdminData";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Manage all your uploaded notes, videos, and forms in one place.",
};

const NOTES_PER_PAGE = 6;
const LINKS_PER_PAGE = 3;

export default async function TeacherDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user || !["teacher", "admin"].includes(session.user.role)) {
    return redirect("/");
  }

  const user = session.user as SessionUser;

  const [userNotesData, userYoutubeLinksData, userFormsData] =
    await Promise.all([
      getUserNotes({
        userName: user.name!,
        limit: NOTES_PER_PAGE,
        offset: 0,
      }),
      getUserYoutubeLinks({
        userName: user.name!,
        limit: LINKS_PER_PAGE,
        offset: 0,
      }),
      getUserForms({
        userName: user.name!,
        limit: LINKS_PER_PAGE,
        offset: 0,
      }),
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
        <TabsList className="h-auto w-full md:w-fit md:h-10 md:flex-row">
          <TabsTrigger value="notes" className="w-full md:w-auto">
            My Notes ({userNotesData.total})
          </TabsTrigger>
          <TabsTrigger value="youtube" className="w-full md:w-auto">
            My Videos ({userYoutubeLinksData.total})
          </TabsTrigger>
          <TabsTrigger value="forms" className="w-full md:w-auto">
            My Links ({userFormsData.total})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="mt-6" forceMount>
          {userNotesData.total > 0 ? (
            <NotesTabClient
              initialNotes={userNotesData.documents}
              totalNotes={userNotesData.total}
              userName={user.name!}
            />
          ) : (
            <EmptyState
              icon={FileText}
              title="No Notes Found"
              description="You haven't uploaded any notes yet. Click 'Add Content' to get started."
            />
          )}
        </TabsContent>

        <TabsContent value="youtube" className="mt-6" forceMount>
          {userYoutubeLinksData.total > 0 ? (
            <YoutubeTabClient
              initialLinks={userYoutubeLinksData.documents}
              totalLinks={userYoutubeLinksData.total}
              userName={user.name!}
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

        <TabsContent value="forms" className="mt-6" forceMount>
          {userFormsData.total > 0 ? (
            <FormsTabClient
              initialForms={userFormsData.documents}
              totalForms={userFormsData.total}
              userName={user.name!}
              user={user}
            />
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
