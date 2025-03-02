import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RefreshCw, X, Wallet2Icon, CoinsIcon } from "lucide-react";
interface WalletCardProps {
  wallet: {
    id: string;
    address: string;
    balance: number;
    network: string;
    profileName?: string;
  };
  index: number;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onDelete: () => void;
  onFund: (amount: number) => void;
  onAge: () => void;
  isFunding: boolean;
  isAging: boolean;
}
export function WalletCard({
  wallet,
  index,
  isSelected,
  onSelect,
  onDelete,
  onFund,
  onAge,
  isFunding,
  isAging
}: WalletCardProps) {
  const [fundAmount, setFundAmount] = useState<string>("");
  const handleFund = () => {
    const amount = parseFloat(fundAmount);
    if (isNaN(amount) || amount <= 0) {
      return; // Don't call onFund if amount is invalid
    }
    onFund(amount);
    setFundAmount(""); // Reset input after funding
  };
  return <Card className="card hover:shadow-md transition-shadow duration-200 border-[#e5e7eb]">
      <CardContent className="p-2 space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox checked={isSelected} onCheckedChange={onSelect} className="h-3 w-3 border-[#a5b4fc]" />
            <span className="text-[10px] text-[#4b5563] font-medium">
              Wallet {index + 1}
            </span>
          </div>
          <Button variant="ghost" size="icon" className="h-5 w-5 p-0 text-[#6b7280] hover:text-red-400" onClick={onDelete}>
            <X className="h-3 w-3" />
          </Button>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <Wallet2Icon className="h-3 w-3 text-[#94a3b8]" />
            <div className="text-[9px] text-[#60a5fa] font-medium truncate" title={wallet.address}>
              {wallet.address}
            </div>
          </div>
          {wallet.profileName && <div className="flex items-center gap-1 pl-4">
              <div className="text-[9px] text-[#34d399] font-medium">
                {wallet.profileName}
              </div>
            </div>}
          <div className="flex items-center gap-1">
            <CoinsIcon className="h-3 w-3 text-[#94a3b8]" />
            <div className="text-[9px] text-[#818cf8] font-medium">
              {wallet.balance} SOL
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Input type="number" placeholder="0" value={fundAmount} onChange={e => setFundAmount(e.target.value)} min="0" step="0.01" className="h-5 bg-[#f9fafb] border-[#e5e7eb] text-[9px] text-[#4b5563] px-1" />
          <Button className="h-5 text-[9px] bg-[#60a5fa] rounded-none hover:bg-[#93c5fd] text-white font-medium px-2" onClick={handleFund} disabled={isFunding || !fundAmount || parseFloat(fundAmount) <= 0}>
            {isFunding ? <RefreshCw className="h-2.5 w-2.5 animate-spin" /> : "Fund"}
          </Button>
          <Button className="h-5 text-[9px] bg-[#60a5fa] rounded-none hover:bg-[#93c5fd] text-white font-medium px-2" onClick={onAge} disabled={isAging}>
            {isAging ? <RefreshCw className="h-2.5 w-2.5 animate-spin" /> : "Warmup"}
          </Button>
        </div>
      </CardContent>
    </Card>;
}