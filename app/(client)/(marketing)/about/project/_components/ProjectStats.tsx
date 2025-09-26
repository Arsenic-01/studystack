// components/project_components/ProjectStats.tsx

"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAdminDashboardStats } from "@/lib/actions/Admin.actions";
import { useQuery } from "@tanstack/react-query";
import { FileText, Link2, Users } from "lucide-react";
import { ReactNode } from "react";
import { FaYoutube } from "react-icons/fa6";

const StatCard = ({
  icon,
  label,
  value,
  isLoading,
}: {
  icon: ReactNode;
  label: string;
  value: number | string;
  isLoading: boolean;
}) => (
  <div className="flex flex-col items-center justify-center p-6 bg-card/50 border border-neutral-300 dark:border-neutral-800 rounded-xl shadow-sm hover:shadow-md transition-shadow">
    <div className="mb-3 text-blue-600 dark:text-blue-400">{icon}</div>
    {isLoading ? (
      <Skeleton className="h-10 w-20 mb-2" />
    ) : (
      <p className="text-4xl md:text-5xl font-bold text-foreground">{value}</p>
    )}
    <p className="text-sm md:text-base font-medium text-muted-foreground mt-1">
      {label}
    </p>
  </div>
);

export default function ProjectImpactStats() {
  const { data, isLoading } = useQuery({
    queryKey: ["adminDashboardStats"],
    queryFn: fetchAdminDashboardStats,
    refetchOnWindowFocus: false,
  });

  const stats = [
    {
      icon: <Users className="size-6" />,
      label: "Total Users",
      value: data?.totalUsers ?? 0,
    },
    {
      icon: <FileText className="size-6" />,
      label: "Total Notes",
      value: data?.totalNotes ?? 0,
    },
    {
      icon: <FaYoutube className="size-6" />,
      label: "YouTube Links",
      value: data?.totalYoutubeLinks ?? 0,
    },
    {
      icon: <Link2 className="size-6" />,
      label: "Other Links",
      value: data?.totalFormLinks ?? 0,
    },
  ];

  return (
    <section id="stats" className="w-full max-w-6xl py-12">
      <div className="text-center mb-16 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          StudyStack&#39;s Growing Impact
        </h2>
        <p className="mt-4 text-lg text-neutral-700 dark:text-neutral-400 max-w-3xl mx-auto">
          See the real-time adoption and scale of our platform as we continue to
          support our academic community.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 lg:gap-7">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            isLoading={isLoading}
          />
        ))}
      </div>
    </section>
  );
}
