"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";
import type { TooltipProps } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from "@/components/ui/chart";
import { TeamMember } from "@/data/team";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

const chartConfig = {
  vedant: {
    label: "Vedant B. Bhor",
    color: "var(--chart-1)",
  },
  tanay: {
    label: "Tanay K. Hingane",
    color: "var(--chart-2)",
  },
  adarsh: {
    label: "Adarsh S. Tile",
    color: "var(--chart-3)",
  },
  yadnesh: {
    label: "Yadnesh Udar",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

type CategoryKey = "coding" | "docs" | "testing" | "research" | "database";

const transformDataForChart = (members: TeamMember[]) => {
  const categories: CategoryKey[] = [
    "coding",
    "docs",
    "testing",
    "research",
    "database",
  ];
  const totals: Record<CategoryKey, number> = {
    coding: 0,
    docs: 0,
    testing: 0,
    research: 0,
    database: 0,
  };

  for (const member of members) {
    for (const category of categories) {
      totals[category] += member.contributionSplit[category];
    }
  }

  return categories.map((category) => {
    const categoryData: { [key: string]: string | number } = {
      category: category.charAt(0).toUpperCase() + category.slice(1),
    };

    for (const member of members) {
      const memberKey = member.name.split(" ")[0].toLowerCase();
      // This is now type-safe
      const memberContribution = member.contributionSplit[category];
      categoryData[memberKey] =
        totals[category] > 0
          ? (memberContribution / totals[category]) * 100
          : 0;
    }
    return categoryData;
  });
};

const CustomChartTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2.5 text-sm bg-white/80 dark:bg-neutral-950/60 border border-neutral-300 sm:border-neutral-300 dark:border-neutral-800 backdrop-blur-3xl rounded-lg shadow-lg">
        <p className="font-bold mb-2">{label}</p>
        {payload.map((entry) => {
          const entryKey = entry.dataKey as keyof typeof chartConfig;
          const value =
            typeof entry.value === "number" ? entry.value.toFixed(1) : 0;

          if (Number(value) > 0) {
            return (
              <div
                key={entry.dataKey}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-muted-foreground">
                    {chartConfig[entryKey].label}
                  </span>
                </div>
                <span className="font-semibold">{value}%</span>
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  }
  return null;
};

interface ContributionChartProps {
  members: TeamMember[];
}

export function ContributionChart({ members }: ContributionChartProps) {
  const chartData = transformDataForChart(members);

  return (
    <Card className="h-full p-0">
      <CardHeader>
        <CardTitle>Team Contribution Breakdown</CardTitle>
        <CardDescription>
          Relative effort distribution by area of focus across the team.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4">
        <ChartContainer
          config={chartConfig}
          className="min-h-[280px] w-full p-0"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            stackOffset="expand"
          >
            <XAxis type="number" hide={true} />
            <YAxis
              dataKey="category"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              width={70}
            />
            {/* Use the new custom tooltip */}
            <ChartTooltip cursor={false} content={<CustomChartTooltip />} />
            <ChartLegend content={<ChartLegendContent />} />

            <Bar
              dataKey="vedant"
              stackId="a"
              fill="var(--color-vedant)"
              radius={4}
            />
            <Bar
              dataKey="tanay"
              stackId="a"
              fill="var(--color-tanay)"
              radius={4}
            />
            <Bar
              dataKey="adarsh"
              stackId="a"
              fill="var(--color-adarsh)"
              radius={4}
            />
            <Bar
              dataKey="yadnesh"
              stackId="a"
              fill="var(--color-yadnesh)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
