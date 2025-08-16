import { AdminDataTable } from "@/components/admin_components/visual/AdminDataTable";
import { fetchUsers, getLoginHistory } from "@/lib/actions/Admin.actions";
import { fetchAllFormLinks } from "@/lib/actions/Form.actions";
import { fetchAllNotes } from "@/lib/actions/Notes.actions";
import { fetchAllYoutubeLinks } from "@/lib/actions/Youtube.actions";

export default async function DashboardPage() {
  const [users, loginHistory, notes, youtubeLinks, formLinks] =
    await Promise.all([
      fetchUsers(),
      getLoginHistory(),
      fetchAllNotes(),
      fetchAllYoutubeLinks(),
      fetchAllFormLinks(),
    ]);

  return (
    <div className="py-28 sm:py-32 lg:py-36 px-5 max-w-5xl mx-auto">
      <AdminDataTable
        initialUsers={users}
        initialLoginHistory={loginHistory!}
        initialNotes={notes!}
        initialYoutubeLinks={youtubeLinks}
        initialFormLinks={formLinks}
      />
    </div>
  );
}
