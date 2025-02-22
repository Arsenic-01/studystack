import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { GraduationCap, NotebookPen, SquareUser, UserRoundCheck } from 'lucide-react';
import { User } from '@/store/authStore';

const StatCard = (user) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 py-2">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Students:
        </CardTitle>
        <SquareUser />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">$45,231.89</div>
        <p className="text-xs text-muted-foreground">
          +20.1% from last month
        </p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Teachers:
        </CardTitle>
        <GraduationCap />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">+2350</div>
        <p className="text-xs text-muted-foreground">
          +180.1% from last month
        </p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Notes</CardTitle>
        <NotebookPen />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">+12,234</div>
        <p className="text-xs text-muted-foreground">
          +19% from last month
        </p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Active Users:
        </CardTitle>
        <UserRoundCheck />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">+573</div>
        <p className="text-xs text-muted-foreground">
          +201 since last hour
        </p>
      </CardContent>
    </Card>
  </div>
  )
}
export default StatCard