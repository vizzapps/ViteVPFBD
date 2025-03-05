import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
interface ManualBuyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export function ManualBuyDialog({
  open,
  onOpenChange
}: ManualBuyDialogProps) {
  const [tokenAddress, setTokenAddress] = useState("");
  const [isPumpFun, setIsPumpFun] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const handleBuy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenAddress.trim()) {
      toast.error("Please enter a token address");
      return;
    }
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(`Buy order executed through ${isPumpFun ? "PumpFun" : "Raydium"}`);
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to execute buy order");
    } finally {
      setIsProcessing(false);
    }
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-[#2C406E]">Manual Buy</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleBuy} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-[10px] text-[#2C406E]">Token Address</Label>
            <Input value={tokenAddress} onChange={e => setTokenAddress(e.target.value)} placeholder="Enter token address" className="h-7 bg-[#F4F5FA] border-[#8b5cf6] border-opacity-30 text-[10px]" />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-[10px] text-[#2C406E]">Use PumpFun</Label>
            <Switch checked={isPumpFun} onCheckedChange={setIsPumpFun} className="data-[state=checked]:bg-[#2879fe]" />
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <Button type="button" onClick={() => onOpenChange(false)} className="h-7 px-4 text-[10px] bg-gray-500 rounded-none hover:bg-gray-600 text-white">
              Cancel
            </Button>
            <Button type="submit" disabled={isProcessing} className="h-7 px-4 text-[10px] bg-[#2879fe] rounded-none hover:bg-[#2879fe99] text-white">
              {isProcessing ? <div className="flex items-center gap-2">
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  <span>Processing...</span>
                </div> : "Buy Token"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>;
}