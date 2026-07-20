const USER_ID_KEY = "sparkeefy-user-id";
export const DEMO_USER_ID = "demo-user";

function createAnonymousUserId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `user-${crypto.randomUUID()}`;
  }
  return `user-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getUserId(): string {
  if (typeof window === "undefined") return DEMO_USER_ID;
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = import.meta.env.PROD ? createAnonymousUserId() : DEMO_USER_ID;
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
}

export function setUserId(userId: string) {
  const trimmed = userId.trim();
  if (!/^[a-zA-Z0-9._-]{1,128}$/.test(trimmed)) {
    throw new Error("User ID must be 1-128 alphanumeric characters");
  }
  localStorage.setItem(USER_ID_KEY, trimmed);
}

export function useDemoAccount() {
  localStorage.setItem(USER_ID_KEY, DEMO_USER_ID);
  return DEMO_USER_ID;
}

export function resetUserId() {
  const userId = createAnonymousUserId();
  localStorage.setItem(USER_ID_KEY, userId);
  return userId;
}
