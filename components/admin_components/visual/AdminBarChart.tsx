"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Note, YoutubeLink, FormLink } from "@/lib/appwrite_types";

export interface LoginHistoryEntry {
  loginTime: string[];
  userId: string;
  userName: string;
}

interface ChartData {
  date: string;
  count: number;
}

const getLast7Days = (): string[] => {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });
};

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
  uploads: { label: "Documents", color: "hsl(var(--chart-2))" },
  youtube: { label: "YouTube Links", color: "hsl(var(--chart-3))" },
  forms: { label: "Form/Other Links", color: "hsl(var(--chart-4))" },
} as const;

type ChartType = keyof typeof chartConfig;

export function ActivityChart({
  notes,
  loginHistory,
  youtubeLinks,
  formLinks,
}: {
  notes: Note[];
  loginHistory: LoginHistoryEntry[];
  youtubeLinks: YoutubeLink[];
  formLinks: FormLink[];
}) {
  const [activeChart, setActiveChart] = React.useState<ChartType>("logins");

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
  const youtubeData = React.useMemo(
    () => countPerDay(youtubeLinks.map((link) => link.createdAt)),
    [youtubeLinks]
  );
  const formData = React.useMemo(
    () => countPerDay(formLinks.map((link) => link.createdAt)),
    [formLinks]
  );

  const totalCounts = {
    logins: loginData.reduce((sum, item) => sum + item.count, 0),
    uploads: uploadData.reduce((sum, item) => sum + item.count, 0),
    youtube: youtubeData.reduce((sum, item) => sum + item.count, 0),
    forms: formData.reduce((sum, item) => sum + item.count, 0),
  };

  const chartData =
    activeChart === "logins"
      ? loginData
      : activeChart === "uploads"
        ? uploadData
        : activeChart === "youtube"
          ? youtubeData
          : formData;

  const chartTitles = {
    logins: "Login Trends Overview",
    uploads: "Document Upload Trends",
    youtube: "YouTube Link Trends",
    forms: "Form & Link Addition Trends",
  };

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b border-b-neutral-200 dark:border-b-neutral-800 p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>{chartTitles[activeChart]}</CardTitle>
          <CardDescription>
            Showing {chartConfig[activeChart].label} for the last{" "}
            <span className="font-bold">7 days</span>
          </CardDescription>
        </div>

        {/* --- RESPONSIVE CHANGE START --- */}
        {/* This container is now a 2x2 grid on mobile and a flex row on larger screens */}
        <div className="grid grid-cols-2 sm:flex">
          {(Object.keys(chartConfig) as ChartType[]).map((key, index) => (
            <button
              key={key}
              data-active={activeChart === key}
              onClick={() => setActiveChart(key)}
              // The classes here are adjusted to handle both grid and flex layouts
              className={`
                relative flex flex-col justify-center gap-1 p-4 text-left 
                 data-[active=true]:bg-muted/50
                sm:flex-1 sm:px-8 sm:py-6
                
                // Grid borders for mobile
                border-t border-t-neutral-200 dark:border-t-neutral-800
                ${index % 2 !== 0 ? "border-l" : ""}

                // Flex borders for desktop
                sm:border-t-0 sm:border-l sm:border-l-neutral-200 dark:sm:border-l-neutral-800
              `}
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
        {/* --- RESPONSIVE CHANGE END --- */}
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
            <Tooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="count"
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })
                  }
                />
              }
            />
            <Bar
              dataKey="count"
              fill={chartConfig[activeChart].color}
              radius={[4, 4, 0, 0]}
              name={chartConfig[activeChart].label}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
