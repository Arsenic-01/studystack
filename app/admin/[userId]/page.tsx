import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { UsersTable } from "@/components/table/data-table";
import { fetchUsers } from "@/lib/actions/Admin.actions";

export default async function DashboardPage() {
  const users = await fetchUsers();

  return (
    <div className="">
      <Suspense fallback={<Skeleton className="w-full h-[400px]" />}>
        <UsersTable initialData={users} />
      </Suspense>
    </div>
  );
}
