import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, X } from "lucide-react";
import toast from "react-hot-toast";
interface TokenMetadataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (metadata: TokenMetadata) => void;
}
interface TokenMetadata {
  tokenAddress: string;
  telegramUrl: string;
  websiteUrl: string;
  imageUrl: string;
  priorityFee: number;
  computeUnits: number;
  tagging: string;
}
export function TokenMetadataDialog({
  open,
  onOpenChange,
  onSave
}: TokenMetadataDialogProps) {
  const [metadata, setMetadata] = useState<TokenMetadata>({
    tokenAddress: "",
    telegramUrl: "",
    websiteUrl: "",
    imageUrl: "",
    priorityFee: 0.001,
    computeUnits: 250000,
    tagging: ""
  });
  const handleReset = () => {
    setMetadata({
      tokenAddress: "",
      telegramUrl: "",
      websiteUrl: "",
      imageUrl: "",
      priorityFee: 0.001,
      computeUnits: 250000,
      tagging: ""
    });
    toast.success("Metadata reset successfully");
  };
  const handleCloneToken = () => {
    if (!metadata.tokenAddress) {
      toast.error("Please enter a token address");
      return;
    }
    // Add clone token logic here
    toast.success("Token cloned successfully");
  };
  const handleSave = () => {
    onSave(metadata);
    toast.success("Changes saved successfully");
    onOpenChange(false);
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold">
            Token Metadata & Settings
          </DialogTitle>
          <div className="flex items-center gap-2">
            <Button onClick={handleReset} className="h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-md px-4">
              Reset Metadata
            </Button>
            <Button onClick={() => onOpenChange(false)} variant="ghost" className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex gap-4">
            <Input placeholder="Enter token address to clone" value={metadata.tokenAddress} onChange={e => setMetadata({
            ...metadata,
            tokenAddress: e.target.value
          })} className="flex-1 h-10" />
            <Button onClick={handleCloneToken} className="h-10 bg-blue-500 hover:bg-blue-600 text-white px-8">
              Clone Token
            </Button>
          </div>
          <div className="space-y-4">
            <Input placeholder="Enter Telegram URL" value={metadata.telegramUrl} onChange={e => setMetadata({
            ...metadata,
            telegramUrl: e.target.value
          })} className="w-full h-10" />
            <div>
              <Label className="text-sm text-[#2C406E]">Website URL</Label>
              <Input placeholder="Enter Website URL" value={metadata.websiteUrl} onChange={e => setMetadata({
              ...metadata,
              websiteUrl: e.target.value
            })} className="w-full h-10 mt-1" />
            </div>
            <div>
              <Label className="text-sm text-[#2C406E]">Token Image</Label>
              <div className="mt-1">
                <Button type="button" className="h-10 bg-blue-500 hover:bg-blue-600 text-white">
                  Select Image
                </Button>
                {metadata.imageUrl && <img src={metadata.imageUrl} alt="Token" className="mt-2 w-20 h-20 rounded-md" />}
              </div>
            </div>
            <div className="pt-4">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-yellow-500">
                  Advanced settings - modify with caution
                </span>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-[#2C406E]">
                    Priority Fee (SOL)
                  </Label>
                  <Input type="number" value={metadata.priorityFee} onChange={e => setMetadata({
                  ...metadata,
                  priorityFee: Number(e.target.value)
                })} className="w-full h-10 mt-1" />
                </div>
                <div>
                  <Label className="text-sm text-[#2C406E]">
                    Compute Units
                  </Label>
                  <Input type="number" value={metadata.computeUnits} onChange={e => setMetadata({
                  ...metadata,
                  computeUnits: Number(e.target.value)
                })} className="w-full h-10 mt-1" />
                </div>
                <div>
                  <Label className="text-sm text-[#2C406E]">Tagging</Label>
                  <Input value={metadata.tagging} onChange={e => setMetadata({
                  ...metadata,
                  tagging: e.target.value
                })} className="w-full h-10 mt-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between pt-6">
          <Button onClick={() => onOpenChange(false)} className="h-10 bg-gray-100 hover:bg-gray-200 text-gray-700 px-8">
            Cancel
          </Button>
          <Button onClick={handleSave} className="h-10 bg-blue-500 hover:bg-blue-600 text-white px-8">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>;
}