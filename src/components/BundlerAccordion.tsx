import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronDown, ChevronUp, PlusIcon, MinusIcon, Copy } from "lucide-react";
import toast from "react-hot-toast";
interface WalletData {
  address: string;
  balance: string;
}
interface BundlerAccordionProps {
  logs: string[];
  wallets: WalletData[];
  onSellPercentage: (address: string, percentage: number) => void;
}
export function BundlerAccordion({
  logs,
  wallets,
  onSellPercentage
}: BundlerAccordionProps) {
  const [activeSection, setActiveSection] = useState<"logs" | "wallets">("logs");
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Address copied to clipboard");
  };
  return <div className="space-y-1">
      {/* Activity Logs Section */}
      <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
        <button className="w-full flex items-center justify-between p-2 bg-white hover:bg-[#F4F5FA] transition-colors" onClick={() => setActiveSection(activeSection === "logs" ? null : "logs")}>
          <span className="text-xs font-medium text-[#2C406E]">
            Activity Logs
          </span>
          {activeSection === "logs" ? <MinusIcon className="h-4 w-4 text-[#2C406E]" /> : <PlusIcon className="h-4 w-4 text-[#2C406E]" />}
        </button>
        {activeSection === "logs" && <div className="p-2 bg-[#F4F5FA] max-h-[200px] overflow-y-auto">
            <div className="space-y-1">
              {logs.map((log, index) => <div key={index} className="flex items-center gap-2 text-[10px] text-[#2C406E]">
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                  <span>{log}</span>
                </div>)}
            </div>
          </div>}
      </div>
      {/* Wallets Section */}
      <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
        <button className="w-full flex items-center justify-between p-2 bg-white hover:bg-[#F4F5FA] transition-colors" onClick={() => setActiveSection(activeSection === "wallets" ? null : "wallets")}>
          <span className="text-xs font-medium text-[#2C406E]">Wallets</span>
          {activeSection === "wallets" ? <ChevronUp className="h-4 w-4 text-[#2C406E]" /> : <ChevronDown className="h-4 w-4 text-[#2C406E]" />}
        </button>
        {activeSection === "wallets" && <div className="bg-[#F4F5FA] max-h-[400px] overflow-y-auto">
            <div className="rounded-lg overflow-hidden">
              {/* Table Header */}
              <div className="bg-white border-b border-[#e5e7eb] px-4 py-1">
                <div className="grid grid-cols-[2fr_1fr_auto] gap-4">
                  <div className="text-[10px] font-medium text-[#2C406E]">
                    Address
                  </div>
                  <div className="text-[10px] font-medium text-[#2C406E]">
                    Token Balance
                  </div>
                  <div className="text-[10px] font-medium text-[#2C406E] text-center w-[200px]">
                    Actions
                  </div>
                </div>
              </div>
              {/* Table Body */}
              <div className="space-y-2 mt-1">
                {wallets.map((wallet, index) => <div key={index} className="bg-white hover:shadow-md transition-shadow duration-200 rounded-lg p-1">
                    <div className="grid grid-cols-[2fr_1fr_auto] gap-1 items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#2C406E] font-medium truncate">
                          {wallet.address}
                        </span>
                        <button onClick={() => handleCopy(wallet.address)} className="p-0.5 hover:bg-[#F4F5FA] rounded">
                          <Copy className="h-3 w-3 text-[#2C406E]" />
                        </button>
                      </div>
                      <div className="text-[10px] text-[#2C406E] font-medium">
                        {wallet.balance} TOKEN
                      </div>
                      <div className="flex gap-1 justify-end w-[200px]">
                        {[25, 50, 75, 100].map(percentage => <Button key={percentage} onClick={() => onSellPercentage(wallet.address, percentage)} className="h-6 px-2 text-[10px] bg-red-500 hover:bg-red-600 text-white">
                            {percentage}%
                          </Button>)}
                      </div>
                    </div>
                  </div>)}
              </div>
            </div>
          </div>}
      </div>
    </div>;
}