import { supabase, isSupabaseConfigured, supabaseUrl } from "./supabase";
import type { Payment, CreatePaymentInput, UpdatePaymentInput } from "./types";

console.log("=".repeat(50));
console.log("PAYMENTS MODULE LOADED");
console.log("=".repeat(50));

function generatePaymentId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return "arc_" + timestamp + random;
}

export async function createPayment(input: CreatePaymentInput): Promise<Payment | null> {
  console.log("=".repeat(50));
  console.log("CREATE PAYMENT");
  console.log("=".repeat(50));
  
  if (!isSupabaseConfigured) {
    console.error("Supabase not configured");
    return null;
  }

  const id = generatePaymentId();
  
  const payload = {
    id,
    recipient: input.recipient,
    amount: input.amount,
    note: input.note || null,
    status: "pending",
    tx_hash: null,
    payer_wallet: null,
    created_at: new Date().toISOString(),
    paid_at: null,
  };

  console.log("Payload:", JSON.stringify(payload));

  try {
    console.log("Attempting INSERT into payments table...");
    console.log("Target:", supabaseUrl);
    
    const { data, error, status, statusText } = await supabase
      .from("payments")
      .insert(payload)
      .select();

    console.log("Status:", status, statusText);
    console.log("Data:", data);
    console.log("Error object:", JSON.stringify(error));
    console.log("Error keys:", error ? Object.keys(error) : "null");

    if (error) {
      console.error("INSERT FAILED!");
      console.error("Message:", error.message);
      console.error("Code:", error.code);
      console.error("Hint:", error.hint);
      console.error("Details:", error.details);
      return null;
    }

    if (!data || data.length === 0) {
      console.error("No data returned");
      return null;
    }

    console.log("SUCCESS:", data[0]);
    return data[0] as Payment;
  } catch (err) {
    console.error("EXCEPTION:", err);
    return null;
  }
}

export async function getPaymentById(id: string): Promise<Payment | null> {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("FETCH ERROR:", error);
    return null;
  }

  return data as Payment;
}

export async function updatePayment(id: string, input: UpdatePaymentInput): Promise<Payment | null> {
  const updateData: Record<string, unknown> = {};
  
  if (input.status) updateData.status = input.status;
  if (input.tx_hash) updateData.tx_hash = input.tx_hash;
  if (input.payer_wallet) updateData.payer_wallet = input.payer_wallet;
  if (input.paid_at) updateData.paid_at = input.paid_at;

  const { data, error } = await supabase
    .from("payments")
    .update(updateData)
    .eq("id", id)
    .select();

  if (error) {
    console.error("UPDATE ERROR:", error);
    return null;
  }

  return data?.[0] as Payment || null;
}

export async function getAllPayments(limit = 50): Promise<Payment[]> {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error:", error);
    return [];
  }

  return (data as Payment[]) || [];
}

export async function markPaymentAsCompleted(id: string): Promise<Payment | null> {
  return updatePayment(id, {
    status: "completed",
    paid_at: new Date().toISOString(),
  });
}

export async function markPaymentAsFailed(id: string): Promise<Payment | null> {
  return updatePayment(id, { status: "failed" });
}

export async function markPaymentAsProcessing(id: string, txHash: string, payerWallet: string): Promise<Payment | null> {
  return updatePayment(id, {
    status: "processing",
    tx_hash: txHash,
    payer_wallet: payerWallet,
  });
}