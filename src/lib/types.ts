export type MemoryType = "preference" | "boundary" | "fact" | "tone";
export type MemorySource = "manual" | "inferred" | "run";
export type RunStatus = "pending" | "running" | "succeeded" | "failed";
export type MessageRole = "user" | "recipient";

export interface Person {
  id: string;
  ownerUserId: string;
  displayName: string;
  relationshipLabel: string | null;
  pronouns: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Memory {
  id: string;
  ownerUserId: string;
  personId: string;
  type: MemoryType;
  content: string;
  confidence: number;
  source: MemorySource;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  role: MessageRole;
  text: string;
  sentAt: string | null;
}

export interface SuggestedReply {
  text: string;
  tone: string;
  riskLevel: "low" | "medium" | "high";
}

export interface WingmanResult {
  suggestedReplies: SuggestedReply[];
  reasoning: string;
  toneNotes: string[];
  memoryUsed: Array<{ id: string; type: MemoryType; label: string }>;
}

export interface WingmanRun {
  id: string;
  personId: string;
  personSnapshot: {
    id: string;
    displayName: string;
    relationshipLabel: string | null;
    pronouns: string | null;
  };
  status: RunStatus;
  result: WingmanResult | null;
  failureCode: string | null;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
  updatedAt: string;
  replayed: boolean;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
