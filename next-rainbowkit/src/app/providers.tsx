"use client";

import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import * as React from "react";
import { WagmiConfig } from "wagmi";
import "../utils/global.css";

import Navbar from "../components/Navbar";
import { chains, config } from "../wagmi";
import Home from "../components/Home";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider chains={chains}>
        <Navbar />
        {mounted && children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
