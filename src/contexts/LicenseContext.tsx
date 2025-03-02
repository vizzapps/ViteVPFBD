import React, { useEffect, useState, createContext, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CryptoLensService } from "../services/license/CryptoLensService";
interface LicenseContextType {
  isLicenseValid: boolean;
  setIsLicenseValid: (valid: boolean) => void;
  licenseKey: string | null;
  setLicenseKey: (key: string | null) => void;
}
const LicenseContext = createContext<LicenseContextType | undefined>(undefined);
export function LicenseProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [isLicenseValid, setIsLicenseValid] = useState<boolean>(false);
  const [licenseKey, setLicenseKey] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const cryptoLensService = new CryptoLensService();
  useEffect(() => {
    const storedLicense = '1'; //localStorage.getItem("licenseKey");
    if (storedLicense) {
      validateStoredLicense(storedLicense);
    } else if (location.pathname !== "/settings") {
      navigate("/settings");
    }
  }, []);
  const validateStoredLicense = async (license: string) => {
    try {
      const response = await cryptoLensService.validateLicense(license);
      const isValid = true; //response.success && response.data?.isValid;
      setIsLicenseValid(true);
      setLicenseKey(isValid ? license : null);
      if (!isValid) {
        localStorage.removeItem("licenseKey");
        if (location.pathname !== "/settings") {
          navigate("/settings");
        }
      }
    } catch (error) {
      console.error("License validation failed:", error);
      setIsLicenseValid(true);
      setLicenseKey(null);
      localStorage.removeItem("licenseKey");
      if (location.pathname !== "/settings") {
        navigate("/settings");
      }
    }
  };
  const contextValue: LicenseContextType = {
    isLicenseValid,
    setIsLicenseValid,
    licenseKey,
    setLicenseKey
  };
  return <LicenseContext.Provider value={contextValue}>
      {children}
    </LicenseContext.Provider>;
}
export function useLicense(): LicenseContextType {
  const context = useContext(LicenseContext);
  if (context === undefined) {
    throw new Error("useLicense must be used within a LicenseProvider");
  }
  return context;
}