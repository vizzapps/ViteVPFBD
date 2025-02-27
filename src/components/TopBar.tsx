import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, Bitcoin, Coins } from "lucide-react";
interface CryptoPrice {
  price: number;
  change: number;
}
export function TopBar() {
  const [prices, setPrices] = useState<{
    sol: CryptoPrice;
    btc: CryptoPrice;
  }>({
    sol: {
      price: 173.58,
      change: 2.5
    },
    btc: {
      price: 52147.23,
      change: -1.2
    }
  });
  return <header className="sticky top-0 z-30 flex appBar h-16 w-full items-center justify-between border-b bg-white px-6 shadow-sm ml-16 pl-16">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#3B71CA]" />
            <div className="absolute inset-[2px] flex items-center justify-center rounded-full bg-white">
              <span className="text-lg font-bold text-[#3B71CA]">V</span>
            </div>
          </div>
          <span className="text-xl font-bold text-[#3B71CA]">Virgo</span>
        </div>
      </div>
      <div className="flex items-center gap-4 pr-32">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="h-7 gap-1 border-[#8b5cf6] border-opacity-30 bg-[#3B71CA] text-white">
            <Coins className="h-4 w-4" />
            <span className="text-[#e0e7ff]">
              ${prices.sol.price.toLocaleString()}
            </span>
            <span className={`flex items-center ${prices.sol.change >= 0 ? "text-green-500" : "text-red-500"}`}>
              {prices.sol.change >= 0 ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />}
              {Math.abs(prices.sol.change)}%
            </span>
          </Badge>
          <Badge variant="secondary" className="h-7 gap-1 border-[#8b5cf6] border-opacity-30 bg-[#3B71CA] text-white">
            <Bitcoin className="h-4 w-4" />
            <span className="text-[#e0e7ff]">
              ${prices.btc.price.toLocaleString()}
            </span>
            <span className={`flex items-center ${prices.btc.change >= 0 ? "text-green-500" : "text-red-500"}`}>
              {prices.btc.change >= 0 ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />}
              {Math.abs(prices.btc.change)}%
            </span>
          </Badge>
        </div>
      </div>
    </header>;
}