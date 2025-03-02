import React, { useCallback, useEffect, useState, useRef } from "react";
import { LogEntry } from "@/components/ActivityLogger";
export function useActivityLogger() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const addLog = useCallback((message: string, status: LogEntry["status"] = "pending") => {
    setLogs(prev => [...prev, {
      message,
      status,
      timestamp: new Date()
    }]);
  }, []);
  const updateLastLog = useCallback((status: LogEntry["status"]) => {
    setLogs(prev => {
      const newLogs = [...prev];
      if (newLogs.length > 0) {
        newLogs[newLogs.length - 1].status = status;
      }
      return newLogs;
    });
  }, []);
  const resetLogs = useCallback(() => {
    setLogs([]);
  }, []);
  const startProcess = useCallback(() => {
    setIsProcessing(true);
    setIsDialogOpen(true);
    resetLogs();
  }, [resetLogs]);
  const endProcess = useCallback(() => {
    setIsProcessing(false);
    timeoutRef.current = setTimeout(() => {
      setIsDialogOpen(false);
    }, 2000);
  }, []);
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  return {
    logs,
    isProcessing,
    isDialogOpen,
    setIsDialogOpen,
    addLog,
    updateLastLog,
    resetLogs,
    startProcess,
    endProcess
  };
}