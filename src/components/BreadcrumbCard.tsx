import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
interface BreadcrumbCardProps {
  totalWallets: number;
  devMainBalance?: number;
  fundingBalance?: number;
  onRefresh?: () => void;
}
export function BreadcrumbCard({
  totalWallets,
  devMainBalance = 4.1662,
  fundingBalance = 4.1662,
  onRefresh
}: BreadcrumbCardProps) {
  return <Card className="card">
      <CardContent className="flex items-center justify-between p-2">
        <div className="text-[#0d0d0d]">
          <h1 className="text-sm font-bold text-[#2C406E]">Wallet Manager</h1>
          <p className="text-[10px]">{totalWallets}/40 wallets active</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[12px] text-[#2C406E]">Dev/Main.</div>
            <div className="text-[10px] text-[#2C406E]">
              {devMainBalance} SOL
            </div>
          </div>
          <div className="text-right">
            <div className="text-[12px] text-[#2C406E]">Funding.</div>
            <div className="text-[10px] text-[#2C406E]">
              {fundingBalance} SOL
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onRefresh} className="h-6 w-6 p-0 border-[#8b5cf6] border-opacity-30 text-[#fff] bg-[#2879fe] rounded-none hover:bg-[#2879fe99]">
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>;
}