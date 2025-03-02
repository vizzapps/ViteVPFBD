import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Bundler } from "./pages/Bundler";
import { WalletManager } from "./pages/WalletManager";
import { Settings } from "./pages/Settings";
import { LicenseProvider, useLicense } from "./contexts/LicenseContext";
const ProtectedRoute = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const {
    isLicenseValid
  } = useLicense();
  if (!isLicenseValid) {
    return <Navigate to="/settings" replace />;
  }
  return <>{children}</>;
};
export function App() {
  return <BrowserRouter>
      <LicenseProvider children={undefined}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/settings" element={<Settings />} />
            <Route path="/" element={<ProtectedRoute children={undefined}>
                  <Dashboard />
                </ProtectedRoute>} />
            <Route path="/bundler" element={<ProtectedRoute>
                  <Bundler />
                </ProtectedRoute>} />
            <Route path="/wallet" element={<ProtectedRoute>
                  <WalletManager />
                </ProtectedRoute>} />
          </Route>
        </Routes>
      </LicenseProvider>
    </BrowserRouter>;
}