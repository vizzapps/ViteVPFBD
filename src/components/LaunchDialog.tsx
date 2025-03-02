import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
interface LaunchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: string;
}
interface FormData {
  devEnabled?: boolean;
  devBuyAmount: number;
  bundlerWallets: number;
  minAmount?: number;
  maxAmount?: number;
  delay?: number;
  maxDelay?: number;
  buyIncreasePercentage?: number;
  tokenCA: string;
  tagging: string;
  computeUnits: number;
  priorityFees: number;
}
export function LaunchDialog({
  open,
  onOpenChange,
  mode
}: LaunchDialogProps) {
  const [isLaunching, setIsLaunching] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    devEnabled: true,
    devBuyAmount: 0,
    bundlerWallets: 5,
    minAmount: 0.1,
    maxAmount: 1,
    delay: 1,
    maxDelay: 5,
    buyIncreasePercentage: 10,
    tokenCA: "0x1234...5678",
    tagging: "Mixed",
    computeUnits: 250000,
    priorityFees: 0.001
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLaunching(true);
    try {
      switch (mode) {
        case "bigbang":
          if (formData.devBuyAmount <= 0) {
            throw new Error("Dev buy amount must be greater than 0");
          }
          break;
        case "eclipse":
          if (formData.bundlerWallets <= 0 || formData.devBuyAmount <= 0) {
            throw new Error("Invalid wallet count or buy amount");
          }
          break;
        case "supernova":
          if (formData.buyIncreasePercentage! <= 0) {
            throw new Error("Buy increase percentage must be greater than 0");
          }
          break;
        case "cosmic":
          if (formData.maxDelay! <= formData.delay!) {
            throw new Error("Max delay must be greater than min delay");
          }
          break;
      }
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(`${mode} launch initiated successfully`);
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to launch");
    } finally {
      setIsLaunching(false);
    }
  };
  const copyTokenCA = () => {
    navigator.clipboard.writeText(formData.tokenCA);
    toast.success("Token CA copied to clipboard");
  };
  const getTokenCA = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setFormData(prev => ({
      ...prev,
      tokenCA: "0x" + Math.random().toString(16).slice(2, 10)
    }));
    toast.success("Token CA retrieved successfully");
  };
  const renderModeSpecificFields = () => {
    switch (mode) {
      case "flash":
        return <div className="space-y-4">
            
            <div className="space-y-2">
              <Label className="text-[10px] text-[#2C406E]">
                Dev Buy Amount (SOL)
              </Label>
              <Input type="number" value={formData.devBuyAmount} onChange={e => setFormData(prev => ({
              ...prev,
              devBuyAmount: Number(e.target.value)
            }))} min={0} step={0.1} className="h-7 bg-[#F4F5FA] border-[#8b5cf6] border-opacity-30 text-[10px]" />
            </div>
          </div>;
      case "delayed":
        return <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] text-[#2C406E]">
                Dev Buy Amount (SOL)
              </Label>
              <Input type="number" value={formData.devBuyAmount} onChange={e => setFormData(prev => ({
              ...prev,
              devBuyAmount: Number(e.target.value)
            }))} min={0} step={0.1} className="h-7 bg-[#F4F5FA] border-[#8b5cf6] border-opacity-30 text-[10px]" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] text-[#2C406E]">
                Number of Bundler Wallets
              </Label>
              <Input type="number" value={formData.bundlerWallets} onChange={e => setFormData(prev => ({
              ...prev,
              bundlerWallets: Number(e.target.value)
            }))} min={1} className="h-7 bg-[#F4F5FA] border-[#8b5cf6] border-opacity-30 text-[10px]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] text-[#2C406E]">
                  Min Amount (SOL)
                </Label>
                <Input type="number" value={formData.minAmount} onChange={e => setFormData(prev => ({
                ...prev,
                minAmount: Number(e.target.value)
              }))} min={0} step={0.1} className="h-7 bg-[#F4F5FA] border-[#8b5cf6] border-opacity-30 text-[10px]" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] text-[#2C406E]">
                  Max Amount (SOL)
                </Label>
                <Input type="number" value={formData.maxAmount} onChange={e => setFormData(prev => ({
                ...prev,
                maxAmount: Number(e.target.value)
              }))} min={0} step={0.1} className="h-7 bg-[#F4F5FA] border-[#8b5cf6] border-opacity-30 text-[10px]" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] text-[#2C406E]">
                Delay Before Bundling (seconds)
              </Label>
              <Input type="number" value={formData.delay} onChange={e => setFormData(prev => ({
              ...prev,
              delay: Number(e.target.value)
            }))} min={0} className="h-7 bg-[#F4F5FA] border-[#8b5cf6] border-opacity-30 text-[10px]" />
            </div>
          </div>;
      case "block0":
        return <div className="space-y-4">
             <div className="space-y-2">
              <Label className="text-[10px] text-[#2C406E]">
                Dev Buy Amount (SOL)
              </Label>
              <Input type="number" value={formData.devBuyAmount} onChange={e => setFormData(prev => ({
              ...prev,
              devBuyAmount: Number(e.target.value)
            }))} min={0} step={0.1} className="h-7 bg-[#F4F5FA] border-[#8b5cf6] border-opacity-30 text-[10px]" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] text-[#2C406E]">
                Number of Bundler Wallets
              </Label>
              <Input type="number" value={formData.bundlerWallets} onChange={e => setFormData(prev => ({
              ...prev,
              bundlerWallets: Number(e.target.value)
            }))} min={1} className="h-7 bg-[#F4F5FA] border-[#8b5cf6] border-opacity-30 text-[10px]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] text-[#2C406E]">
                  Min Amount (SOL)
                </Label>
                <Input type="number" value={formData.minAmount} onChange={e => setFormData(prev => ({
                ...prev,
                minAmount: Number(e.target.value)
              }))} min={0} step={0.1} className="h-7 bg-[#F4F5FA] border-[#8b5cf6] border-opacity-30 text-[10px]" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] text-[#2C406E]">
                  Max Amount (SOL)
                </Label>
                <Input type="number" value={formData.maxAmount} onChange={e => setFormData(prev => ({
                ...prev,
                maxAmount: Number(e.target.value)
              }))} min={0} step={0.1} className="h-7 bg-[#F4F5FA] border-[#8b5cf6] border-opacity-30 text-[10px]" />
              </div>
            </div> 
          </div>;
      case "staggered":
        return <div className="space-y-4">
             <div className="space-y-2">
              <Label className="text-[10px] text-[#2C406E]">
                Dev Buy Amount (SOL)
              </Label>
              <Input type="number" value={formData.devBuyAmount} onChange={e => setFormData(prev => ({
              ...prev,
              devBuyAmount: Number(e.target.value)
            }))} min={0} step={0.1} className="h-7 bg-[#F4F5FA] border-[#8b5cf6] border-opacity-30 text-[10px]" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] text-[#2C406E]">
                Number of Bundler Wallets
              </Label>
              <Input type="number" value={formData.bundlerWallets} onChange={e => setFormData(prev => ({
              ...prev,
              bundlerWallets: Number(e.target.value)
            }))} min={1} className="h-7 bg-[#F4F5FA] border-[#8b5cf6] border-opacity-30 text-[10px]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] text-[#2C406E]">
                  Min Amount (SOL)
                </Label>
                <Input type="number" value={formData.minAmount} onChange={e => setFormData(prev => ({
                ...prev,
                minAmount: Number(e.target.value)
              }))} min={0} step={0.1} className="h-7 bg-[#F4F5FA] border-[#8b5cf6] border-opacity-30 text-[10px]" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] text-[#2C406E]">
                  Max Amount (SOL)
                </Label>
                <Input type="number" value={formData.maxAmount} onChange={e => setFormData(prev => ({
                ...prev,
                maxAmount: Number(e.target.value)
              }))} min={0} step={0.1} className="h-7 bg-[#F4F5FA] border-[#8b5cf6] border-opacity-30 text-[10px]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] text-[#2C406E]">
                  Min Delay (seconds)
                </Label>
                <Input type="number" value={formData.delay} onChange={e => setFormData(prev => ({
                ...prev,
                delay: Number(e.target.value)
              }))} min={0} className="h-7 bg-[#F4F5FA] border-[#8b5cf6] border-opacity-30 text-[10px]" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] text-[#2C406E]">
                  Max Delay (seconds)
                </Label>
                <Input type="number" value={formData.maxDelay} onChange={e => setFormData(prev => ({
                ...prev,
                maxDelay: Number(e.target.value)
              }))} min={0} className="h-7 bg-[#F4F5FA] border-[#8b5cf6] border-opacity-30 text-[10px]" />
              </div>
            </div>
          </div>;
      default:
        return null;
    }
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-[#2C406E]">
            {mode.charAt(0).toUpperCase() + mode.slice(1)} Launch Configuration
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="bg-[#F4F5FA] p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="mt-2">
              <p className="text-sm text-[#6b7280] break-all">
                {formData.tokenCA}
              </p>
            </div>
              <Button type="button" onClick={getTokenCA} className="h-7 px-4 text-[10px] bg-[#2879fe] rounded-none hover:bg-[#2879fe99] text-white">
                Get CA
              </Button>
            </div>
           
          </div>
          <div className="grid grid-cols-2 gap-6">
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-[#2C406E]">
                Fee Settings
              </h3>
              <div className="bg-[#F4F5FA] p-4 rounded-lg space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] text-[#2C406E]">
                    Compute Units
                  </Label>
                  <Input type="number" value={formData.computeUnits} onChange={e => setFormData(prev => ({
                  ...prev,
                  computeUnits: Number(e.target.value)
                }))} className="h-7 bg-[#F4F5FA] border-[#8b5cf6] border-opacity-30 text-[10px]" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] text-[#2C406E]">
                    Priority Fees (SOL)
                  </Label>
                  <Input type="number" value={formData.priorityFees} onChange={e => setFormData(prev => ({
                  ...prev,
                  priorityFees: Number(e.target.value)
                }))} step="0.001" className="h-7 bg-[#F4F5FA] border-[#8b5cf6] border-opacity-30 text-[10px]" />
                </div>
              </div>
            </div> 
            <div className="space-y-4">
            <h3 className="text-sm font-medium text-[#2C406E]">
              Mode Settings
            </h3>
            <div className="bg-[#F4F5FA] p-4 rounded-lg">
              {renderModeSpecificFields()}
            </div>
            </div> 
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <Button type="button" onClick={() => onOpenChange(false)} className="h-7 px-4 text-[10px] bg-gray-500 rounded-none hover:bg-gray-600 text-white">
              Cancel
            </Button>
            <Button type="submit" disabled={isLaunching} className="h-7 px-4 text-[10px] bg-[#2879fe] rounded-none hover:bg-[#2879fe99] text-white">
              {isLaunching ? <div className="flex items-center gap-2">
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  <span>Launching...</span>
                </div> : "Launch"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>;
}