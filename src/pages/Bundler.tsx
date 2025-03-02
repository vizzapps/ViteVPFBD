import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Share2, RefreshCw, Coins, ArrowUp, ArrowDown, CheckCircle2, ClipboardCopy, MousePointerClick, PlusIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { TokenMetaDialog } from "../components/TokenMetaDialog";
import { Badge } from "@/components/ui/badge";
import { LaunchDialog } from "../components/LaunchDialog";
import { TokenCreationService } from "../services/token/TokenCreationService";
import { BundlerWizardDialog } from "../components/BundlerWizardDialog";
interface Token {
  id: number;
  address: string;
  name: string;
  price: number;
  priceChange: number;
  marketCap: number;
  totalValue: number;
  volume: number;
}
interface Wallet {
  id: number;
  address: string;
  selected: boolean;
}
interface WalletWithBalance extends Wallet {
  tokenBalance?: number;
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
    volume: 12500
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
  const tokenCreationService = new TokenCreationService();
  const handleTokenSelect = (token: Token) => {
    const newSelected = token === selectedToken ? null : token;
    setSelectedToken(newSelected);
    if (newSelected) {
      setSelectedMode("delayed");
      setSelectedTokenAddress(newSelected.address);
    } else {
      setSelectedMode("delayed");
      setSelectedTokenAddress("E2vB...pump");
    }
  };
  const handleSaveTokenMeta = (newToken: Token) => {
    setTokens(prev => [newToken, ...prev]);
  };
  const [bundlerWallets, setBundlerWallets] = useState([]);
  const [isBundlerEnabled, setIsBundlerEnabled] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBundleLaunched, setIsBundleLaunched] = useState(false);
  const [isTokenCreated, setIsTokenCreated] = useState(false);
  const [tokenDetails, setTokenDetails] = useState({
    name: "",
    symbol: "",
    description: "",
    telegram: "",
    twitter: "",
    website: "",
    buyAmount: "0.1"
  });
  const [projectSettings, setProjectSettings] = useState({
    tokenType: "",
    bundlerEnabled: false,
    bundlerWalletCount: 10,
    delayBundlingEnabled: false,
    bundlingDelay: 0,
    initialSupplyToBundle: 1000000,
    useRandomAmounts: false,
    minBuy: 0.1,
    maxBuy: 1
  });
  const handleCreateProject = () => {
    if (projectSettings.bundlerEnabled) {
      const newBundlerWallets = Array.from({
        length: projectSettings.bundlerWalletCount
      }, (_, index) => ({
        id: index + 1,
        amount: projectSettings.useRandomAmounts ? Math.random() * (projectSettings.maxBuy - projectSettings.minBuy) + projectSettings.minBuy : projectSettings.minBuy
      }));
      setBundlerWallets(newBundlerWallets);
      setIsBundlerEnabled(true);
    } else {
      setBundlerWallets([]);
      setIsBundlerEnabled(false);
    }
    setIsDialogOpen(false);
  };
  const handleLaunchBundle = () => {
    setIsBundleLaunched(true);
    // Add logic for launching the bundle
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
        </div>
        <div className="bg-[#F4F5FA] p-2 rounded">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] text-[#2C406E]">Launch Wallets</span>
            <span className="text-[10px] text-[#2879fe] font-medium">
              {launchWallets.length} wallets
            </span>
          </div>
          <div className="max-h-[100px] overflow-y-auto space-y-1">
            {launchWallets.map(wallet => <div key={wallet.id} className="flex items-center justify-between p-1 bg-white rounded">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-green-500 rounded-full"></div>
                  <span className="text-[9px] text-[#2C406E]">
                    {wallet.address}
                  </span>
                </div>
                <span className="text-[9px] text-[#2879fe] font-medium">
                  {wallet.tokenBalance?.toFixed(2) || "0.00"}{" "}
                  {selectedToken.name}
                </span>
              </div>)}
          </div>
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
          <CardHeader className="p-2">
            <CardTitle className="text-[#2C406E] text-xs">
              Token Creation
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 space-y-2">
            {!isTokenCreated ? <>
                <div className="flex items-center justify-center mb-2">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] flex items-center justify-center">
                      <PlusIcon className="w-6 h-6 text-white" />
                    </div>
                  </label>
                  <input id="file-upload" type="file" className="hidden" />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label className="text-[10px] text-[#2C406E]">
                      Token Name:
                    </Label>
                    <Input className="h-6  border-[#8b5cf6] border-opacity-30 text-[10px] text-[#2C406E]" placeholder="Enter token name" value={tokenDetails.name} onChange={e => setTokenDetails({
                  ...tokenDetails,
                  name: e.target.value
                })} />
                  </div>
                  <div className="flex-1">
                    <Label className="text-[10px] text-[#2C406E]">
                      Token Symbol:
                    </Label>
                    <Input className="h-6  border-[#8b5cf6] border-opacity-30 text-[10px] text-[#2C406E]" placeholder="Enter token symbol" value={tokenDetails.symbol} onChange={e => setTokenDetails({
                  ...tokenDetails,
                  symbol: e.target.value
                })} />
                  </div>
                </div>
                <div>
                  <Label className="text-[10px] text-[#2C406E]">
                    Description:
                  </Label>
                  <Input className="h-6  border-[#8b5cf6] border-opacity-30 text-[10px] text-[#2C406E]" placeholder="Enter token description" value={tokenDetails.description} onChange={e => setTokenDetails({
                ...tokenDetails,
                description: e.target.value
              })} />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-[10px] text-[#2C406E]">
                      Telegram:
                    </Label>
                    <Input className="h-6  border-[#8b5cf6] border-opacity-30 text-[10px] text-[#2C406E]" placeholder="Enter Telegram link" value={tokenDetails.telegram} onChange={e => setTokenDetails({
                  ...tokenDetails,
                  telegram: e.target.value
                })} />
                  </div>
                  <div>
                    <Label className="text-[10px] text-[#2C406E]">
                      Twitter:
                    </Label>
                    <Input className="h-6  border-[#8b5cf6] border-opacity-30 text-[10px] text-[#2C406E]" placeholder="Enter Twitter link" value={tokenDetails.twitter} onChange={e => setTokenDetails({
                  ...tokenDetails,
                  twitter: e.target.value
                })} />
                  </div>
                  <div>
                    <Label className="text-[10px] text-[#2C406E]">
                      Website:
                    </Label>
                    <Input className="h-6  border-[#8b5cf6] border-opacity-30 text-[10px] text-[#2C406E]" placeholder="Enter website URL" value={tokenDetails.website} onChange={e => setTokenDetails({
                  ...tokenDetails,
                  website: e.target.value
                })} />
                  </div>
                </div>
                <div>
                  <Label className="text-[10px] text-[#2C406E]">
                    Buy Amount (SOL):
                  </Label>
                  <Input className="h-6  border-[#8b5cf6] border-opacity-30 text-[10px] text-[#2C406E]" defaultValue="0.1" placeholder="Enter buy amount" value={tokenDetails.buyAmount} onChange={e => setTokenDetails({
                ...tokenDetails,
                buyAmount: e.target.value
              })} />
                </div>
                <div className="flex gap-2">
                  <Button className="w-full h-6 text-[10px] bg-[#2879fe] rounded-none hover:bg-[#2879fe99] text-white font-medium px-3" onClick={() => setIsWizardOpen(true)}>
                    Blast Bundle
                  </Button>
                </div>
              </> : <>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[10px] text-[#2C406E]">
                      Token Name:
                    </span>
                    <span className="text-[10px] text-[#2C406E] font-semibold">
                      {tokenDetails.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] text-[#2C406E]">
                      Token Symbol:
                    </span>
                    <span className="text-[10px] text-[#2C406E] font-semibold">
                      {tokenDetails.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] text-[#2C406E]">
                      Description:
                    </span>
                    <span className="text-[10px] text-[#2C406E] font-semibold">
                      {tokenDetails.description}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] text-[#2C406E]">
                      Telegram:
                    </span>
                    <span className="text-[10px] text-[#2C406E] font-semibold">
                      {tokenDetails.telegram}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] text-[#2C406E]">Twitter:</span>
                    <span className="text-[10px] text-[#2C406E] font-semibold">
                      {tokenDetails.twitter}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] text-[#2C406E]">Website:</span>
                    <span className="text-[10px] text-[#2C406E] font-semibold">
                      {tokenDetails.website}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] text-[#2C406E]">
                      Buy Amount (SOL):
                    </span>
                    <span className="text-[10px] text-[#2C406E] font-semibold">
                      {tokenDetails.buyAmount}
                    </span>
                  </div>
                </div>
                <Button className="w-full  h-6 text-[10px] bg-[#2879fe] rounded-none hover:bg-[#2879fe99] text-white font-medium px-3" onClick={handleCreateMarketId}>
                  Create Market ID
                </Button>
              </>}
          </CardContent>
        </Card>

        <Card className="col-span-6  bg-[#Fff] p-2 rounded">
          <CardContent className="p-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-[10px] text-[#2C406E]">
                  Activity Logs
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button className="h-6 text-[10px] bg-[#2879fe] rounded-none hover:bg-[#2879fe99] text-white font-medium px-3">
                  Show PnL
                </Button>
              </div>
            </div>
            <div className="bg-[#F4F5FA] p-2 rounded h-[400px] overflow-y-auto">
              <div className="space-y-1">
                {logs.map((log, index) => <div key={index} className="flex items-center gap-2 text-[10px] text-[#2C406E]">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    <span>{log}</span>
                  </div>)}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3  bg-[#Fff] p-2 rounded">
          <CardContent className="p-2 space-y-2">
            {renderRightPanelContent()}
          </CardContent>
        </Card>
      </div>
      <TokenMetaDialog open={isMetaDialogOpen} onOpenChange={setIsMetaDialogOpen} onSave={handleSaveTokenMeta} />
      <LaunchDialog open={isLaunchDialogOpen} onOpenChange={setIsLaunchDialogOpen} mode={selectedBundlerMode} />
      <BundlerWizardDialog open={isWizardOpen} onOpenChange={setIsWizardOpen} onModeSelect={mode => {
      setSelectedBundlerMode(mode);
      setIsLaunchDialogOpen(true);
    }} />
    </div>;
}