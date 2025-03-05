import React, { useEffect, useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw, Image as ImageIcon, X, Search } from "lucide-react";
import { TokenMeta, TokenMetaService } from "../services/token/TokenMetaService";
import toast from "react-hot-toast";
interface TokenMetaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (token: Token) => void;
}
type TabType = "new" | "clone";
interface TokenInfo {
  name: string;
  symbol: string;
  price: number;
  marketCap: number;
  volume: number;
  imageUrl?: string;
}
export function TokenMetaDialog({
  open,
  onOpenChange,
  onSave
}: TokenMetaDialogProps) {
  const [activeTab, setActiveTab] = useState<TabType>("new");
  const [isSearching, setIsSearching] = useState(false);
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [meta, setMeta] = useState<TokenMeta>({
    name: "",
    symbol: "",
    decimals: 9,
    description: "",
    website: "",
    twitter: "",
    telegram: ""
  });
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tokenMetaService = new TokenMetaService();
  const cleanupImageUrl = (url: string | null) => {
    if (url?.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  };
  useEffect(() => {
    return () => {
      if (imagePreview) {
        cleanupImageUrl(imagePreview);
      }
    };
  }, [imagePreview]);
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  const handleImageDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please drop an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meta.name || !meta.symbol) {
      toast.error("Name and symbol are required");
      return;
    }
    setIsSaving(true);
    try {
      let imageUrl = null;
      if (imageFile) {
        setIsUploading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        imageUrl = URL.createObjectURL(imageFile);
        setIsUploading(false);
      }
      onSave({
        ...meta,
        imageUrl
      });
      setMeta({
        name: "",
        symbol: "",
        decimals: 9,
        description: "",
        website: "",
        twitter: "",
        telegram: ""
      });
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save token meta");
    } finally {
      setIsSaving(false);
    }
  };
  const handleSearch = async () => {
    if (!tokenAddress.trim()) {
      toast.error("Please enter a token address");
      return;
    }
    setIsSearching(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTokenInfo({
        name: "Sample Token",
        symbol: "SMPL",
        price: 0.123,
        marketCap: 1000000,
        volume: 500000,
        imageUrl: "https://placehold.co/200x200"
      });
    } catch (error) {
      toast.error("Failed to fetch token information");
      setTokenInfo(null);
    } finally {
      setIsSearching(false);
    }
  };
  const handleClone = async () => {
    if (!tokenInfo) {
      toast.error("Please search for a token first");
      return;
    }
    setIsSaving(true);
    try {
      const newToken = await tokenMetaService.saveTokenMeta({
        name: tokenInfo.name,
        symbol: tokenInfo.symbol,
        decimals: 9,
        imageUrl: tokenInfo.imageUrl
      });
      onSave(newToken);
      toast.success("Token cloned successfully");
      onOpenChange(false);
      setTokenAddress("");
      setTokenInfo(null);
    } catch (error) {
      toast.error("Failed to clone token");
    } finally {
      setIsSaving(false);
    }
  };
  const renderTabContent = () => {
    if (activeTab === "clone") {
      return <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label className="text-[10px] text-[#2C406E] mb-2 block">
                Token Address
              </Label>
              <Input value={tokenAddress} onChange={e => setTokenAddress(e.target.value)} className="h-7 bg-[#F4F5FA] border-[#8b5cf6] border-opacity-30 text-[10px]" placeholder="Enter token address" />
            </div>
            <Button type="button" onClick={handleSearch} disabled={isSearching} className="h-7 px-4 mt-6 text-[10px] bg-[#2879fe] rounded-none hover:bg-[#2879fe99] text-white">
              {isSearching ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Search className="h-3 w-3" />}
            </Button>
          </div>
          {tokenInfo && <div className="bg-[#F4F5FA] p-4 rounded-lg space-y-3">
              <div className="flex items-center gap-4">
                {tokenInfo.imageUrl && <img src={tokenInfo.imageUrl} alt={tokenInfo.name} className="w-12 h-12 rounded-full" />}
                <div>
                  <h3 className="text-sm font-medium">{tokenInfo.name}</h3>
                  <p className="text-xs text-gray-500">{tokenInfo.symbol}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-[10px] text-[#2C406E]">Price</Label>
                  <p className="text-sm">${tokenInfo.price.toFixed(4)}</p>
                </div>
                <div>
                  <Label className="text-[10px] text-[#2C406E]">
                    Market Cap
                  </Label>
                  <p className="text-sm">
                    ${tokenInfo.marketCap.toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className="text-[10px] text-[#2C406E]">Volume</Label>
                  <p className="text-sm">
                    ${tokenInfo.volume.toLocaleString()}
                  </p>
                </div>
              </div>
              <Button type="button" onClick={handleClone} disabled={isSaving} className="w-full h-7 text-[10px] bg-[#2879fe] rounded-none hover:bg-[#2879fe99] text-white">
                {isSaving ? <div className="flex items-center gap-2">
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    <span>Cloning...</span>
                  </div> : "Clone Token"}
              </Button>
            </div>}
        </div>;
    }
    return <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="text-[10px] text-[#2C406E]">Token Image</Label>
            <div className={`relative border-2 border-dashed rounded-lg p-4 text-center ${imagePreview ? "border-[#2879fe]" : "border-gray-300"}`} onDrop={handleImageDrop} onDragOver={handleDragOver}>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageSelect} />
              {imagePreview ? <div className="relative">
                  <img src={imagePreview} alt="Token preview" className="w-32 h-32 mx-auto rounded-lg object-cover" />
                  <button type="button" onClick={handleRemoveImage} className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600">
                    <X className="h-3 w-3" />
                  </button>
                </div> : <div className="cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <ImageIcon className="h-10 w-10 mx-auto text-gray-400" />
                  <p className="mt-2 text-[10px] text-gray-500">
                    Click or drag image here
                  </p>
                  <p className="text-[9px] text-gray-400">PNG, JPG up to 2MB</p>
                </div>}
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] text-[#2C406E]">Token Name</Label>
            <Input value={meta.name} onChange={e => setMeta(prev => ({
            ...prev,
            name: e.target.value
          }))} className="h-7 bg-[#F4F5FA] border-[#8b5cf6] border-opacity-30 text-[10px]" placeholder="Enter token name" />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] text-[#2C406E]">Symbol</Label>
            <Input value={meta.symbol} onChange={e => setMeta(prev => ({
            ...prev,
            symbol: e.target.value.toUpperCase()
          }))} className="h-7 bg-[#F4F5FA] border-[#8b5cf6] border-opacity-30 text-[10px]" placeholder="Enter token symbol" />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] text-[#2C406E]">Description</Label>
            <Input value={meta.description} onChange={e => setMeta(prev => ({
            ...prev,
            description: e.target.value
          }))} className="h-7 bg-[#F4F5FA] border-[#8b5cf6] border-opacity-30 text-[10px]" placeholder="Enter token description" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="text-[10px] text-[#2C406E]">Website URL</Label>
            <Input value={meta.website} onChange={e => setMeta(prev => ({
            ...prev,
            website: e.target.value
          }))} className="h-7 bg-[#F4F5FA] border-[#8b5cf6] border-opacity-30 text-[10px]" placeholder="https://" />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] text-[#2C406E]">Twitter Handle</Label>
            <Input value={meta.twitter} onChange={e => setMeta(prev => ({
            ...prev,
            twitter: e.target.value
          }))} className="h-7 bg-[#F4F5FA] border-[#8b5cf6] border-opacity-30 text-[10px]" placeholder="@" />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] text-[#2C406E]">Telegram Group</Label>
            <Input value={meta.telegram} onChange={e => setMeta(prev => ({
            ...prev,
            telegram: e.target.value
          }))} className="h-7 bg-[#F4F5FA] border-[#8b5cf6] border-opacity-30 text-[10px]" placeholder="t.me/" />
          </div>
        </div>
      </div>;
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] bg-white">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-[#2C406E]">Token Meta</DialogTitle>
            <div className="flex gap-2">
              <Button type="button" onClick={() => setActiveTab("new")} className={`h-7 px-4 text-[10px] rounded-none ${activeTab === "new" ? "bg-[#2879fe] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                New
              </Button>
              <Button type="button" onClick={() => setActiveTab("clone")} className={`h-7 px-4 text-[10px] rounded-none ${activeTab === "clone" ? "bg-[#2879fe] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                Clone
              </Button>
            </div>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {renderTabContent()}
          {activeTab === "new" && <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
              <Button type="button" onClick={() => onOpenChange(false)} className="h-7 px-4 text-[10px] bg-gray-500 rounded-none hover:bg-gray-600 text-white">
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving || isUploading} className="h-7 px-4 text-[10px] bg-[#2879fe] rounded-none hover:bg-[#2879fe99] text-white">
                {isSaving || isUploading ? <div className="flex items-center gap-2">
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    <span>{isUploading ? "Uploading..." : "Saving..."}</span>
                  </div> : "Save Token"}
              </Button>
            </div>}
        </form>
      </DialogContent>
    </Dialog>;
}