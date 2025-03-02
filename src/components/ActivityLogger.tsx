import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, XCircle } from "lucide-react";
export interface LogEntry {
  message: string;
  status: "pending" | "success" | "error";
  timestamp: Date;
}
interface ActivityLoggerProps {
  logs: LogEntry[];
  className?: string;
}
export function ActivityLogger({
  logs,
  className
}: ActivityLoggerProps) {
  return <div className={cn("space-y-2", className)}>
      {logs.map((log, index) => <div key={index} className="flex items-center gap-2 text-sm p-2 rounded-md bg-[#F4F5FA] border border-[#8b5cf6] border-opacity-20">
          {log.status === "pending" && <Circle className="h-4 w-4 text-[#2879fe] animate-pulse" />}
          {log.status === "success" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
          {log.status === "error" && <XCircle className="h-4 w-4 text-red-500" />}
          <span className="flex-1">{log.message}</span>
          <span className="text-xs text-gray-500">
            {log.timestamp.toLocaleTimeString()}
          </span>
        </div>)}
    </div>;
}