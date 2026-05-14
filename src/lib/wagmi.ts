import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet } from "wagmi/chains";

export const arcTestnet = {
  id: 5042002,
  name: "ARC Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "USDC",
    symbol: "USDC",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.testnet.arc.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "ARCscan",
      url: "https://testnet.arcscan.app",
    },
  },
  testnet: true,
} as const;

export const config = getDefaultConfig({
  appName: "ARC Pay",
  projectId: "arc-pay-demo",
  chains: [arcTestnet],
  ssr: true,
});

export const ARC_CHAIN = arcTestnet;

export const ARC_EXPLORER_URL = "https://testnet.arcscan.app";

export const USDC_CONTRACT_ADDRESS = "0x3600000000000000000000000000000000000000" as const;

export const erc20Abi = [
  {
    name: "balanceOf",
    type: "function",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    name: "transfer",
    type: "function",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    name: "decimals",
    type: "function",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
  },
  {
    name: "symbol",
    type: "function",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
  },
] as const;