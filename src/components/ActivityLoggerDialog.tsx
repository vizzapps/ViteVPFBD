import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ActivityLogger, LogEntry } from "./ActivityLogger";
interface ActivityLoggerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  logs: LogEntry[];
  isProcessing: boolean;
}
export function ActivityLoggerDialog({
  open,
  onOpenChange,
  title,
  logs,
  isProcessing
}: ActivityLoggerDialogProps) {
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-[#2C406E]">{title}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[400px] overflow-auto p-4">
          <ActivityLogger logs={logs} />
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button disabled={isProcessing} onClick={() => onOpenChange(false)} className="h-8 px-4 text-[12px] bg-[#2879fe] rounded-none hover:bg-[#2879fe99] text-white">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>;
}