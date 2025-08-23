// components/admin_components/admin_revamp/OverviewChart.tsx
"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Define the shape of the data prop
interface ChartDataProps {
  totalUsers: number;
  totalNotes: number;
  totalLinks: number;
  totalSubjects: number;
}

export function OverviewChart({ data }: { data: ChartDataProps }) {
  // Format the data for Recharts
  const chartData = [
    { name: "Users", total: data.totalUsers },
    { name: "Notes", total: data.totalNotes },
    { name: "Links", total: data.totalLinks },
    { name: "Subjects", total: data.totalSubjects },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Overview</CardTitle>
        <CardDescription>
          A summary of all content and users on the platform.
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              cursor={{ fill: "hsl(var(--muted))" }}
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                borderColor: "hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Bar
              dataKey="total"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
