"use client";

import { ChartPie, MapPinCheck, TrendingUp } from "lucide-react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { User } from "./table/data-table";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  activeUsers: {
    label: "Active Users",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function ActiveUsersChart({ users }: { users: User[] }) {
  const visitors = users.filter((user) => user.loginHistory.length > 0).length;
  const totalUsers = users.length || 1; // Avoid division by zero

  // Calculate the dynamic end angle
  const visitorsPercentage = (visitors / totalUsers) * 360;
  const startAngle = 0;
  const endAngle = startAngle + visitorsPercentage;

  // Prepare the chart data
  const chartData = [
    {
      visitors: visitors,
      fill: "hsl(var(--chart-2))",
    },
  ];

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2 space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold tracking-tight">
            Total Visitors
          </CardTitle>
          <div className="flex items-center p-2 bg-teal-500/10 text-teal-500 rounded-full">
            <ChartPie className="h-5 w-5" />
          </div>
        </div>
        <CardDescription> Users who have visited the site </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-5">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={startAngle}
            endAngle={endAngle}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="visitors" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-black dark:fill-white text-4xl font-bold"
                        >
                          {visitors}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-black dark:fill-white text-sm"
                        >
                          Visitors
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 font-medium leading-none w-full">
        <div className="flex flex-col gap-1 mt-2 pt-3 border-t border-t-neutral-300 dark:border-t-neutral-800 text-sm w-full">
          <div className="flex items-center gap-2 font-medium leading-none">
            <MapPinCheck className="h-4 w-4" /> {visitors} Active Users of{" "}
            {totalUsers}
          </div>
          <div className="flex items-center gap-2 font-medium leading-none text-neutral-500 dark:text-neutral-400">
            <TrendingUp className="h-4 w-4" />{" "}
            {((visitors / totalUsers) * 100).toFixed(2)}% of total users visited
            the website
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
