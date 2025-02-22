import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  GraduationCap,
  NotebookPen,
  SquareUser,
  UserRoundCheck,
} from "lucide-react";

const StatCard = ({
  studentCount,
  teacherCount,
  noteCount,
  activeUsers,
}: {
  studentCount: number;
  teacherCount: number;
  noteCount: number;
  activeUsers: number;
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 py-2">
      <Card className="hover:shadow-md dark:bg-neutral-950 dark:hover:bg-neutral-900">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">Students</CardTitle>
          <SquareUser className="size-6" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{studentCount}</div>
        </CardContent>
      </Card>
      <Card className="hover:shadow-md dark:bg-neutral-950 dark:hover:bg-neutral-900">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">Teachers</CardTitle>
          <GraduationCap className="size-7" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{teacherCount}</div>
        </CardContent>
      </Card>
      <Card className="hover:shadow-md dark:bg-neutral-950 dark:hover:bg-neutral-900">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">Uploaded Notes</CardTitle>
          <NotebookPen className="size-6" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{noteCount}</div>
        </CardContent>
      </Card>
      <Card className="hover:shadow-md dark:bg-neutral-950 dark:hover:bg-neutral-900">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">Active Users</CardTitle>
          <UserRoundCheck className="size-6" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeUsers}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatCard;
