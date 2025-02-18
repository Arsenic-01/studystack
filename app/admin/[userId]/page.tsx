import { Suspense } from 'react';
import { UsersTable } from '@/components/table/data-table';
import { fetchUsers } from '@/lib/actions/Admin.actions';
import AdminSkeleton from '@/components/AdminSkeleton';

export default async function DashboardPage() {
  const users = await fetchUsers();

  return (
    <div className='py-32 lg:py-36 px-5 max-w-5xl mx-auto'>
      <Suspense fallback={<AdminSkeleton />}>
        <UsersTable initialData={users} />
      </Suspense>
    </div>
  );
}
