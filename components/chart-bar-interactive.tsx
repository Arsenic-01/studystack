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

interface Note {
  createdAt: string;
}

interface LoginHistoryEntry {
  loginTime: string[]; // Array of timestamps (strings)
  userId: string;
  userName: string;
}

interface ChartData {
  date: string;
  count: number;
}

// Get last 7 days
const getLast7Days = (): string[] => {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });
};

// Count items per day
const countPerDay = (timestamps: string[]): ChartData[] => {
  const counts = Object.fromEntries(getLast7Days().map((date) => [date, 0]));

  timestamps.forEach((timestamp) => {
    const date = new Date(timestamp).toISOString().split("T")[0];
    if (counts[date] !== undefined) counts[date]++;
  });

  return Object.entries(counts).map(([date, count]) => ({ date, count }));
};

const chartConfig = {
  logins: { label: "User Logins", color: "hsl(var(--chart-1))" },
  uploads: { label: "Documents Uploaded", color: "hsl(var(--chart-2))" },
} as const;

type ChartType = keyof typeof chartConfig;

export function ActivityChart({
  notes,
  loginHistory,
}: {
  notes: Note[];
  loginHistory: LoginHistoryEntry[];
}) {
  const [activeChart, setActiveChart] = React.useState<ChartType>("logins");

  // Flatten all login timestamps from loginHistory
  const loginTimestamps = React.useMemo(
    () => loginHistory.flatMap((entry) => entry.loginTime),
    [loginHistory]
  );

  const loginData = React.useMemo(
    () => countPerDay(loginTimestamps),
    [loginTimestamps]
  );
  const uploadData = React.useMemo(
    () => countPerDay(notes.map((note) => note.createdAt)),
    [notes]
  );

  const totalCounts = {
    logins: loginData.reduce((sum, item) => sum + item.count, 0),
    uploads: uploadData.reduce((sum, item) => sum + item.count, 0),
  };

  const chartData = activeChart === "logins" ? loginData : uploadData;

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b dark:border-b-neutral-800 p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>
            {activeChart === "logins"
              ? "Login Trends Overview"
              : "Notes Upload Trends"}
          </CardTitle>
          <CardDescription>
            Showing {chartConfig[activeChart].label} for the last{" "}
            <span className="font-bold">7 days</span>
          </CardDescription>
        </div>
        <div className="flex">
          {(Object.keys(chartConfig) as ChartType[]).map((key) => (
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
                {totalCounts[key]}
              </span>
            </button>
          ))}
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
            <CartesianGrid
              strokeDasharray="3 3"
              className="recharts-grid-light"
            />
            <XAxis
              dataKey="date"
              tickFormatter={(value) =>
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
                  labelFormatter={(value) => {
                    if (!value || isNaN(new Date(value).getTime())) {
                      return value; // Return the original value if it's invalid
                    }
                    return new Date(value).toLocaleDateString("en-US", {
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
              fill={chartConfig[activeChart].color}
              radius={[10, 10, 0, 0]}
              name={chartConfig[activeChart].label}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
