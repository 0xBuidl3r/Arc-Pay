"use client";

export type PaymentStatus = "pending" | "processing" | "completed" | "failed" | "expired";

export interface PaymentSession {
  id: string;
  recipient: string;
  amount: string;
  note: string;
  status: PaymentStatus;
  txHash?: string;
  createdAt: number;
  paidAt?: number;
  failedAt?: number;
  error?: string;
}

export interface PaymentLink {
  sessionId: string;
  url: string;
  shortUrl: string;
}

const STORAGE_PREFIX = "arc-pay-";
const SESSIONS_KEY = `${STORAGE_PREFIX}sessions`;

function generateSessionId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return `arc_${timestamp}${random}`;
}

function getSessions(): Record<string, PaymentSession> {
  if (typeof window === "undefined") return {};
  
  try {
    const stored = localStorage.getItem(SESSIONS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveSessions(sessions: Record<string, PaymentSession>): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error("Failed to save sessions:", error);
  }
}

export interface SessionManager {
  createSession(data: Omit<PaymentSession, "id" | "status" | "createdAt">): PaymentSession;
  getSession(id: string): PaymentSession | null;
  updateSession(id: string, updates: Partial<PaymentSession>): PaymentSession | null;
  getAllSessions(): PaymentSession[];
  getSessionsByStatus(status: PaymentStatus): PaymentSession[];
  deleteSession(id: string): boolean;
  clearAllSessions(): void;
}

export function createSessionManager(): SessionManager {
  return {
    createSession(data) {
      const sessions = getSessions();
      const id = generateSessionId();
      
      const session: PaymentSession = {
        id,
        recipient: data.recipient,
        amount: data.amount,
        note: data.note || "",
        status: "pending",
        createdAt: Date.now(),
        txHash: undefined,
        paidAt: undefined,
        failedAt: undefined,
        error: undefined,
      };
      
      sessions[id] = session;
      saveSessions(sessions);
      
      return session;
    },

    getSession(id) {
      const sessions = getSessions();
      return sessions[id] || null;
    },

    updateSession(id, updates) {
      const sessions = getSessions();
      
      if (!sessions[id]) return null;
      
      sessions[id] = {
        ...sessions[id],
        ...updates,
      };
      
      saveSessions(sessions);
      
      return sessions[id];
    },

    getAllSessions() {
      const sessions = getSessions();
      return Object.values(sessions).sort((a, b) => b.createdAt - a.createdAt);
    },

    getSessionsByStatus(status) {
      const sessions = getSessions();
      return Object.values(sessions)
        .filter((s) => s.status === status)
        .sort((a, b) => b.createdAt - a.createdAt);
    },

    deleteSession(id) {
      const sessions = getSessions();
      
      if (!sessions[id]) return false;
      
      delete sessions[id];
      saveSessions(sessions);
      
      return true;
    },

    clearAllSessions() {
      saveSessions({});
    },
  };
}

export function generatePaymentUrl(sessionId: string): string {
  if (typeof window === "undefined") return "";
  const baseUrl = window.location.origin;
  return `${baseUrl}/pay/${sessionId}`;
}

export function generateShortUrl(sessionId: string): string {
  return `/pay/${sessionId}`;
}

export const sessionManager = createSessionManager();

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export function formatAddress(address: string): string {
  if (!address) return "";
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}