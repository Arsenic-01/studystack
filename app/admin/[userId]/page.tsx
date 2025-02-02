import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { UsersTable } from "@/components/table/data-table";
import { fetchUsers } from "@/lib/actions/Admin.actions";

export default async function DashboardPage() {
  const users = await fetchUsers();

  return (
    <div className="container mx-auto py-36 xl:py-40 md:max-w-6xl px-5">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <Suspense fallback={<Skeleton className="w-full h-[400px]" />}>
        <UsersTable initialData={users} />
      </Suspense>
    </div>
  );
}
