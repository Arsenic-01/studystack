"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Terminal } from "lucide-react";

interface UserLogDialogProps {
  user: { loginHistory: string[] };
  open: boolean;
  onClose: () => void;
}

export function UserLogDialog({ user, open, onClose }: UserLogDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white  dark:bg-black text-white p-0 overflow-hidden">
        <DialogHeader className="bg-white text-black dark:text-white dark:bg-zinc-900 p-4 flex flex-row items-center gap-2">
          <Terminal className="w-5 h-5" />
          <DialogTitle className="text-lg">Login History</DialogTitle>
        </DialogHeader>
        <div className="p-4 text-sm overflow-y-auto max-h-[50vh]">
          {user.loginHistory.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              No login history
            </div>
          )}
          {user.loginHistory.map((timestamp, index) => (
            <div key={index} className="mb-2  font-mono">
              <span className="text-green-400">●</span>{" "}
              <span className="text-gray-400">
                {format(new Date(timestamp), "dd MMM yyyy")}
              </span>{" "}
              <span className="text-yellow-400">
                {format(new Date(timestamp), "hh:mm:ss a")}
              </span>
            </div>
          ))}
          {user.loginHistory.map((timestamp, index) => (
            <div key={index} className="mb-2  font-mono">
              <span className="text-green-400">●</span>{" "}
              <span className="text-gray-400">
                {format(new Date(timestamp), "dd MMM yyyy")}
              </span>{" "}
              <span className="text-yellow-400">
                {format(new Date(timestamp), "hh:mm:ss a")}
              </span>
            </div>
          ))}
        </div>
        {/* <div className="bg-zinc-900 p-2 text-xs text-gray-400 font-mono">
          Ready for next login
        </div> */}
      </DialogContent>
    </Dialog>
  );
}
