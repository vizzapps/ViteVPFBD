import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import toast from "react-hot-toast";
import { Copy, Share2, RefreshCw, Coins, ArrowUp, ArrowDown, CheckCircle2, ClipboardCopy, MousePointerClick, Plus, PlusIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { TokenMetaDialog } from "../components/TokenMetaDialog";
import { Badge } from "@/components/ui/badge";
import { LaunchDialog } from "../components/LaunchDialog";
import { TokenCreationService } from "../services/token/TokenCreationService";
import { BundlerWizardDialog } from "../components/BundlerWizardDialog";
import { BundlerAccordion } from "../components/BundlerAccordion";
import { ManualTokenDialog } from "../components/ManualTokenDialog";
import { CloneTokenDialog } from "../components/CloneTokenDialog";
import { TokenMetadataDialog } from "../components/TokenMetadataDialog";
import { ManualBuyDialog } from "../components/ManualBuyDialog";
interface Token {
  id: number;
  address: string;
  name: string;
  price: number;
  priceChange: number;
  marketCap: number;
  totalValue: number;
  volume: number;
  imageUrl?: string;
}
interface Wallet {
  id: number;
  address: string;
  selected: boolean;
}
interface WalletWithBalance extends Wallet {
  tokenBalance?: number;
}
interface TokenDetails {
  name: string;
  symbol: string;
  description?: string;
  telegram?: string;
  twitter?: string;
  website?: string;
  buyAmount: string;
}
export function Bundler() {
  const [tokens, setTokens] = useState<Token[]>(Array.from({
    length: 9
  }, (_, i) => ({
    id: i + 1,
    address: "fdfsdf...003jjf",
    name: `Token ${i + 1}`,
    price: 173.58,
    priceChange: i % 2 === 0 ? 2.5 : -1.2,
    marketCap: 5230,
    totalValue: 0,
    volume: 12500,
    imageUrl: `https://example.com/token${i + 1}.png`
  })));
  const [wallets, setWallets] = useState<Wallet[]>(Array.from({
    length: 8
  }, (_, i) => ({
    id: i + 1,
    address: `Wallet ${i + 1}`,
    selected: false
  })));
  const [mode, setMode] = useState("delayed");
  const [sellPercentage, setSellPercentage] = useState(50);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [logs, setLogs] = useState<string[]>(["8:54 AM - Launching token E2vB...pump", "8:53 AM - Token sold successfully", "8:52 AM - Processing transaction", "8:51 AM - Initializing the bundle", "8:50 AM - Connected to network"]);
  const [selectedMode, setSelectedMode] = useState("delayed");
  const [selectedTokenAddress, setSelectedTokenAddress] = useState("E2vB...pump");
  const [launchWallets, setLaunchWallets] = useState<WalletWithBalance[]>(Array.from({
    length: 8
  }, (_, i) => ({
    id: i + 1,
    address: `Wallet ${i + 1}`,
    selected: false,
    tokenBalance: Math.random() * 1000
  })));
  const [onlyDev, setOnlyDev] = useState(false);
  const [isMetaDialogOpen, setIsMetaDialogOpen] = useState(false);
  const [isLaunchDialogOpen, setIsLaunchDialogOpen] = useState(false);
  const [selectedBundlerMode, setSelectedBundlerMode] = useState("delayed");
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("price");
  const [targetMarketCap, setTargetMarketCap] = useState("1000");
  const [isMarketCapEnabled, setIsMarketCapEnabled] = useState(false);
  const [isManualDialogOpen, setIsManualDialogOpen] = useState(false);
  const [isCloneDialogOpen, setIsCloneDialogOpen] = useState(false);
  const [isTokenMetaDialogOpen, setIsTokenMetaDialogOpen] = useState(false);
  const [isTokenCreated, setIsTokenCreated] = useState(false);
  const [tokenDetails, setTokenDetails] = useState<TokenDetails>({
    name: "",
    symbol: "",
    description: "",
    telegram: "",
    twitter: "",
    website: "",
    buyAmount: "0.1"
  });
  const [isManualBuyOpen, setIsManualBuyOpen] = useState(false);
  const tokenCreationService = new TokenCreationService();
  const handleTokenMetadataSave = (metadata: any) => {
    const newToken = {
      id: Date.now(),
      address: `${metadata.symbol.toLowerCase()}...${Math.random().toString(36).substring(2, 6)}`,
      name: metadata.name,
      price: 0.001,
      priceChange: 2.5,
      marketCap: 1000,
      totalValue: 0,
      volume: 5000,
      imageUrl: metadata.imageUrl
    };
    setTokens(prevTokens => [newToken, ...prevTokens]);
    setSelectedToken(newToken);
    setIsTokenMetaDialogOpen(false);
    toast.success("Token created and selected successfully");
  };
  const handleTokenSelect = (token: Token) => {
    setSelectedToken(prevToken => prevToken?.id === token.id ? null : token);
    if (selectedToken?.id !== token.id) {
      setSelectedMode("delayed");
      setSelectedTokenAddress(token.address);
      const rightPanel = document.querySelector(".right-panel");
      rightPanel?.scrollIntoView({
        behavior: "smooth"
      });
    }
  };
  const handleSaveTokenMeta = (newToken: Token) => {
    setTokens(prev => [newToken, ...prev]);
  };
  const handleCreateToken = async () => {
    try {
      const newToken = await tokenCreationService.createToken(tokenDetails);
      setTokenDetails({
        ...tokenDetails
      });
      setIsTokenCreated(true);
      setSelectedToken({
        id: Date.now(),
        address: newToken.address,
        name: newToken.name,
        price: newToken.price,
        priceChange: newToken.priceChange,
        marketCap: newToken.marketCap,
        totalValue: 0,
        volume: newToken.volume
      });
      toast.success("Token created successfully");
    } catch (error) {
      toast.error("Failed to create token");
    }
  };
  const handleCreateMarketId = () => {
    // Add logic for creating market ID
  };
  const renderRightPanelContent = () => {
    if (!selectedToken) {
      return <>
          <div className="bg-[#F4F5FA] p-2 rounded">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#2879fe] to-[#8b5cf6] flex items-center justify-center">
                <Coins className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-[#2C406E]">
                    Select a token
                  </span>
                  <Badge className="h-5 bg-[#2879fe] bg-opacity-10 text-[#2879fe] border-0 px-2">
                    {selectedMode}
                  </Badge>
                </div>
                <span className="text-[9px] text-[#6b7280]">
                  No token selected
                </span>
              </div>
            </div>
          </div>
        </>;
    }
    return <>
        <div className="bg-[#F4F5FA] p-2 rounded">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#2879fe] to-[#8b5cf6] flex items-center justify-center">
              <Coins className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-[#2C406E]">
                  {selectedToken.name}
                </span>
                <Badge className="h-5 bg-[#2879fe] bg-opacity-10 text-[#2879fe] border-0 px-2">
                  {selectedMode}
                </Badge>
              </div>
              <span className="text-[9px] text-[#6b7280]">
                {selectedToken.address}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-[#F4F5FA] p-2 rounded">
          <div className="flex w-full mb-2">
            <Button className={`flex-1 h-5 text-[10px] ${activeTab === "price" ? "bg-[#2879fe] text-white" : "bg-white text-[#2C406E]"} rounded-none hover:bg-[#2879fe99] font-medium`} onClick={() => setActiveTab("price")}>
              Price
            </Button>
            <Button className={`flex-1 h-5 text-[10px] ${activeTab === "marketcap" ? "bg-[#2879fe] text-white" : "bg-white text-[#2C406E]"} rounded-none hover:bg-[#2879fe99] font-medium`} onClick={() => setActiveTab("marketcap")}>
              Market Cap
            </Button>
          </div>
          {activeTab === "price" ? <>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-[10px] text-[#2C406E]">Price</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-[#2879fe] font-medium">
                    ${selectedToken.price}
                  </span>
                  <span className={`flex items-center text-[10px] ${selectedToken.priceChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {selectedToken.priceChange >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                    {Math.abs(selectedToken.priceChange)}%
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-[10px] text-[#2C406E]">Market Cap</span>
                <span className="text-[10px] text-[#2879fe] font-medium">
                  ${selectedToken.marketCap}K
                </span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-[10px] text-[#2C406E]">24h Volume</span>
                <span className="text-[10px] text-[#2879fe] font-medium">
                  ${selectedToken.volume}
                </span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-[10px] text-[#2C406E]">Total Value</span>
                <span className="text-[10px] text-green-500 font-medium">
                  ${selectedToken.totalValue}
                </span>
              </div>
            </> : <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] text-[#2C406E]">
                  Enable Market Cap
                </Label>
                <Switch checked={isMarketCapEnabled} onCheckedChange={setIsMarketCapEnabled} className="data-[state=checked]:bg-[#2879fe]" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-[#2C406E]">
                  Target Market Cap (K)
                </Label>
                <div className="flex gap-2">
                  <Input type="number" value={targetMarketCap} onChange={e => setTargetMarketCap(e.target.value)} disabled={!isMarketCapEnabled} className="h-6 bg-[#F4F5FA] border-[#8b5cf6] border-opacity-30 text-[10px]" />
                  <Button disabled={!isMarketCapEnabled} className="h-6 text-[10px] bg-[#2879fe] rounded-none hover:bg-[#2879fe99] text-white font-medium px-3" onClick={() => {
                toast.success("Market cap adjustment started");
              }}>
                    Start
                  </Button>
                </div>
              </div>
            </div>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-[10px] text-[#2C406E]">Only Dev</Label>
            <Switch checked={onlyDev} onCheckedChange={setOnlyDev} className="data-[state=checked]:bg-[#2879fe]" />
          </div>
          <Label className="text-[10px] text-[#2C406E] block">
            Sell Percentage: {sellPercentage}%
          </Label>
          <input type="range" min="0" max="100" value={sellPercentage} onChange={e => setSellPercentage(Number(e.target.value))} className="w-full" />
          <div className="flex gap-2">
            <Button className="h-6 flex-1 text-[10px] bg-red-500 rounded-none hover:bg-red-600 text-white font-medium">
              Sell {selectedToken.name}
            </Button>
            <Button className="h-6 flex-1 text-[10px] bg-[#2879fe] rounded-none hover:bg-[#2879fe99] text-white font-medium">
              Redeem All
            </Button>
          </div>
        </div>
      </>;
  };
  return <div className="flex flex-col gap-2">
      <Card className="card">
        <CardContent className="flex items-center justify-between p-2">
          <div className="text-[#0d0d0d]">
            <h1 className="text-sm font-bold text-[#2C406E]">Bundle Manager</h1>
            <p className="text-[10px]">Manage your token bundles</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-[12px] text-[#2C406E]">Dev/Main.</div>
              <div className="text-[10px] text-[#2C406E]">4.1662 SOL</div>
            </div>
            <div className="text-right">
              <div className="text-[12px] text-[#2C406E]">Funding.</div>
              <div className="text-[10px] text-[#2C406E]">4.1662 SOL</div>
            </div>
            <Button variant="outline" size="sm" className="h-6 w-6 p-0 border-[#8b5cf6] border-opacity-30 text-[#fff] bg-[#2879fe] rounded-none hover:bg-[#2879fe99]">
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-12 gap-2">
        <Card className="col-span-3  bg-[#Fff] p-2 rounded">
          <CardHeader className="p-2 flex flex-row items-center justify-between">
            <CardTitle className="text-[#2C406E] text-xs">
              Token Creation
            </CardTitle>
            <Button className="h-6 px-2 text-[10px] bg-[#2879fe] rounded-none hover:bg-[#2879fe99] text-white font-medium" onClick={() => setIsTokenMetaDialogOpen(true)}>
              <Plus className="h-3 w-3 mr-1" />
              New
            </Button>
          </CardHeader>
          <CardContent className="p-2 space-y-2">
            <div className="space-y-2 max-h-[200px] overflow-y-auto border-t border-gray-100 pt-2">
              {tokens.map(token => <div key={token.id} className="flex items-center justify-between p-2 bg-[#F4F5FA] rounded-lg hover:bg-[#E4E6F0] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#2879fe] to-[#8b5cf6] flex items-center justify-center">
                      {token.imageUrl ? <img src={token.imageUrl} alt={token.name} className="h-full w-full rounded-full object-cover" /> : <Coins className="h-4 w-4 text-white" />}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#2C406E]">
                        {token.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {token.address}
                      </div>
                    </div>
                  </div>
                  <Button onClick={() => handleTokenSelect(token)} className={`h-6 px-3 text-[10px] ${selectedToken?.id === token.id ? "bg-green-500 hover:bg-green-600" : "bg-[#2879fe] hover:bg-[#2879fe99]"} rounded-none text-white font-medium`}>
                    {selectedToken?.id === token.id ? "Selected" : "Select"}
                  </Button>
                </div>)}
            </div>
            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <Button className="h-6 flex-1 text-[10px] bg-[#2879fe] rounded-none hover:bg-[#2879fe99] text-white font-medium" onClick={() => setIsWizardOpen(true)}>
                Bundle Launch
              </Button>
              <Button className="h-6 flex-1 text-[10px] bg-[#2879fe] rounded-none hover:bg-[#2879fe99] text-white font-medium" onClick={() => setIsManualBuyOpen(true)}>
                Manual Buy
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-6  bg-[#Fff] p-0 rounded">
          <CardContent className="p-0">
            <BundlerAccordion logs={logs} wallets={wallets} onSellPercentage={(address, percentage) => {
            toast.success(`Selling ${percentage}% from wallet ${address}`);
          }} />
          </CardContent>
        </Card>
        <Card className="col-span-3  bg-[#Fff] p-2 rounded right-panel">
          <CardContent className="p-2 space-y-2">
            {renderRightPanelContent()}
          </CardContent>
        </Card>
      </div>
      <TokenMetaDialog open={isTokenMetaDialogOpen} onOpenChange={setIsTokenMetaDialogOpen} onSave={handleTokenMetadataSave} />
      <LaunchDialog open={isLaunchDialogOpen} onOpenChange={setIsLaunchDialogOpen} mode={selectedBundlerMode} />
      <BundlerWizardDialog open={isWizardOpen} onOpenChange={setIsWizardOpen} onModeSelect={mode => {
      setSelectedBundlerMode(mode);
      setIsLaunchDialogOpen(true);
    }} />
      <ManualTokenDialog open={isManualDialogOpen} onOpenChange={setIsManualDialogOpen} onSelect={token => {
      setTokenDetails({
        ...tokenDetails,
        name: token.name,
        symbol: token.symbol,
        description: token.description || "",
        telegram: token.telegram || "",
        twitter: token.twitter || "",
        website: token.website || ""
      });
      setIsTokenCreated(true);
      toast.success("Token details loaded");
    }} />
      <CloneTokenDialog open={isCloneDialogOpen} onOpenChange={setIsCloneDialogOpen} onTokenFound={tokenData => {
      setTokenDetails({
        ...tokenDetails,
        name: tokenData.name,
        symbol: tokenData.symbol,
        description: tokenData.description,
        telegram: tokenData.telegram,
        twitter: tokenData.twitter,
        website: tokenData.website
      });
      setIsTokenCreated(true);
      toast.success("Token details loaded");
    }} />
      <ManualBuyDialog open={isManualBuyOpen} onOpenChange={setIsManualBuyOpen} />
    </div>;
}