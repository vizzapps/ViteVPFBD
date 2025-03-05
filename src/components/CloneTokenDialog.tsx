import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw, Search } from "lucide-react";
import toast from "react-hot-toast";
interface CloneTokenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTokenFound: (tokenData: any) => void;
}
export function CloneTokenDialog({
  open,
  onOpenChange,
  onTokenFound
}: CloneTokenDialogProps) {
  const [tokenAddress, setTokenAddress] = useState("");
  const [searching, setSearching] = useState(false);
  const handleSearch = async () => {
    if (!tokenAddress.trim()) {
      toast.error("Please enter a token address");
      return;
    }
    setSearching(true);
    try {
      // Simulated API call - replace with actual service call
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockTokenData = {
        name: "Sample Token",
        symbol: "SMPL",
        address: tokenAddress,
        decimals: 18,
        totalSupply: "1000000000",
        description: "A sample token for demonstration",
        website: "https://example.com",
        twitter: "@sampletoken",
        telegram: "t.me/sampletoken"
      };
      onTokenFound(mockTokenData);
      onOpenChange(false);
      toast.success("Token found successfully");
    } catch (error) {
      toast.error("Failed to find token");
    } finally {
      setSearching(false);
    }
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-[#2C406E]">Clone Token</DialogTitle>
        </DialogHeader>
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <Label className="text-[10px] text-[#2C406E]">Token Address</Label>
            <div className="flex gap-2">
              <Input value={tokenAddress} onChange={e => setTokenAddress(e.target.value)} placeholder="Enter token contract address" className="h-8 bg-[#F4F5FA] border-[#8b5cf6] border-opacity-30 text-[11px]" />
              <Button onClick={handleSearch} disabled={searching} className="h-8 px-4 bg-[#2879fe] rounded-none hover:bg-[#2879fe99] text-white">
                {searching ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>;
}