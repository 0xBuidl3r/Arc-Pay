"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { 
  PaymentSession, 
  PaymentStatus, 
  sessionManager,
  generatePaymentUrl,
  createSessionManager,
} from "@/lib/session";

interface SessionContextType {
  sessions: PaymentSession[];
  createSession: (data: { recipient: string; amount: string; note?: string }) => PaymentSession;
  getSession: (id: string) => PaymentSession | null;
  updateSession: (id: string, updates: Partial<PaymentSession>) => void;
  isLoaded: boolean;
}

const SessionContext = createContext<SessionContextType>({
  sessions: [],
  createSession: () => ({ id: "", recipient: "", amount: "", note: "", status: "pending", createdAt: 0 }),
  getSession: () => null,
  updateSession: () => {},
  isLoaded: false,
});

export function usePaymentSessions() {
  return useContext(SessionContext);
}

interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [sessions, setSessions] = useState<PaymentSession[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const manager = createSessionManager();

  useEffect(() => {
    const loaded = manager.getAllSessions();
    setSessions(loaded);
    setIsLoaded(true);
  }, []);

  const createSession = useCallback((data: { recipient: string; amount: string; note?: string }) => {
    const session = manager.createSession({
      recipient: data.recipient,
      amount: data.amount,
      note: data.note || "",
    });
    setSessions((prev) => [session, ...prev]);
    return session;
  }, []);

  const getSession = useCallback((id: string) => {
    return manager.getSession(id);
  }, []);

  const updateSession = useCallback((id: string, updates: Partial<PaymentSession>) => {
    const updated = manager.updateSession(id, updates);
    if (updated) {
      setSessions((prev) =>
        prev.map((s) => (s.id === id ? updated : s))
      );
    }
  }, []);

  return (
    <SessionContext.Provider
      value={{
        sessions,
        createSession,
        getSession,
        updateSession,
        isLoaded,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export { sessionManager, generatePaymentUrl };
export type { PaymentSession, PaymentStatus };