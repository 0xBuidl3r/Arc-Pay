# ARC Pay - Phase 3 Complete

A premium fintech-style payment app that allows users to generate and pay beautiful stablecoin payment links on the ARC blockchain.

## What Was Built

### Phase 3: Real ARC Payments

This phase transforms ARC Pay into a **working payment application** with real blockchain transactions.

### Key Features

1. **Wallet Connection** (via RainbowKit + wagmi)
   - Connect with 100+ wallets
   - Clean, premium modal
   - Disconnect option

2. **ARC Testnet Support**
   - Chain ID: 5042002
   - RPC: https://rpc.testnet.arc.network
   - Explorer: https://testnet.arcscan.app

3. **Network Detection & Switching**
   - Auto-detect wrong network
   - One-click switch to ARC
   - Add network automatically if missing

4. **Real USDC Transfers**
   - Send USDC on ARC blockchain
   - Parse transaction receipt
   - Wait for confirmation

5. **Transaction States**
   - Preparing
   - Waiting for wallet
   - Submitted
   - Confirmed
   - Success

6. **Success Screen**
   - Transaction hash display
   - Explorer verification link
   - Amount and recipient info

7. **Error Handling**
   - Toast notifications
   - Network warnings
   - Transaction failures

## File Structure

```
arc-pay/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with providers
│   │   ├── page.tsx            # Landing page
│   │   ├── globals.css         # Global styles
│   │   └── pay/
│   │       └── page.tsx       # Payment page (NEW)
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── PaymentCard.tsx      # Updated with wallet integration
│   │   │   ├── CopyButton.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── TransactionModal.tsx # NEW - Transaction states
│   │   │   └── index.ts
│   │   └── sections/
│   │       ├── Navbar.tsx           # Updated with ConnectButton
│   │       ├── Hero.tsx
│   │       ├── PaymentGenerator.tsx
│   │       ├── Features.tsx
│   │       └── Footer.tsx
│   │
│   ├── context/
│   │   └── WalletContext.tsx        # NEW - Wallet state management
│   │
│   ├── hooks/
│   │   └── usePaymentUrl.ts
│   │
│   └── lib/
│       ├── wagmi.ts                 # NEW - wagmi config with ARC
│       └── providers.tsx            # NEW - App providers
│
├── public/
├── package.json
├── tsconfig.json
└── README.md
```

## How It Works

### 1. Wallet Connection

```typescript
// Using RainbowKit ConnectButton in Navbar
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Navbar() {
  return <ConnectButton chainStatus="icon" accountStatus="avatar" />;
}
```

### 2. Network Configuration

```typescript
// src/lib/wagmi.ts
export const arcTestnet = {
  id: 5042002,
  name: "ARC Testnet",
  rpcUrls: {
    default: { http: ["https://rpc.testnet.arc.network"] },
  },
  blockExplorers: {
    default: {
      name: "ARCscan",
      url: "https://testnet.arcscan.app",
    },
  },
};
```

### 3. Transaction Flow

```typescript
// Payment page uses wagmi hooks
const { writeContract, data: txData } = useWriteContract();
const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash: txData });

const handlePay = () => {
  writeContract({
    address: USDC_CONTRACT_ADDRESS,  // USDC on Base testnet
    abi: erc20Abi,
    functionName: "transfer",
    args: [recipient, parseEther(amount)],
  });
};
```

### 4. Transaction States

The app tracks transaction progress:
- **idle** - Waiting for user
- **preparing** - Building transaction
- **waiting** - Wallet confirmation
- **submitted** - Sent to network
- **confirmed** - On-chain
- **success** - Payment complete
- **error** - Something failed

### 5. Network Switching

```typescript
const { switchChain } = useSwitchChain();

if (!isOnCorrectChain) {
  await switchChain({ chainId: ARC_CHAIN.id });
}
```

## Important Notes

### USDC Contract Address

Currently using USDC on Base testnet (testnet for ARC):
```
0x833589fCD6eDb6E08f4c7F32e1FC9660c16fAd89
```

**Note**: For a production ARC app, you'll need:
1. USDC deployed on ARC network
2. Update the contract address
3. Use ARC's USDC contract

### ERC20 Transfer ABI

```typescript
const erc20Abi = [
  {
    name: "transfer",
    type: "function",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    stateMutability: "nonpayable",
  },
];
```

### Decimal Handling

USDC uses 6 decimals, but `parseEther` uses 18. For production:

```typescript
// 6 decimal version
const amountInUSDC = BigInt(Math.floor(parseFloat(amount) * 1e6));

// Or use viem's parseUnits
import { parseUnits } from "viem";
const amountInUSDC = parseUnits(amount, 6);
```

## Running the App

```bash
cd arc-pay
npm run dev
```

Then:
1. Open http://localhost:3000
2. Click "Connect Wallet"
3. Create a payment link
4. Visit `/pay` page
5. Click "Pay Now"
6. Confirm in your wallet

## What's Next?

Phase 4 could include:
- [ ] Backend to store payment links
- [ ] Database for transaction history
- [ ] User accounts
- [ ] Real USDC on ARC network
- [ ] Payment expiry
- [ ] Multiple token support
- [ ] Analytics dashboard

## Tech Stack

- **Next.js 16** - App Router, Server Components
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **wagmi v2** - Ethereum interaction
- **viem** - Low-level blockchain calls
- **RainbowKit** - Wallet connection UI
- **TanStack Query** - Data fetching

## Beginner Guide

### How to Add New Components

1. Create in `src/components/ui/`
2. Export from `index.ts`
3. Import where needed

### How to Add New Pages

1. Create folder in `src/app/`
2. Add `page.tsx`
3. Use "use client" for interactivity

### How to Update Styles

Edit `src/app/globals.css` for global styles.

Use Tailwind classes for component styles.

### How to Change Colors

Tailwind uses cyan by default. Update in:
- Button component
- PaymentCard
- Gradients

## Common Issues

### "Module not found"

Run `npm install` to install dependencies.

### Wallet not connecting

1. Check you're on a supported browser
2. Install a wallet extension (MetaMask, Coinbase, etc.)
3. Try clearing browser cache

### Transaction failing

1. Check you're on ARC Testnet
2. Verify wallet has USDC
3. Check network settings

## Resources

- [wagmi docs](https://wagmi.sh)
- [RainbowKit docs](https://www.rainbowkit.com)
- [viem docs](https://viem.sh)
- [ARC Testnet Faucet](https://www.base.orgfaucet)
- [ARC Explorer](https://testnet.arcscan.app)