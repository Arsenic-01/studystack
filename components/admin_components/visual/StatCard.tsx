import { Card, CardContent } from "@/components/ui/card";
import { Users, BookText, UserCheck, BarChart } from "lucide-react";
interface StatCardProps {
  studentCount: number;
  teacherCount: number;
  noteCount: number;
  activeUsers: number;
}
const StatCard = ({
  studentCount,
  teacherCount,
  noteCount,
  activeUsers,
}: StatCardProps) => {
  const stats = [
    {
      title: "Students",
      value: studentCount,
      icon: <Users className="h-5 w-5" />,
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Teachers",
      value: teacherCount,
      icon: <UserCheck className="h-5 w-5" />,
      color: "bg-pink-500/10 text-pink-500",
    },
    {
      title: "Notes",
      value: noteCount,
      icon: <BookText className="h-5 w-5" />,
      color: "bg-amber-500/10 text-amber-500",
    },
    {
      title: "Active Users",
      value: activeUsers,
      icon: <BarChart className="h-5 w-5" />,
      color: "bg-emerald-500/10 text-emerald-500",
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="stat-card slide-in-bottom"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
              <div className={`rounded-full p-2.5 ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
export default StatCard;
