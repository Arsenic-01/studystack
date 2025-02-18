import { UsersTable } from '@/components/table/data-table';
import { fetchUsers } from '@/lib/actions/Admin.actions';
import AdminSkeleton from '@/components/AdminSkeleton';
export default async function DashboardPage() {
  const users = await fetchUsers(); // Server-side fetching

  return (
    <div className='py-32 lg:py-36 px-5 max-w-5xl mx-auto'>
      {users ? <UsersTable initialData={users} /> : <AdminSkeleton />}
    </div>
  );
}
