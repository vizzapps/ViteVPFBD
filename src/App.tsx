import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Bundler } from "./pages/Bundler";
import { WalletManager } from "./pages/WalletManager";
import { Settings } from "./pages/Settings";
export function App() {
  return <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/bundler" element={<Bundler />} />
          <Route path="/wallet" element={<WalletManager />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>;
}