"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { BarChart3Icon } from "lucide-react";
import { User } from "./table/data-table";
import { LegendProps } from "recharts";

interface Note {
  uploadedBy: string;
}

interface TeacherContribution {
  name: string;
  value: number;
}

const SHADCN_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--success))",
  "hsl(var(--info))",
  "hsl(var(--warning))",
  "hsl(var(--ring))",
];

// Professional color palette with complementary hues
const generateColor = (index: number) => {
  return SHADCN_COLORS[index % SHADCN_COLORS.length];
};

export function TeacherNotesChart({
  notes,
  users,
}: {
  notes: Note[];
  users: User[];
}) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  // Get all teachers
  const teachers = users.filter((user) => user.role === "teacher");

  // Count notes by teacher
  const contributionMap = new Map<string, number>();

  teachers.forEach((teacher) => {
    contributionMap.set(teacher.name, 0);
  });

  notes.forEach((note) => {
    if (contributionMap.has(note.uploadedBy)) {
      contributionMap.set(
        note.uploadedBy,
        (contributionMap.get(note.uploadedBy) || 0) + 1
      );
    } else if (note.uploadedBy) {
      // In case there's a mismatch between teacher names in notes and users
      contributionMap.set(note.uploadedBy, 1);
    }
  });

  // Convert to array for the chart
  const data: TeacherContribution[] = Array.from(contributionMap.entries())
    .map(([name, value]) => ({ name, value }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);

  // If no data, show placeholder
  if (data.length === 0) {
    data.push({ name: "No contributions yet", value: 1 });
  }

  const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
    active,
    payload,
  }) => {
    if (active && payload && payload.length > 0) {
      const item = payload[0]; // Safely access the first item

      return (
        <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg p-3 animate-in fade-in zoom-in-95 duration-200">
          <p className="font-semibold text-foreground">
            {item.name ?? "Unknown"}
          </p>
          <div className="flex items-center mt-1 text-sm">
            <div
              className="w-3 h-3 rounded-sm mr-2"
              style={{ backgroundColor: item.payload?.fill ?? "gray" }}
            />
            <span className="text-muted-foreground mr-1">Contributions:</span>
            <span className="font-medium">{item.value ?? 0}</span>
          </div>
          {notes.length > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round(((item.value ?? 0) / notes.length) * 100)}% of total
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Custom Legend component with better styling

  const CustomLegend: React.FC<LegendProps> = ({ payload }) => {
    if (!payload || payload.length === 0) return null;

    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
        {payload.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center text-sm">
            <div
              className="w-3 h-3 rounded-sm mr-2"
              style={{ backgroundColor: entry.color }}
            />
            <span className="truncate text-xs font-medium">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="col-span-1 overflow-hidden border-border/40 shadow-sm transition-all duration-200 hover:shadow-md hover:border-border/80">
      <CardHeader className="pb-2 space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold tracking-tight">
            Teacher Contributions
          </CardTitle>
          <div className="flex items-center p-2 bg-cyan-500/10 text-cyan-500 rounded-full">
            <BarChart3Icon className="h-5 w-5" />
          </div>
        </div>
        <CardDescription className="text-sm font-medium text-muted-foreground">
          Notes contributed by each teacher
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                innerRadius={40}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                paddingAngle={2}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={generateColor(index)}
                    strokeWidth={activeIndex === index ? 2 : 1}
                    stroke={activeIndex === index ? "#fff" : undefined}
                    style={{
                      filter:
                        activeIndex === index
                          ? "drop-shadow(0px 0px 6px rgba(132, 94, 247, 0.5))"
                          : undefined,
                      transition: "all 0.3s ease",
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Summary section */}
        <div className="mt-2 pt-3 border-t border-t-neutral-300 dark:border-t-neutral-800">
          <p className="text-sm text-muted-foreground">
            {data.length > 1 ? (
              <>
                <span className="font-medium text-foreground">
                  {data[0].name}
                </span>{" "}
                has contributed the most with{" "}
                <span className="font-medium text-foreground">
                  {data[0].value}
                </span>{" "}
                notes
              </>
            ) : data[0].name !== "No contributions yet" ? (
              <>
                <span className="font-medium text-foreground">
                  {data[0].name}
                </span>{" "}
                has contributed{" "}
                <span className="font-medium text-foreground">
                  {data[0].value}
                </span>{" "}
                notes
              </>
            ) : (
              "No teacher contributions recorded yet"
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
