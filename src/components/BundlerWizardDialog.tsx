import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Rocket, Zap, Clock, BoxIcon } from "lucide-react";
interface BundlerWizardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onModeSelect: (mode: string) => void;
}
const bundlerModes = [{
  id: "flash",
  name: "Flash Bundle",
  description: "Instant token bundling with maximum speed",
  icon: BoxIcon,
  color: "from-blue-500 to-purple-500"
}, {
  id: "delayed",
  name: "Delayed Bundle",
  description: "Time-delayed bundling for strategic launches",
  icon: Clock,
  color: "from-green-500 to-teal-500"
}, {
  id: "block0",
  name: "Block 0 Bundle",
  description: "First block execution for maximum impact",
  icon: Zap,
  color: "from-orange-500 to-red-500"
}, {
  id: "staggered",
  name: "Staggered Bundle",
  description: "Distributed bundling across multiple blocks",
  icon: Rocket,
  color: "from-purple-500 to-pink-500"
}];
export function BundlerWizardDialog({
  open,
  onOpenChange,
  onModeSelect
}: BundlerWizardDialogProps) {
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-[#2C406E]">
            Select Bundle Mode
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 p-4">
          {bundlerModes.map(mode => <Card key={mode.id} className="p-4 cursor-pointer hover:shadow-lg transition-shadow duration-200 border-[#e5e7eb]" onClick={() => {
          onModeSelect(mode.id);
          onOpenChange(false);
        }}>
              <div className="flex items-start gap-4">
                <div className={`rounded-lg p-2 bg-gradient-to-br ${mode.color}`}>
                  <mode.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#2C406E]">
                    {mode.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {mode.description}
                  </p>
                </div>
              </div>
            </Card>)}
        </div>
      </DialogContent>
    </Dialog>;
}