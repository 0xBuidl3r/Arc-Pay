"use client";

import { useState, useEffect, useRef } from "react";
import { http, createPublicClient, PublicClient, TransactionReceiptNotFoundError } from "viem";
import { ARC_CHAIN } from "./wagmi";
import { checkTxOnExplorer } from "./explorer";

const RPC_POLL_DELAY = 2000;
const MAX_RPC_ATTEMPTS = 5;
const EXPLORER_POLL_DELAY = 4000;
const MAX_EXPLORER_ATTEMPTS = 8;

function createARCClient(): PublicClient {
  return createPublicClient({
    chain: ARC_CHAIN,
    transport: http(),
  });
}

export interface ConfirmationState {
  isConfirming: boolean;
  isConfirmed: boolean;
  source: "rpc" | "explorer" | null;
  blockNumber: bigint | null;
  error: string | null;
  attempts: number;
}

export function useTransactionConfirmation(txHash: string | null | undefined): ConfirmationState {
  const [state, setState] = useState<ConfirmationState>({
    isConfirming: false,
    isConfirmed: false,
    source: null,
    blockNumber: null,
    error: null,
    attempts: 0,
  });

  const rpcPollCountRef = useRef(0);
  const explorerPollCountRef = useRef(0);
  const rpcPollingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const explorerPollingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const confirmedRef = useRef(false);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!txHash) {
      setState({
        isConfirming: false,
        isConfirmed: false,
        source: null,
        blockNumber: null,
        error: null,
        attempts: 0,
      });
      return;
    }

    if (startedRef.current) return;
    startedRef.current = true;
    confirmedRef.current = false;

    rpcPollCountRef.current = 0;
    explorerPollCountRef.current = 0;

    setState({
      isConfirming: true,
      isConfirmed: false,
      source: null,
      blockNumber: null,
      error: null,
      attempts: 0,
    });

    const stopAllPolling = () => {
      if (rpcPollingRef.current) {
        clearTimeout(rpcPollingRef.current);
        rpcPollingRef.current = null;
      }
      if (explorerPollingRef.current) {
        clearTimeout(explorerPollingRef.current);
        explorerPollingRef.current = null;
      }
    };

    const resolveWithSuccess = (blockNumber: bigint, source: "rpc" | "explorer") => {
      if (confirmedRef.current) return;
      confirmedRef.current = true;
      stopAllPolling();
      setState({
        isConfirming: false,
        isConfirmed: true,
        source,
        blockNumber,
        error: null,
        attempts: rpcPollCountRef.current + explorerPollCountRef.current,
      });
    };

    const resolveWithError = (errorMsg: string) => {
      stopAllPolling();
      setState((prev) => ({
        ...prev,
        isConfirming: false,
        isConfirmed: false,
        error: errorMsg,
        attempts: rpcPollCountRef.current + explorerPollCountRef.current,
      }));
    };

    // ============================================================
    // STEP 1: Short RPC polling
    // ============================================================
    // Try getTransactionReceipt a few times first. It's faster
    // when it works. If the RPC has the receipt, we get block info.
    const pollRPC = async () => {
      rpcPollCountRef.current++;
      const attempt = rpcPollCountRef.current;
      console.log(`[RPC] Attempt ${attempt}/${MAX_RPC_ATTEMPTS} for ${txHash}`);

      setState((prev) => ({ ...prev, attempts: attempt }));

      try {
        const client = createARCClient();
        const receipt = await client.getTransactionReceipt({ hash: txHash as `0x${string}` });

        console.log(`[RPC] Receipt found! block=${receipt.blockNumber}, status=${receipt.status}`);
        resolveWithSuccess(receipt.blockNumber, "rpc");
        return;
      } catch (error) {
        if (error instanceof TransactionReceiptNotFoundError) {
          console.log(`[RPC] Receipt not found (attempt ${attempt})`);
          if (rpcPollCountRef.current >= MAX_RPC_ATTEMPTS) {
            console.log("[RPC] Max RPC attempts reached, switching to explorer fallback");
            startExplorerPolling();
          }
        } else {
          console.warn(`[RPC] Unexpected error:`, error);
          if (rpcPollCountRef.current >= MAX_RPC_ATTEMPTS) {
            console.log("[RPC] Max RPC attempts reached, switching to explorer fallback");
            startExplorerPolling();
          }
        }
      }

      if (!confirmedRef.current && rpcPollCountRef.current < MAX_RPC_ATTEMPTS) {
        rpcPollingRef.current = setTimeout(pollRPC, RPC_POLL_DELAY);
      }
    };

    // ============================================================
    // STEP 2: Explorer fallback polling
    // ============================================================
    // If RPC doesn't find the receipt, fall back to checking the
    // Blockscout explorer API. The explorer has indexed the tx
    // even if RPC hasn't cached the receipt yet.
    const startExplorerPolling = () => {
      console.log("[Explorer] Starting explorer polling...");
      pollExplorer();
    };

    const pollExplorer = async () => {
      explorerPollCountRef.current++;
      const attempt = explorerPollCountRef.current;
      console.log(`[Explorer] Attempt ${attempt}/${MAX_EXPLORER_ATTEMPTS} for ${txHash}`);

      setState((prev) => ({ ...prev, attempts: rpcPollCountRef.current + attempt }));

      const result = await checkTxOnExplorer(txHash);

      if (result.confirmed) {
        console.log(`[Explorer] Transaction confirmed! block=${result.blockNumber}`);
        resolveWithSuccess(BigInt(result.blockNumber ?? 0), "explorer");
        return;
      }

      console.log(`[Explorer] Tx not yet indexed (attempt ${attempt})`);

      if (explorerPollCountRef.current >= MAX_EXPLORER_ATTEMPTS) {
        console.log("[Explorer] Max explorer attempts reached");
        resolveWithError("Transaction confirmation timeout - please check your wallet");
        return;
      }

      if (!confirmedRef.current) {
        explorerPollingRef.current = setTimeout(pollExplorer, EXPLORER_POLL_DELAY);
      }
    };

    // Start with RPC polling
    pollRPC();

    return () => {
      stopAllPolling();
      startedRef.current = false;
      confirmedRef.current = false;
    };
  }, [txHash]);

  return state;
}