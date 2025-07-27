import { AdminDataTable } from "@/components/admin_components/visual/AdminDataTable";
import { fetchUsers } from "@/lib/actions/Admin.actions";
import AdminSkeleton from "@/components/admin_components/skeleton/AdminSkeleton";

export default async function DashboardPage() {
  const users = await fetchUsers();

  return (
    <div className="py-28 sm:py-32 lg:py-36 px-5 max-w-5xl mx-auto">
      {users.length ? (
        <AdminDataTable initialData={users} />
      ) : (
        <AdminSkeleton />
      )}
    </div>
  );
}
