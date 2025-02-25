"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface User {
  loginHistory?: (string | { timestamp: string })[];
}

interface Note {
  createdAt: string;
}

interface ChartData {
  date: string;
  count: number;
}

// Helper function to get the last 7 days
const getLast7Days = (): string[] => {
  const result = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    result.push(d.toISOString().split("T")[0]);
  }
  return result;
};

// Helper function to count items per day
const countPerDay = (data: any[], dateKey: string): ChartData[] => {
  const counts: { [key: string]: number } = {};
  getLast7Days().forEach((day) => (counts[day] = 0));

  data.forEach((item) => {
    const dateObj = new Date(item[dateKey]);
    if (isNaN(dateObj.getTime())) return;
    const date = dateObj.toISOString().split("T")[0];
    if (counts[date] !== undefined) counts[date]++;
  });

  return Object.entries(counts).map(([date, count]) => ({ date, count }));
};

const chartConfig = {
  logins: {
    label: "User Logins",
    color: "hsl(var(--chart-1))",
  },
  uploads: {
    label: "Documents Uploaded",
    color: "hsl(var(--chart-2))",
  },
} as const;

type ChartType = keyof typeof chartConfig;

export function ActivityChart({
  users,
  notes,
}: {
  users: User[];
  notes: Note[];
}) {
  const [activeChart, setActiveChart] = React.useState<ChartType>("logins");

  // Normalize loginHistory so every item is an object with a timestamp
  const loginData = React.useMemo(() => {
    const normalizedLogins = users.flatMap((user) =>
      (user.loginHistory || []).map((item) =>
        typeof item === "string" ? { timestamp: item } : item
      )
    );
    return countPerDay(normalizedLogins, "timestamp");
  }, [users]);

  const uploadData = React.useMemo(
    () => countPerDay(notes, "createdAt"),
    [notes]
  );

  // Totals independent of the active chart
  const loginTotal = loginData.reduce((sum, item) => sum + item.count, 0);
  const uploadTotal = uploadData.reduce((sum, item) => sum + item.count, 0);

  const chartData = activeChart === "logins" ? loginData : uploadData;

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b dark:border-b-neutral-800 p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>
            {activeChart === "logins"
              ? "Recent User Logins Overview"
              : "Recently Uploaded Notes Overview"}
          </CardTitle>
          <CardDescription>
            Showing{" "}
            {activeChart === "logins" ? "user logins" : "documents uploaded"}{" "}
            for the last <span className="font-bold">7 days</span>{" "}
          </CardDescription>
        </div>
        <div className="flex">
          {(Object.keys(chartConfig) as ChartType[]).map((key) => {
            const total = key === "logins" ? loginTotal : uploadTotal;
            return (
              <button
                key={key}
                data-active={activeChart === key}
                onClick={() => setActiveChart(key)}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t dark:border-t-neutral-800 px-6 py-4 text-left even:border-l dark:border-l-neutral-800 data-[active=true]:bg-muted/50 sm:border-l sm:dark:border-l-neutral-800 sm:border-t-0 sm:px-8 sm:py-6"
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[key].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            {/* Using our custom class for grid stroke */}
            <CartesianGrid
              strokeDasharray="3 3"
              className="recharts-grid-light"
            />
            <XAxis
              dataKey="date"
              tickFormatter={(value: string) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <YAxis allowDecimals={false} />
            <Tooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey={activeChart}
                  labelFormatter={(value: string) => {
                    const date = new Date(value);
                    return isNaN(date.getTime())
                      ? value
                      : date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        });
                  }}
                />
              }
            />

            <Legend />
            <Bar
              dataKey="count"
              fill={`var(--color-${activeChart})`}
              radius={[10, 10, 0, 0]}
              name={chartConfig[activeChart].label}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
