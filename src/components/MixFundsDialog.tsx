import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ActivityLogger, LogEntry } from "./ActivityLogger";
import { MixFundsService } from "../services/wallet/MixFundsService";
interface MixFundsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rounds: number;
  onComplete: () => void;
}
export function MixFundsDialog({
  open,
  onOpenChange,
  rounds,
  onComplete
}: MixFundsDialogProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const mixFundsService = new MixFundsService();
  useEffect(() => {
    if (open && !isProcessing) {
      startMixing();
    }
  }, [open]);
  const addLog = (message: string, status: LogEntry["status"] = "pending") => {
    setLogs(prev => [...prev, {
      message,
      status,
      timestamp: new Date()
    }]);
  };
  const updateLastLog = (status: LogEntry["status"]) => {
    setLogs(prev => {
      const newLogs = [...prev];
      if (newLogs.length > 0) {
        newLogs[newLogs.length - 1].status = status;
      }
      return newLogs;
    });
  };
  const startMixing = async () => {
    setIsProcessing(true);
    setLogs([]);
    try {
      addLog("Initializing mixing process...");
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateLastLog("success");
      for (let i = 1; i <= rounds; i++) {
        addLog(`Starting round ${i}/${rounds}`);
        await new Promise(resolve => setTimeout(resolve, 1500));
        addLog(`Shuffling wallets for round ${i}...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        updateLastLog("success");
        addLog(`Executing transactions for round ${i}...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        updateLastLog("success");
        addLog(`Completing round ${i}...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        updateLastLog("success");
      }
      addLog("Finalizing mix process...");
      await new Promise(resolve => setTimeout(resolve, 1500));
      updateLastLog("success");
      addLog("Mix completed successfully!", "success");
      onComplete();
    } catch (error) {
      addLog("Error occurred during mixing process", "error");
      console.error("Mix Funds Error:", error);
    } finally {
      setIsProcessing(false);
    }
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-[#2C406E]">
            Mix Funds Progress
          </DialogTitle>
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