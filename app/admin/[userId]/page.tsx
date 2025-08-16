import { AdminDataTable } from "@/components/admin_components/visual/AdminDataTable";
import { fetchUsers, getLoginHistory } from "@/lib/actions/Admin.actions";
import { fetchAllNotes } from "@/lib/actions/Notes.actions";

export default async function DashboardPage() {
  const [users, loginHistory, notes] = await Promise.all([
    fetchUsers(),
    getLoginHistory(),
    fetchAllNotes(),
  ]);

  return (
    <div className="py-28 sm:py-32 lg:py-36 px-5 max-w-5xl mx-auto">
      <AdminDataTable
        initialUsers={users}
        initialLoginHistory={loginHistory!}
        initialNotes={notes!}
      />
    </div>
  );
}
