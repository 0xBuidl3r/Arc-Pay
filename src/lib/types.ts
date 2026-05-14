export type PaymentStatus = "pending" | "processing" | "completed" | "failed";

export interface Payment {
  id: string;
  recipient: string;
  amount: string;
  note: string | null;
  status: PaymentStatus;
  tx_hash: string | null;
  payer_wallet: string | null;
  created_at: string;
  paid_at: string | null;
}

export interface CreatePaymentInput {
  recipient: string;
  amount: string;
  note?: string;
}

export interface UpdatePaymentInput {
  status?: PaymentStatus;
  tx_hash?: string;
  payer_wallet?: string;
  paid_at?: string;
}