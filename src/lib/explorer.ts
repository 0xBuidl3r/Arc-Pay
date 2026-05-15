/**
 * ARC Explorer (Blockscout) API Service
 *
 * This service queries the ARC Blockscout explorer API as the source of truth
 * for transaction confirmation. This is more reliable than raw RPC polling
 * because the explorer has indexed the transaction on-chain.
 *
 * API Base: https://testnet.arcscan.app/api/v2
 */

const EXPLORER_BASE = "https://testnet.arcscan.app/api/v2";

export interface ExplorerTransaction {
  hash: string;
  block_number: number;
  block_hash: string;
  block_timestamp: number;
  from: { hash: string };
  to: { hash: string } | null;
  value: string;
  gas_used: string;
  gas_limit: string;
  gas_price: string;
  status: "ok" | "error" | "";
  method: string | null;
  call_type: string | null;
}

export interface ExplorerTxStatus {
  hash: string;
  confirmed: boolean;
  blockNumber: number | null;
  timestamp: number | null;
  status: "ok" | "error" | "pending" | "not_found";
}

async function fetchExplorer<T>(endpoint: string, retries: number = 3): Promise<T | null> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(`${EXPLORER_BASE}${endpoint}`, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 429) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
        lastError = new Error(`Rate limited (attempt ${attempt})`);
        continue;
      }

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        console.warn(`Explorer API error: ${response.status}`);
        lastError = new Error(`HTTP ${response.status}`);
        await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
        continue;
      }

      return (await response.json()) as T;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`Explorer fetch attempt ${attempt} failed:`, lastError.message);
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
      }
    }
  }

  console.error(`Explorer fetch failed after ${retries} attempts:`, lastError?.message);
  return null;
}

export async function checkTxOnExplorer(txHash: string): Promise<ExplorerTxStatus> {
  console.log(`[Explorer] Checking tx: ${txHash}`);

  try {
    const data = await fetchExplorer<ExplorerTransaction>(`/transactions/${txHash}`);

    if (!data) {
      console.log(`[Explorer] Transaction not found on explorer: ${txHash}`);
      return {
        hash: txHash,
        confirmed: false,
        blockNumber: null,
        timestamp: null,
        status: "not_found",
      };
    }

    console.log(`[Explorer] Transaction found! status=${data.status}, block=${data.block_number}`);

    return {
      hash: data.hash,
      confirmed: true,
      blockNumber: data.block_number,
      timestamp: data.block_timestamp,
      status: data.status === "ok" ? "ok" : "error",
    };
  } catch (error) {
    console.error(`[Explorer] Error checking tx:`, error);
    return {
      hash: txHash,
      confirmed: false,
      blockNumber: null,
      timestamp: null,
      status: "not_found",
    };
  }
}

export async function isTransactionIndexed(txHash: string): Promise<boolean> {
  const status = await checkTxOnExplorer(txHash);
  return status.confirmed;
}