// app/admin/page.tsx
import { OverviewChart } from "@/components/admin_components/admin_revamp/OverviewChart";
import { RecentActivityFeed } from "@/components/admin_components/admin_revamp/RecentActivityFeed";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  fetchAdminDashboardStats,
  fetchRecentActivity,
} from "@/lib/actions/AdminFetching.actions";
import {
  BarChart3,
  BookOpen,
  FileText,
  Link as LinkIcon,
  Users,
} from "lucide-react";
import Link from "next/link";

export default async function AdminOverviewPage() {
  const [dashboardStats, recentActivity] = await Promise.all([
    fetchAdminDashboardStats(),
    fetchRecentActivity(),
  ]);

  const quickActions = [
    {
      title: "Manage Users",
      description: "View, edit, and manage all users.",
      href: "/admin/users",
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      count: dashboardStats.totalUsers,
    },
    {
      title: "Manage Notes",
      description: "View and manage uploaded documents.",
      href: "/admin/notes",
      icon: FileText,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      count: dashboardStats.totalNotes,
    },
    {
      title: "Manage Links",
      description: "YouTube links and forms management.",
      href: "/admin/links",
      icon: LinkIcon,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
      count: dashboardStats.totalLinks,
    },
    {
      title: "Manage Subjects",
      description: "Configure subjects and curricula.",
      href: "/admin/subjects",
      icon: BookOpen,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
      count: dashboardStats.totalSubjects,
    },
  ];

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      {/* Page Header */}
      <div className="pt-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s a quick overview of your platform.
        </p>
      </div>

      <div className="grid flex-1 items-start gap-4 md:gap-8 lg:grid-cols-3">
        {/* Left Column (Main Content) */}
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          {/* Quick Actions Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Card key={action.title} className="hover:shadow-lg">
                  <Link href={action.href} className="block group h-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {action.title}
                      </CardTitle>
                      <div
                        className={`rounded-lg p-2 ${action.bgColor} transition-transform duration-300 group-hover:scale-110`}
                      >
                        <Icon className={`h-4 w-4 ${action.color}`} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {action.count.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {action.description}
                      </p>
                    </CardContent>
                  </Link>
                </Card>
              );
            })}
          </div>

          {/* Chart Placeholder */}
          <OverviewChart data={dashboardStats} />
        </div>

        {/* Right Column (Recent Activity) */}
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1">
          <RecentActivityFeed activities={recentActivity} />
        </div>
      </div>
    </main>
  );
}
