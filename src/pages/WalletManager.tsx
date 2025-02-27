import React, { useCallback, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { RefreshCw, X, DicesIcon, SplitIcon } from "lucide-react";
import { CreateWalletsService, GeneratedWallet } from "../services/wallet/CreateWalletsService";
import { ExportWalletsService } from "../services/wallet/ExportWalletsService";
import { DeleteWalletsService } from "../services/wallet/DeleteWalletsService";
import { ImportWalletsService } from "../services/wallet/ImportWalletsService";
import { GenerateProfilesService } from "../services/wallet/GenerateProfilesService";
import { AgeWalletsService } from "../services/wallet/AgeWalletsService";
import { MixFundsService } from "../services/wallet/MixFundsService";
import { FundAllWalletsService } from "../services/wallet/FundAllWalletsService";
import { CollectTokensService } from "../services/wallet/CollectTokensService";
import { SplitFundsService } from "../services/wallet/SplitFundsService";
import { RandomAirdropService } from "../services/wallet/RandomAirdropService";
import { toast } from "sonner";
interface Wallet {
  id: string;
  address: string;
  privateKey: string;
  balance: number;
  network: string;
  profileName?: string;
}
export function WalletManager() {
  const [wallets, setWallets] = useState<Wallet[]>([{
    id: "1",
    address: "9K23cWM5doGC3FqgvxTrXzh7uZbhGN2W",
    privateKey: "5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3",
    balance: 0,
    network: "photon"
  }, {
    id: "2",
    address: "5FcATacM5XzYvexJRCCE61CxYvhcbcH15",
    privateKey: "5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3",
    balance: 0,
    network: "photon"
  }, {
    id: "3",
    address: "2Z74eGF5dWRm13MzRvz61gR5SH82XQCF",
    privateKey: "5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3",
    balance: 0,
    network: "photon"
  }, {
    id: "4",
    address: "7zFAEQUE2RNEL3FH5DQQYSTGMP182",
    privateKey: "5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3",
    balance: 0,
    network: "photon"
  }, {
    id: "5",
    address: "3J1L9GQEKF4GFaRm3DRPY8KEF7Ma16",
    privateKey: "5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3",
    balance: 0,
    network: "photon"
  }]);
  const [selectedWallets, setSelectedWallets] = useState<Set<string>>(new Set());
  const [newWalletCount, setNewWalletCount] = useState<number>(10);
  const [isCreatingWallets, setIsCreatingWallets] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isGeneratingProfiles, setIsGeneratingProfiles] = useState(false);
  const [isAging, setIsAging] = useState(false);
  const [isMixing, setIsMixing] = useState(false);
  const [mixRounds, setMixRounds] = useState(3);
  const [fundAmount, setFundAmount] = useState<number>(0);
  const [splitMinAmount, setSplitMinAmount] = useState<number>(0.1);
  const [splitMaxAmount, setSplitMaxAmount] = useState<number>(1);
  const [isFunding, setIsFunding] = useState(false);
  const [isCollecting, setIsCollecting] = useState(false);
  const [isSplitting, setIsSplitting] = useState(false);
  const [isAirdropping, setIsAirdropping] = useState(false);
  const createWalletsService = new CreateWalletsService();
  const exportWalletsService = new ExportWalletsService();
  const deleteWalletsService = new DeleteWalletsService();
  const importWalletsService = new ImportWalletsService();
  const generateProfilesService = new GenerateProfilesService();
  const ageWalletsService = new AgeWalletsService();
  const mixFundsService = new MixFundsService();
  const fundAllWalletsService = new FundAllWalletsService();
  const collectTokensService = new CollectTokensService();
  const splitFundsService = new SplitFundsService();
  const randomAirdropService = new RandomAirdropService();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedWallets(new Set(wallets.map(wallet => wallet.id)));
    } else {
      setSelectedWallets(new Set());
    }
  };
  const handleWalletSelect = (walletId: string, checked: boolean) => {
    const newSelected = new Set(selectedWallets);
    if (checked) {
      newSelected.add(walletId);
    } else {
      newSelected.delete(walletId);
    }
    setSelectedWallets(newSelected);
  };
  const handleCreateWallets = useCallback(async () => {
    if (newWalletCount <= 0) {
      toast.error("Please enter a valid number of wallets to create");
      return;
    }
    if (wallets.length + newWalletCount > 40) {
      toast.error("Cannot create more than 40 wallets");
      return;
    }
    setIsCreatingWallets(true);
    try {
      const newWallets = await createWalletsService.execute(newWalletCount);
      setWallets(prev => [...prev, ...newWallets]);
      toast.success(`Successfully created ${newWalletCount} wallets`);
    } catch (error) {
      console.error("Failed to create wallets:", error);
      toast.error("Failed to create wallets. Please try again.");
    } finally {
      setIsCreatingWallets(false);
    }
  }, [newWalletCount, wallets.length]);
  const handleExportWallets = useCallback(async () => {
    if (selectedWallets.size === 0) {
      toast.error("Please select wallets to export");
      return;
    }
    setIsExporting(true);
    try {
      const selectedWalletsData = wallets.filter(wallet => selectedWallets.has(wallet.id)).map(wallet => ({
        address: wallet.address,
        privateKey: wallet.privateKey
      }));
      await exportWalletsService.execute(selectedWalletsData);
      toast.success(`Successfully exported ${selectedWallets.size} wallets`);
    } catch (error) {
      console.error("Failed to export wallets:", error);
      toast.error("Failed to export wallets. Please try again.");
    } finally {
      setIsExporting(false);
    }
  }, [selectedWallets, wallets]);
  const handleDeleteAll = async () => {
    if (!confirm("Are you sure you want to delete all wallets?")) return;
    setIsDeleting(true);
    try {
      await deleteWalletsService.execute();
      setWallets([]);
      setSelectedWallets(new Set());
      toast.success("Successfully deleted all wallets");
    } catch (error) {
      toast.error("Failed to delete wallets");
    } finally {
      setIsDeleting(false);
    }
  };
  const handleImport = () => {
    fileInputRef.current?.click();
  };
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsImporting(true);
    try {
      const importedWallets = await importWalletsService.execute(file);
      const newWallets = importedWallets.map((wallet, index) => ({
        id: `imported-${Date.now()}-${index}`,
        address: wallet.address,
        privateKey: wallet.privateKey,
        balance: 0,
        network: "photon"
      }));
      setWallets(prev => [...prev, ...newWallets]);
      toast.success(`Successfully imported ${newWallets.length} wallets`);
    } catch (error) {
      toast.error("Failed to import wallets");
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };
  const handleGenerateProfiles = async () => {
    setIsGeneratingProfiles(true);
    try {
      const profiles = await generateProfilesService.execute(wallets.map(w => w.id));
      setWallets(prev => prev.map(wallet => ({
        ...wallet,
        profileName: profiles[wallet.id]
      })));
      toast.success("Successfully generated profiles");
    } catch (error) {
      toast.error("Failed to generate profiles");
    } finally {
      setIsGeneratingProfiles(false);
    }
  };
  const handleAgeWallets = async () => {
    setIsAging(true);
    try {
      await ageWalletsService.execute(wallets.map(w => w.id));
      toast.success("Successfully aged wallets");
    } catch (error) {
      toast.error("Failed to age wallets");
    } finally {
      setIsAging(false);
    }
  };
  const handleMixFunds = async () => {
    if (mixRounds <= 0) {
      toast.error("Please enter a valid number of rounds");
      return;
    }
    setIsMixing(true);
    try {
      await mixFundsService.execute(mixRounds);
      toast.success("Successfully mixed funds");
    } catch (error) {
      toast.error("Failed to mix funds");
    } finally {
      setIsMixing(false);
    }
  };
  const handleFundAllWallets = async (walletIds: string[], amount: number) => {
    if (amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    setIsFunding(true);
    try {
      await fundAllWalletsService.execute(walletIds, amount);
      toast.success("Successfully funded all wallets");
    } catch (error) {
      toast.error("Failed to fund wallets");
    } finally {
      setIsFunding(false);
    }
  };
  const handleCollectTokens = async (tokenType: "SOL" | "SPL") => {
    if (selectedWallets.size === 0) {
      toast.error("Please select wallets to collect from");
      return;
    }
    setIsCollecting(true);
    try {
      await collectTokensService.execute(Array.from(selectedWallets), tokenType);
      toast.success(`Successfully collected ${tokenType}`);
    } catch (error) {
      toast.error(`Failed to collect ${tokenType}`);
    } finally {
      setIsCollecting(false);
    }
  };
  const handleSplitFunds = async () => {
    if (splitMinAmount >= splitMaxAmount) {
      toast.error("Minimum amount must be less than maximum amount");
      return;
    }
    setIsSplitting(true);
    try {
      await splitFundsService.execute({
        minAmount: splitMinAmount,
        maxAmount: splitMaxAmount,
        walletIds: wallets.map(w => w.id)
      });
      toast.success("Successfully split funds");
    } catch (error) {
      toast.error("Failed to split funds");
    } finally {
      setIsSplitting(false);
    }
  };
  const handleRandomAirdrop = async () => {
    if (splitMinAmount >= splitMaxAmount) {
      toast.error("Minimum amount must be less than maximum amount");
      return;
    }
    setIsAirdropping(true);
    try {
      await randomAirdropService.execute({
        minAmount: splitMinAmount,
        maxAmount: splitMaxAmount,
        walletIds: wallets.map(w => w.id)
      });
      toast.success("Successfully airdropped funds");
    } catch (error) {
      toast.error("Failed to airdrop funds");
    } finally {
      setIsAirdropping(false);
    }
  };
  return <>
      <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleFileSelect} />
      <div className="flex flex-col gap-2 p-2">
        <Card className="card">
          <CardContent className="flex items-center justify-between p-2">
            <div className="text-[#0d0d0d]">
              <h1 className="text-sm font-bold text-[#0d0d0d]">
                Wallet Manager
              </h1>
              <p className="text-[10px]">{wallets.length}/40 wallets active</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-[12px] text-[#0d0d0d]">Dev/Main.</div>
                <div className="text-[10px] text-[#0d0d0d]">4.1662 SOL</div>
              </div>
              <div className="text-right">
                <div className="text-[12px] text-[#0d0d0d]">Funding.</div>
                <div className="text-[10px] text-[#0d0d0d]">4.1662 SOL</div>
              </div>
              <Button variant="outline" size="sm" className="h-6 w-6 p-0 border-[#8b5cf6] border-opacity-30 text-[#fff] bg-[#3B71CA] hover:bg-[#f87171]">
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-2">
          <Card className="card col-span-1">
            <CardContent className="p-2 space-y-2">
              <div>
                <Label className="text-[10px] text-[#0d0d0d]">
                  New Wallets
                </Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input type="number" value={newWalletCount} onChange={e => setNewWalletCount(Number(e.target.value))} min={1} max={40} className="h-6 w-24 bg-[#F4F5FA] border-[#8b5cf6] border-opacity-30 text-[10px] text-[#0f0f0f]" />
                  <Button className="h-6 flex-1 text-[10px] bg-[#3B71CA] hover:bg-[#f87171] text-white font-bold" onClick={handleCreateWallets} disabled={isCreatingWallets}>
                    {isCreatingWallets ? <div className="flex items-center gap-2">
                        <RefreshCw className="h-3 w-3 animate-spin" />
                        Creating...
                      </div> : "Create Wallets"}
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button className="h-6 text-[10px] bg-[#3B71CA] hover:bg-[#f87171] text-white font-bold" onClick={handleExportWallets} disabled={isExporting}>
                  {isExporting ? <div className="flex items-center gap-2">
                      <RefreshCw className="h-3 w-3 animate-spin" />
                      Exporting...
                    </div> : `Export Selected (${selectedWallets.size})`}
                </Button>
                <Button className="h-6 text-[10px] bg-[#3B71CA] hover:bg-[#f87171] text-white font-bold" onClick={handleImport} disabled={isImporting}>
                  {isImporting ? <div className="flex items-center gap-2">
                      <RefreshCw className="h-3 w-3 animate-spin" />
                      Importing...
                    </div> : "Import"}
                </Button>
              </div>
              <Button className="h-6 w-full text-[10px] bg-[#3B71CA] hover:bg-[#f87171] text-white font-bold" onClick={handleDeleteAll} disabled={isDeleting}>
                {isDeleting ? <div className="flex items-center gap-2">
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    Deleting...
                  </div> : "Delete All"}
              </Button>
            </CardContent>
          </Card>

          <Card className="card col-span-1">
            <CardContent className="p-2 space-y-2">
              <div>
                <Label className="text-[10px] text-[#0d0d0d]">Mix Rounds</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input type="number" value={mixRounds} onChange={e => setMixRounds(Number(e.target.value))} min={1} className="h-6 w-24 bg-[#F4F5FA] border-[#8b5cf6] border-opacity-30 text-[10px] text-[#0d0d0d]" />
                  <Button className="h-6 flex-1 text-[10px] bg-[#3B71CA] hover:bg-[#f87171] text-white font-bold" onClick={handleMixFunds} disabled={isMixing}>
                    {isMixing ? <div className="flex items-center gap-2">
                        <RefreshCw className="h-3 w-3 animate-spin" />
                        Mixing...
                      </div> : "Mix Funds"}
                  </Button>
                </div>
              </div>
              <Button className="h-6 w-full text-[10px] bg-[#3B71CA] hover:bg-[#f87171] text-white font-bold" onClick={handleGenerateProfiles} disabled={isGeneratingProfiles}>
                {isGeneratingProfiles ? <div className="flex items-center gap-2">
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    Generating...
                  </div> : "Generate Profiles"}
              </Button>
              <Button className="h-6 w-full text-[10px] bg-[#3B71CA] hover:bg-[#f87171] text-white font-bold" onClick={handleAgeWallets} disabled={isAging}>
                {isAging ? <div className="flex items-center gap-2">
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    Aging...
                  </div> : "Age All Wallets"}
              </Button>
            </CardContent>
          </Card>

          <Card className="card col-span-1 h-full">
            <CardContent className="p-2 space-y-2">
              <div>
                <Label className="text-[10px] text-[#0d0d0d]">
                  Amount per Wallet
                </Label>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 flex items-center gap-2">
                    <Input type="number" value={fundAmount} onChange={e => setFundAmount(Number(e.target.value))} placeholder="0" className="h-6 bg-[#F4F5FA] border-[#8b5cf6] border-opacity-30 text-[10px] text-[#0d0d0d]" />
                    <span className="text-[10px] text-[#0d0d0d]">SOL</span>
                  </div>
                  <Button className="h-6 w-32 text-[10px] bg-[#3B71CA] hover:bg-[#f87171] text-white font-bold" onClick={() => handleFundAllWallets(wallets.map(w => w.id), fundAmount)} disabled={isFunding}>
                    {isFunding ? <div className="flex items-center gap-2">
                        <RefreshCw className="h-3 w-3 animate-spin" />
                        Funding...
                      </div> : "Fund All Wallets"}
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-6 gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button className="h-6 text-[10px] bg-[#3B71CA] hover:bg-[#f87171] text-white font-bold flex items-center justify-center" onClick={handleSplitFunds} disabled={isSplitting}>
                      {isSplitting ? <RefreshCw className="h-3 w-3 animate-spin" /> : <SplitIcon className="h-3.5 w-3.5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Split Funds</TooltipContent>
                </Tooltip>
                <div className="col-span-2 flex items-center gap-2">
                  <Input type="number" value={splitMinAmount} onChange={e => setSplitMinAmount(Number(e.target.value))} className="h-6 flex-1 bg-[#F4F5FA] border-[#8b5cf6] border-opacity-30 text-[10px] text-[#0d0d0d]" />
                  <span className="text-[10px] text-[#0d0d0d]">SOL</span>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <Input type="number" value={splitMaxAmount} onChange={e => setSplitMaxAmount(Number(e.target.value))} className="h-6 flex-1 bg-[#F4F5FA] border-[#8b5cf6] border-opacity-30 text-[10px] text-[#0d0d0d]" />
                  <span className="text-[10px] text-[#0d0d0d]">SOL</span>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button className="h-6 text-[10px] bg-[#3B71CA] hover:bg-[#f87171] text-white font-bold flex items-center justify-center" onClick={handleRandomAirdrop} disabled={isAirdropping}>
                      {isAirdropping ? <RefreshCw className="h-3 w-3 animate-spin" /> : <DicesIcon className="h-3.5 w-3.5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Random Airdrop</TooltipContent>
                </Tooltip>
              </div>
              <div className="flex gap-2">
                <Button className="h-6 flex-1 text-[10px] bg-[#3B71CA] hover:bg-[#f87171] text-white font-bold" onClick={() => handleCollectTokens("SOL")} disabled={isCollecting}>
                  {isCollecting ? <div className="flex items-center gap-2">
                      <RefreshCw className="h-3 w-3 animate-spin" />
                      Collecting...
                    </div> : "Collect SOL"}
                </Button>
                <Button className="h-6 flex-1 text-[10px] bg-[#3B71CA] hover:bg-[#f87171] text-white font-bold" onClick={() => handleCollectTokens("SPL")} disabled={isCollecting}>
                  {isCollecting ? <div className="flex items-center gap-2">
                      <RefreshCw className="h-3 w-3 animate-spin" />
                      Collecting...
                    </div> : "Collect SPL"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="card">
          <CardContent className="h-full overflow-auto p-2">
            <div className="flex justify-between">
              <div className="mb-2 flex items-center gap-2">
                <Checkbox id="selectAll" className="h-4 w-4 border-[#8b5cf6]" checked={selectedWallets.size === wallets.length} onCheckedChange={handleSelectAll} />
                <Label htmlFor="selectAll" className="text-[10px] text-[#0d0d0d]">
                  Select All Wallets
                </Label>
              </div>
              <Button variant="outline" size="sm" className="h-6 w-6 p-0 border-[#8b5cf6] border-opacity-30 text-[#fff] bg-[#3B71CA] hover:bg-[#f87171]">
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="space-y-1">
              {wallets.map(wallet => <div key={wallet.id} className="flex items-center gap-2">
                  <Checkbox className="h-4 w-4 border-[#8b5cf6]" checked={selectedWallets.has(wallet.id)} onCheckedChange={checked => handleWalletSelect(wallet.id, checked)} />
                  <div className="flex-1">
                    <div className="text-[10px] text-[#0d0d0d]">
                      {wallet.address}
                      {wallet.profileName && <span className="ml-2 text-[#3B71CA]">
                          ({wallet.profileName})
                        </span>}
                    </div>
                    <div className="text-[10px] text-[#0d0d0d]">
                      Balance: {wallet.balance} SOL
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input type="number" placeholder="0" className="h-6 w-20 bg-[#F4F5FA] border-[#8b5cf6] border-opacity-30 text-[10px] text-[#0d0d0d]" />
                    <span className="text-[10px] text-[#0d0d0d]">SOL</span>
                    <Button className="h-6 w-16 text-[10px] bg-[#3B71CA] hover:bg-[#f87171] text-white font-bold" onClick={() => handleFundAllWallets([wallet.id], fundAmount)} disabled={isFunding}>
                      {isFunding ? <RefreshCw className="h-3 w-3 animate-spin" /> : "Fund"}
                    </Button>
                    <Select defaultValue={wallet.network}>
                      <SelectTrigger className="h-6 border-[#8b5cf6] border-opacity-30 text-[10px] bg-[#F4F5FA]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#F4F5FA] border-[#8b5cf6] border-opacity-30 text-[#fff]">
                        <SelectItem value="photon" className="text-[10px] focus:bg-[#2e1065] focus:text-[#fff]">
                          photon
                        </SelectItem>
                        <SelectItem value="mainnet" className="text-[10px] focus:bg-[#2e1065] focus:text-[#fff]">
                          mainnet
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Button className="h-6 w-16 text-[10px] bg-[#3B71CA] hover:bg-[#f87171] text-white font-bold" onClick={() => handleAgeWallets([wallet.id])} disabled={isAging}>
                      {isAging ? <RefreshCw className="h-3 w-3 animate-spin" /> : "Age"}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 p-0 text-[#0d0d0d] hover:text-red-500" onClick={() => {
                  const confirmed = confirm("Are you sure you want to delete this wallet?");
                  if (confirmed) {
                    setWallets(prev => prev.filter(w => w.id !== wallet.id));
                    setSelectedWallets(prev => {
                      const newSet = new Set(prev);
                      newSet.delete(wallet.id);
                      return newSet;
                    });
                  }
                }}>
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>)}
            </div>
          </CardContent>
        </Card>
      </div>
    </>;
}