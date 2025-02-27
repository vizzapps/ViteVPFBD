import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
export function Settings() {
  const [settings, setSettings] = useState({
    launchPK: "",
    funderPK: "",
    enableDevnet: false,
    rpcURL: "",
    priorityFee: "0.001",
    jitoTips: "0.001",
    shyftApiKey: "",
    maxRetries: 5,
    capsolverApiKey: ""
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Handle settings submission here
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings. Please try again.");
    }
  };
  const handleDevnetChange = (checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      enableDevnet: checked
    }));
  };
  return <Card className="w-full card max-w-4xl mx-auto p-4">
      <CardHeader className="p-2">Settings</CardHeader>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4">
          <div className="flex space-y-2">
            <Label htmlFor="launchPK" className="w-[30%] mt-4 text-sm">
              MainWallet Private Key
            </Label>
            <Input id="launchPK" type="password" placeholder="Token Launcher Private Key not set" value={settings.launchPK} className="h-10 w-full bg-[#F4F5FA] border-[#8b5cf6] border-opacity-30 text-[10px] text-[#0d0d0d]" onChange={e => setSettings(prev => ({
            ...prev,
            launchPK: e.target.value
          }))} />
          </div>
          <div className="flex space-y-2">
            <Label htmlFor="funderPK" className="w-[30%] mt-4 text-sm">
              FunderWallet Private Key
            </Label>
            <Input id="funderPK" type="password" placeholder="Sol Distributor Private Key not set" value={settings.funderPK} className="h-10 w-full bg-[#F4F5FA] border-[#8b5cf6] border-opacity-30 text-[10px] text-[#0d0d0d]" onChange={e => setSettings(prev => ({
            ...prev,
            funderPK: e.target.value
          }))} />
          </div>
          <div className="flex space-y-2">
            <Label htmlFor="customRpcUrl" className="w-[30%] mt-4 text-sm">
              Custom RPC URL
            </Label>
            <Input id="customRpcUrl" placeholder="Custom RPC URL not set" value={settings.rpcURL} className="h-10 w-full bg-[#F4F5FA] border-[#8b5cf6] border-opacity-30 text-[10px] text-[#0d0d0d]" onChange={e => setSettings(prev => ({
            ...prev,
            rpcURL: e.target.value
          }))} />
          </div>
          <div className="flex items-center justify-between py-2">
            <Label htmlFor="enableDevnetMode" className="text-sm font-medium">
              Enable Devnet Mode
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {settings.enableDevnet ? "Enabled" : "Disabled"}
              </span>
              <Switch id="enableDevnetMode" className="data-[state=checked]:bg-[#3B71CA]" checked={settings.enableDevnet} onCheckedChange={handleDevnetChange} />
            </div>
          </div>
          <div className="flex space-y-2">
            <Label htmlFor="shyftApiKey" className="w-[30%] mt-4 text-sm">
              Shyft API Key
            </Label>
            <Input id="shyftApiKey" value={settings.shyftApiKey} className="h-10 w-full bg-[#F4F5FA] border-[#8b5cf6] border-opacity-30 text-[10px] text-[#0d0d0d]" onChange={e => setSettings(prev => ({
            ...prev,
            shyftApiKey: e.target.value
          }))} />
          </div>
          <div className="flex space-y-2">
            <Label htmlFor="capsolverApiKey" className="w-[30%] mt-4 text-sm">
              Capsolver API Key
            </Label>
            <Input id="capsolverApiKey" type="password" value={settings.capsolverApiKey} className="h-10 w-full bg-[#F4F5FA] border-[#8b5cf6] border-opacity-30 text-[10px] text-[#0d0d0d]" onChange={e => setSettings(prev => ({
            ...prev,
            capsolverApiKey: e.target.value
          }))} placeholder="Enter Capsolver API Key" />
          </div>
        </div>
        <div className="flex justify-end">
          <Button className="h-6 flex-1 text-[12px] bg-[#3B71CA] hover:bg-[#f87171]  text-white font-bold">
            Save
          </Button>
        </div>
      </form>
    </Card>;
}