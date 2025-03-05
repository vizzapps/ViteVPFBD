import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, Search } from "lucide-react";
import { TokenMetaService } from "../services/token/TokenMetaService";
import toast from "react-hot-toast";
interface Token {
  id: number;
  name: string;
  symbol: string;
  address: string;
  price: string;
  change24h: string;
  description?: string;
  website?: string;
  twitter?: string;
  telegram?: string;
}
interface ManualTokenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (token: Token) => void;
}
export function ManualTokenDialog({
  open,
  onOpenChange,
  onSelect
}: ManualTokenDialogProps) {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const loadTokens = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockTokens = Array.from({
        length: 10
      }, (_, i) => ({
        id: i + 1,
        name: `Token ${i + 1}`,
        symbol: `TKN${i + 1}`,
        address: `0x${Math.random().toString(36).substring(2, 15)}`,
        price: (Math.random() * 100).toFixed(2),
        change24h: (Math.random() * 20 - 10).toFixed(2),
        description: `Description for Token ${i + 1}`,
        website: `https://token${i + 1}.com`,
        twitter: `@token${i + 1}`,
        telegram: `t.me/token${i + 1}`
      }));
      setTokens(mockTokens);
    } catch (error) {
      toast.error("Failed to load tokens");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (open) {
      loadTokens();
    }
  }, [open]);
  const filteredTokens = tokens.filter(token => token.name.toLowerCase().includes(searchQuery.toLowerCase()) || token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || token.address.toLowerCase().includes(searchQuery.toLowerCase()));
  const handleSelect = (token: Token) => {
    onSelect(token);
    onOpenChange(false);
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-[#2C406E]">Select Token</DialogTitle>
        </DialogHeader>
        <div className="p-4 space-y-4">
          <div className="flex gap-2">
            <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by name, symbol, or address" className="h-8 bg-[#F4F5FA] border-[#8b5cf6] border-opacity-30 text-[11px]" />
            <Button onClick={loadTokens} className="h-8 px-4 bg-[#2879fe] rounded-none hover:bg-[#2879fe99] text-white">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {loading ? <div className="flex justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin text-[#2879fe]" />
              </div> : <div className="space-y-2">
                {filteredTokens.map(token => <div key={token.id} className="flex items-center justify-between p-3 bg-[#F4F5FA] hover:bg-[#E4E6F0] cursor-pointer transition-colors rounded-lg" onClick={() => handleSelect(token)}>
                    <div>
                      <div className="text-sm font-medium text-[#2C406E]">
                        {token.name} ({token.symbol})
                      </div>
                      <div className="text-xs text-gray-500">
                        {token.address}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-[#2C406E]">
                        ${token.price}
                      </div>
                      <div className={`text-xs ${Number(token.change24h) >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {token.change24h}%
                      </div>
                    </div>
                  </div>)}
              </div>}
          </div>
        </div>
      </DialogContent>
    </Dialog>;
}