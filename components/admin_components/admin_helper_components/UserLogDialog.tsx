import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchSessions } from "@/lib/actions/Admin.actions";
import { cn } from "@/lib/utils";
import { differenceInMinutes, format } from "date-fns";
import { ArrowRight, Calendar, Clock, Terminal } from "lucide-react";
import { useEffect, useState } from "react";

interface Session {
  sessionId: string;
  sessionStart: string;
  sessionEnd?: string;
  isActive: boolean;
  userId: string;
}

interface UserLogDialogProps {
  user: {
    id: string;
  };
  open: boolean;
  onClose: () => void;
}

export function UserLogDialog({ user, open, onClose }: UserLogDialogProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // A flag to prevent state updates if the component unmounts during fetch
    let isMounted = true;

    const fetchInitialData = async () => {
      if (!open || !user.id) return;

      setIsLoading(true);
      const initialSessions = await fetchSessions(user.id, 0);

      if (isMounted) {
        setSessions(initialSessions);
        setHasMore(initialSessions.length === 25);
        setOffset(25);
        setIsLoading(false);
      }
    };

    fetchInitialData();

    // Cleanup function to reset state when the dialog closes
    return () => {
      isMounted = false;
      setSessions([]);
      setOffset(0);
      setHasMore(true);
    };
  }, [open, user.id]); // Re-run if the dialog is opened for a different user

  const loadMore = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    const moreSessions = await fetchSessions(user.id, offset);
    setSessions((prev) => [...prev, ...moreSessions]);
    setOffset((prev) => prev + 25);
    setHasMore(moreSessions.length === 25);
    setIsLoadingMore(false);
  };
  const formatTimeIST = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "HH:mm:ss");
  };

  const formatDateIST = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM dd, yyyy");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#fafafa] dark:bg-[#111] border-0 shadow-lg rounded-xl p-0 overflow-hidden">
        <DialogHeader className="bg-[#f3f3f3] dark:bg-[#222] px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
            <DialogTitle className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
              Session History
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[65vh]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-neutral-400 space-y-3">
              <Clock className="w-10 h-10 opacity-30 animate-spin" />
              <p className="text-sm">Loading session history...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-neutral-400 space-y-3">
              <Clock className="w-10 h-10 opacity-30" />
              <p className="text-sm">No session history found</p>
            </div>
          ) : (
            <div className="p-4">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-neutral-200 dark:border-neutral-800">
                    <TableHead className="w-1/3 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                      SESSION
                    </TableHead>
                    <TableHead className="w-1/3 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                      ENDED
                    </TableHead>
                    <TableHead className="w-2/5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                      DURATION
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {sessions.map((sess, index) => {
                    const { sessionStart, sessionEnd, isActive } = sess;
                    const startDate = new Date(sessionStart);
                    const endDate = sessionEnd ? new Date(sessionEnd) : null;

                    const duration = endDate
                      ? differenceInMinutes(endDate, startDate)
                      : null;

                    return (
                      <TableRow
                        key={sess.sessionId}
                        className={cn(
                          "border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors",
                          index === 0
                            ? "bg-neutral-50 dark:bg-neutral-900/50"
                            : ""
                        )}
                      >
                        <TableCell className="py-4">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-1">
                              <Calendar className="w-4 h-4 text-neutral-400" />
                              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                {formatDateIST(sessionStart)}
                              </span>
                            </div>
                            <div className="text-xs text-neutral-500 dark:text-neutral-400 pl-6">
                              Started at {formatTimeIST(sessionStart)}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="py-4">
                          {isActive ? (
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 px-2 py-0.5 text-xs"
                              >
                                Active
                              </Badge>
                              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                Current session
                              </span>
                            </div>
                          ) : sessionEnd ? (
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2 mb-1">
                                <ArrowRight className="w-4 h-4 text-neutral-400" />
                                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                  {formatDateIST(sessionEnd)}
                                </span>
                              </div>
                              <div className="text-xs text-neutral-500 dark:text-neutral-400 pl-6">
                                Ended at {formatTimeIST(sessionEnd)}
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-neutral-500 dark:text-neutral-400">
                              Unknown
                            </span>
                          )}
                        </TableCell>

                        <TableCell className="py-4">
                          {isActive ? (
                            <span className="text-xs text-neutral-500 dark:text-neutral-400">
                              Ongoing
                            </span>
                          ) : duration !== null ? (
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-neutral-400" />
                              <span
                                className={cn(
                                  "text-sm font-medium",
                                  duration < 5
                                    ? "text-red-600 dark:text-red-400"
                                    : duration < 30
                                      ? "text-yellow-600 dark:text-yellow-400"
                                      : "text-green-600 dark:text-green-400"
                                )}
                              >
                                {duration >= 60
                                  ? `${Math.floor(duration / 60)} hrs ${
                                      duration % 60
                                    } min`
                                  : `${duration} ${
                                      duration === 1 ? "min" : "mins"
                                    }`}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-neutral-500 dark:text-neutral-400">
                              Unknown
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center mt-4">
                  <Button
                    onClick={loadMore}
                    disabled={isLoadingMore}
                    variant="outline"
                  >
                    {isLoadingMore ? "Loading..." : "Load More"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
