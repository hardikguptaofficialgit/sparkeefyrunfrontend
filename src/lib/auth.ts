const USER_ID_KEY = "sparkeefy-user-id";

export function getUserId(): string {
  if (typeof window === "undefined") return "demo-user";
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = "demo-user";
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
}

export function setUserId(userId: string) {
  localStorage.setItem(USER_ID_KEY, userId.trim());
}

export function resetUserId() {
  const userId = "demo-user";
  localStorage.setItem(USER_ID_KEY, userId);
  return userId;
}
