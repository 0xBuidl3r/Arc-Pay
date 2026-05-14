import { useState, useEffect, useCallback } from "react";

interface PaymentData {
  recipient: string;
  amount: string;
  note: string;
}

export function usePaymentUrl() {
  const [paymentData, setPaymentData] = useState<PaymentData>({
    recipient: "",
    amount: "",
    note: "",
  });

  const [paymentUrl, setPaymentUrl] = useState("");

  useEffect(() => {
    if (paymentData.recipient || paymentData.amount || paymentData.note) {
      const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
      const params = new URLSearchParams();
      
      if (paymentData.recipient) params.set("to", paymentData.recipient);
      if (paymentData.amount) params.set("amount", paymentData.amount);
      if (paymentData.note) params.set("note", paymentData.note);
      
      const url = `${baseUrl}/pay?${params.toString()}`;
      setPaymentUrl(url);
    } else {
      setPaymentUrl("");
    }
  }, [paymentData]);

  const updateField = useCallback((field: keyof PaymentData, value: string) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  }, []);

  return {
    paymentData,
    paymentUrl,
    updateField,
  };
}