// components/admin/AdminOverviewCharts.tsx
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

interface AdminOverviewChartsProps {
  data: {
    userRegistrations: Array<{ date: string; role: string }>;
    noteUploads: Array<{ date: string; type: string; uploadedBy: string }>;
    loginActivity: Array<{
      userId: string;
      userName: string;
      loginTime: string[];
    }>;
  };
}

const COLORS = {
  admin: "#ef4444",
  teacher: "#22c55e",
  student: "#3b82f6",
  primary: "#8b5cf6",
  secondary: "#f59e0b",
  accent: "#06b6d4",
};

export function AdminOverviewCharts({ data }: AdminOverviewChartsProps) {
  // Process user role distribution
  const userRoleData = useMemo(() => {
    const roleCount = data.userRegistrations.reduce(
      (acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(roleCount).map(([role, count]) => ({
      role: role.charAt(0).toUpperCase() + role.slice(1),
      count,
      fill: COLORS[role as keyof typeof COLORS] || COLORS.primary,
    }));
  }, [data.userRegistrations]);

  // Process daily activity data for the last 7 days
  const dailyActivityData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split("T")[0];
    });

    return last7Days.map((date) => {
      const noteUploads = data.noteUploads.filter(
        (note) => note.date.split("T")[0] === date
      ).length;

      const userRegistrations = data.userRegistrations.filter(
        (user) => user.date.split("T")[0] === date
      ).length;

      const logins = data.loginActivity.filter((activity) =>
        activity.loginTime.some((time) => time.split("T")[0] === date)
      ).length;

      return {
        date: new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        noteUploads,
        userRegistrations,
        logins,
      };
    });
  }, [data]);

  // Process content type distribution
  const contentTypeData = useMemo(() => {
    const typeCount = data.noteUploads.reduce(
      (acc, note) => {
        const type = note.type || "Other";
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(typeCount)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6); // Top 6 content types
  }, [data.noteUploads]);

  return (
    <>
      {/* User Role Distribution - Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            User Role Distribution
          </CardTitle>
          <CardDescription>
            Breakdown of user roles in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              admin: { label: "Admin", color: COLORS.admin },
              teacher: { label: "Teacher", color: COLORS.teacher },
              student: { label: "Student", color: COLORS.student },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userRoleData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ role, percent }) =>
                    `${role}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {userRoleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Daily Activity - Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            Daily Activity (Last 7 Days)
          </CardTitle>
          <CardDescription>
            Daily activity trends across the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              noteUploads: { label: "Note Uploads", color: "#22c55e" },
              userRegistrations: { label: "New Users", color: "#3b82f6" },
              logins: { label: "Logins", color: "#f59e0b" },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="noteUploads"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: "#22c55e" }}
                />
                <Line
                  type="monotone"
                  dataKey="userRegistrations"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6" }}
                />
                <Line
                  type="monotone"
                  dataKey="logins"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ fill: "#f59e0b" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Content Type Distribution - Bar Chart */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-purple-500" />
            Content Type Distribution
          </CardTitle>
          <CardDescription>
            Most popular types of content being uploaded
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              count: { label: "Upload Count", color: "#8b5cf6" },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={contentTypeData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="type"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );
}
