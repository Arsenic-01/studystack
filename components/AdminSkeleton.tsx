'use client';
import { Skeleton } from '@heroui/react';
import React from 'react';

const AdminSkeleton = () => {
  return (
    <div className='flex flex-col gap-12 max-w-5xl mx-auto'>
      <Skeleton className='h-10 w-72 rounded-md' />
      <div className='flex flex-col gap-5'>
        <div className='flex flex-col sm:flex-row items-center sm:justify-between gap-4'>
          <Skeleton className='sm:w-96 h-9 w-full rounded-md' />
          <Skeleton className='sm:w-44 w-full h-9 rounded-md' />
        </div>
        <Skeleton className='w-full h-[400px] rounded-md' />
      </div>
    </div>
  );
};

export default AdminSkeleton;
