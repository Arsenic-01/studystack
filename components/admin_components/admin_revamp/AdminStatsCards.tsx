// components/admin/AdminStatsCards.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, Link as LinkIcon, Users } from "lucide-react";

interface AdminStatsCardsProps {
  stats: {
    totalUsers: number;
    totalNotes: number;
    totalYoutubeLinks: number;
    totalFormLinks: number;
    totalSubjects: number;
    totalLinks: number;
  };
}

export function AdminStatsCards({ stats }: AdminStatsCardsProps) {
  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      description: "Registered users in the system",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      title: "Total Notes",
      value: stats.totalNotes.toLocaleString(),
      icon: FileText,
      description: "Documents and notes uploaded",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20",
    },
    {
      title: "Total Links",
      value: stats.totalLinks.toLocaleString(),
      icon: LinkIcon,
      description: "YouTube & form links combined",
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
    },
    {
      title: "Total Subjects",
      value: stats.totalSubjects.toLocaleString(),
      icon: BookOpen,
      description: "Active subjects in curriculum",
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
