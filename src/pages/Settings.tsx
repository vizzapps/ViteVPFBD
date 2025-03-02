import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RefreshCw, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useLicense } from "../contexts/LicenseContext";
import { CryptoLensService } from "../services/license/CryptoLensService";
interface ValidationAttempt {
  timestamp: Date;
  key: string;
  success: boolean;
  message: string;
}
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
  const {
    isLicenseValid,
    setIsLicenseValid,
    setLicenseKey
  } = useLicense();
  const [licensekey, setLicensekey] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [validationAttempts, setValidationAttempts] = useState<ValidationAttempt[]>([]);
  const [detailedInfo, setDetailedInfo] = useState({
    plan: "Premium",
    features: ["Unlimited Wallets", "Priority Support", "Advanced Tools"],
    lastValidated: null as Date | null,
    validUntil: null as Date | null
  });
  const cryptoLensService = new CryptoLensService();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
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
  const handleValidateLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licensekey.trim()) {
      toast.error("Please enter a license key");
      return;
    }
    setIsValidating(true);
    try {
      const response = await cryptoLensService.validateLicense(licensekey);
      const valid = response.success && response.data?.isValid;
      setIsValid(valid);
      const attempt: ValidationAttempt = {
        timestamp: new Date(),
        key: `${licensekey.substring(0, 4)}...${licensekey.substring(licensekey.length - 4)}`,
        success: valid,
        message: response.message
      };
      setValidationAttempts(prev => [attempt, ...prev].slice(0, 5));
      if (valid && response.data) {
        setDetailedInfo({
          plan: response.data.plan,
          features: response.data.features,
          lastValidated: new Date(),
          validUntil: new Date(response.data.expiresAt)
        });
        setIsLicenseValid(true);
        setLicenseKey(licensekey);
        localStorage.setItem("licenseKey", licensekey);
        toast.success(response.message);
      } else {
        setIsLicenseValid(false);
        setLicenseKey(null);
        localStorage.removeItem("licenseKey");
        toast.error(response.message);
      }
    } catch (error) {
      const attempt: ValidationAttempt = {
        timestamp: new Date(),
        key: `${licensekey.substring(0, 4)}...${licensekey.substring(licensekey.length - 4)}`,
        success: false,
        message: "Validation request failed"
      };
      setValidationAttempts(prev => [attempt, ...prev].slice(0, 5));
      toast.error("Failed to validate license key");
      setIsValid(false);
    } finally {
      setIsValidating(false);
    }
  };
  return <div className="grid grid-cols-2 gap-4 p-4">
      <Card className="w-full card p-4">
        <CardHeader className="p-2">
          <div className="flex justify-between items-center">
            <h1 className="text-sm font-bold text-[#2C406E]">Settings</h1>
            {!isLicenseValid && <span className="text-xs text-red-500">
                License required to modify settings
              </span>}
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <fieldset disabled={!isLicenseValid} className={!isLicenseValid ? "opacity-50" : ""}>
            <div className="grid gap-4">
              <div className="flex space-y-2">
                <Label htmlFor="launchPK" className="w-[30%] mt-2  text-[13px] text-[#0d0d0d]">
                  MainWallet Private Key
                </Label>
                <Input id="launchPK" type="password" placeholder="Token Launcher Private Key not set" value={settings.launchPK} className="h-6 bg-[#F4F5FA] border-[#8b5cf6] border-opacity-30 text-[10px] text-[#0d0d0d]" onChange={e => setSettings(prev => ({
                ...prev,
                launchPK: e.target.value
              }))} />
              </div>
              <div className="flex space-y-2">
                <Label htmlFor="funderPK" className="w-[30%] mt-2  text-[13px] text-[#0d0d0d]">
                  FunderWallet Private Key
                </Label>
                <Input id="funderPK" type="password" placeholder="Sol Distributor Private Key not set" value={settings.funderPK} className="h-6 bg-[#F4F5FA] border-[#8b5cf6] border-opacity-30 text-[10px] text-[#0d0d0d]" onChange={e => setSettings(prev => ({
                ...prev,
                funderPK: e.target.value
              }))} />
              </div>
              <div className="flex space-y-2">
                <Label htmlFor="customRpcUrl" className="w-[30%] mt-2  text-[13px] text-[#0d0d0d]">
                  Custom RPC URL
                </Label>
                <Input id="customRpcUrl" placeholder="Custom RPC URL not set" value={settings.rpcURL} className="h-6 bg-[#F4F5FA] border-[#8b5cf6] border-opacity-30 text-[10px] text-[#0d0d0d]" onChange={e => setSettings(prev => ({
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
                  <Switch id="enableDevnetMode" className="data-[state=checked]:bg-[#2879fe] rounded-none  " checked={settings.enableDevnet} onCheckedChange={handleDevnetChange} />
                </div>
              </div>
              <div className="flex space-y-2">
                <Label htmlFor="shyftApiKey" className="w-[30%] mt-2  text-[13px] text-[#0d0d0d]">
                  Shyft API Key
                </Label>
                <Input id="shyftApiKey" value={settings.shyftApiKey} className="h-6 bg-[#F4F5FA] border-[#8b5cf6] border-opacity-30 text-[10px] text-[#0d0d0d]" onChange={e => setSettings(prev => ({
                ...prev,
                shyftApiKey: e.target.value
              }))} />
              </div>
              <div className="flex space-y-2">
                <Label htmlFor="capsolverApiKey" className="w-[30%] mt-2  text-[13px] text-[#0d0d0d]">
                  Capsolver API Key
                </Label>
                <Input id="capsolverApiKey" type="password" value={settings.capsolverApiKey} className="h-6 bg-[#F4F5FA] border-[#8b5cf6] border-opacity-30 text-[10px] text-[#0d0d0d]" onChange={e => setSettings(prev => ({
                ...prev,
                capsolverApiKey: e.target.value
              }))} placeholder="Enter Capsolver API Key" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button className="h-6 flex-1 text-[12px] bg-[#2879fe] rounded-none   hover:bg-[#f87171]  text-white font-bold">
                Save
              </Button>
            </div>
          </fieldset>
        </form>
      </Card>
      <Card className="w-full card p-4">
        <CardHeader className="p-2">License Validation</CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="licenseKey" className="text-sm">
                License Key
              </Label>
              <div className="flex items-center gap-2">
                <Input id="licensekey" value={licensekey} onChange={e => setLicensekey(e.target.value)} className="h-10 flex-1 bg-[#F4F5FA] border-[#8b5cf6] border-opacity-30 text-[10px] text-[#0d0d0d]" placeholder="Enter your license key" />
                <Button onClick={handleValidateLicense} disabled={isValidating} className="h-10 px-4 bg-[#2879fe] rounded-none hover:bg-[#2879fe99] text-white">
                  {isValidating ? <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Validating...</span>
                    </div> : "Validate"}
                </Button>
              </div>
            </div>
            {isValid !== null && <div className={`flex items-center gap-2 p-3 rounded-md ${isValid ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                {isValid ? <>
                    <CheckCircle2 className="h-4 w-4" />
                    <div className="flex flex-col">
                      <span className="font-medium">License Validated</span>
                      <span className="text-xs opacity-75">
                        Last validated:{" "}
                        {detailedInfo.lastValidated?.toLocaleString()}
                      </span>
                    </div>
                  </> : <>
                    <XCircle className="h-4 w-4" />
                    <div className="flex flex-col">
                      <span className="font-medium">Invalid License</span>
                      <span className="text-xs opacity-75">
                        Please check your license key and try again
                      </span>
                    </div>
                  </>}
              </div>}
            <div className="bg-[#F4F5FA] p-4 rounded-md space-y-4">
              <div>
                <h3 className="text-sm font-semibold mb-2">
                  License Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span>Status:</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${isValid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {isValid ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Plan:</span>
                    <span className="text-[#2879fe]">{detailedInfo.plan}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Valid Until:</span>
                    <span>
                      {detailedInfo.validUntil?.toLocaleDateString() || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-2">
                  Included Features
                </h3>
                <div className="space-y-1">
                  {detailedInfo.features.map((feature, index) => <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      <span>{feature}</span>
                    </div>)}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-2">
                  Validation History
                </h3>
                <div className="space-y-2 max-h-32 overflow-auto">
                  {validationAttempts.map((attempt, index) => <div key={index} className="flex items-center justify-between text-xs p-2 rounded-md bg-white">
                      <div className="flex items-center gap-2">
                        {attempt.success ? <CheckCircle2 className="h-3 w-3 text-green-500" /> : <XCircle className="h-3 w-3 text-red-500" />}
                        <span>{attempt.key}</span>
                      </div>
                      <div className="text-gray-500">
                        {attempt.timestamp.toLocaleString()}
                      </div>
                    </div>)}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
}