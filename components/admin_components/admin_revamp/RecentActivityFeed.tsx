// components/admin/RecentActivityFeed.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  UserPlus,
  Youtube,
  Link as LinkIcon,
  Clock,
  Activity,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ActivityItem {
  type: "note" | "user" | "youtube" | "form";
  title: string;
  user: string;
  timestamp: string;
}

interface RecentActivityFeedProps {
  activities: ActivityItem[];
}

const activityConfig = {
  note: {
    icon: FileText,
    color: "bg-blue-500",
    badge: "Note",
    badgeVariant: "default" as const,
  },
  user: {
    icon: UserPlus,
    color: "bg-green-500",
    badge: "User",
    badgeVariant: "secondary" as const,
  },
  youtube: {
    icon: Youtube,
    color: "bg-red-500",
    badge: "YouTube",
    badgeVariant: "destructive" as const,
  },
  form: {
    icon: LinkIcon,
    color: "bg-purple-500",
    badge: "Form",
    badgeVariant: "outline" as const,
  },
};

export function RecentActivityFeed({ activities }: RecentActivityFeedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
        <CardDescription>Latest activities across the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <Activity className="h-8 w-8 mb-2" />
              <p>No recent activity</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity, index) => {
                const config = activityConfig[activity.type];
                const Icon = config.icon;

                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-card/50"
                  >
                    <div
                      className={`rounded-full p-2 ${config.color} text-white`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={config.badgeVariant}
                          className="text-xs"
                        >
                          {config.badge}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(activity.timestamp), {
                            addSuffix: true,
                          })}
                        </div>
                      </div>

                      <p className="text-sm font-medium leading-none">
                        {activity.title}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        by {activity.user}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
