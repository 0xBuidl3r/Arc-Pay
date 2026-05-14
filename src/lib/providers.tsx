"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { config } from "./wagmi";
import { ReactNode, useState } from "react";
import { WalletProvider } from "@/context/WalletContext";
import { SessionProvider } from "@/context/SessionContext";
import { ToastProvider } from "@/components/ui/Toast";
import "@rainbow-me/rainbowkit/styles.css";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#22d3ee",
            accentColorForeground: "black",
            borderRadius: "large",
            fontStack: "system",
          })}
          modalSize="compact"
        >
          <WalletProvider>
            <SessionProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </SessionProvider>
          </WalletProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}